/**
 * End-to-end authorization tests against the live Supabase project (RLS, grants,
 * RPCs and storage policies) using an anonymous client, a regular member and an
 * administrator.
 *
 *   TEST_ADMIN_EMAIL=... TEST_ADMIN_PASSWORD=... \
 *   TEST_USER_EMAIL=...  TEST_USER_PASSWORD=...  npx tsx scripts/test-security.ts
 *
 * Creates and removes its own temporary draft recipe and image.
 */
import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/database.types';

dotenv.config({ path: '.env.local' });
dotenv.config();

const url = process.env.VITE_SUPABASE_URL!;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const env = (name: string) => {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return v;
};

type Client = SupabaseClient<Database>;
const newClient = (): Client => createClient<Database>(url, key, { auth: { persistSession: false } });

let passed = 0;
let failed = 0;
async function check(name: string, fn: () => Promise<boolean | string>) {
  try {
    const result = await fn();
    if (result === true) {
      passed++;
      console.log(`  ✔ ${name}`);
    } else {
      failed++;
      console.log(`  ✘ ${name}${typeof result === 'string' ? ` — ${result}` : ''}`);
    }
  } catch (e) {
    failed++;
    console.log(`  ✘ ${name} — threw ${(e as Error).message}`);
  }
}

async function signIn(email: string, password: string): Promise<{ client: Client; id: string }> {
  const client = newClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`sign-in failed for ${email}: ${error.message}`);
  return { client, id: data.user.id };
}

const draftRecipe = {
  title: 'Test sécurité (brouillon)',
  description: 'Recette temporaire créée par scripts/test-security.ts',
  ingredients: [{ id: '1', name: 'Sel', amount: 1, unit: 'pincée', aisle: 'Épicerie & Épices Afro' }],
  instructions: [{ stepNumber: 1, title: 'Test', instruction: 'Test' }],
  category: 'Plats Traditionnels',
  difficulty: 'Facile',
  is_published: false,
};

async function main() {
  const anon = newClient();
  const admin = await signIn(env('TEST_ADMIN_EMAIL'), env('TEST_ADMIN_PASSWORD'));
  const user = await signIn(env('TEST_USER_EMAIL'), env('TEST_USER_PASSWORD'));

  // Fixture: a draft created by the admin
  const { data: draft, error: draftErr } = await admin.client.from('recipes').insert(draftRecipe).select('*').single();
  if (draftErr || !draft) throw new Error(`could not create draft fixture: ${draftErr?.message}`);
  const { data: published } = await admin.client.from('recipes').select('id').eq('is_published', true).limit(1).single();

  console.log('\nAnonymous visitor');
  await check('cannot read recipes', async () => {
    const { data, error } = await anon.from('recipes').select('id');
    return Boolean(error) || data?.length === 0;
  });
  await check('cannot read profiles', async () => {
    const { data, error } = await anon.from('profiles').select('id');
    return Boolean(error) || data?.length === 0;
  });
  await check('cannot call set_user_role', async () => {
    const { error } = await anon.rpc('set_user_role', { target_user_id: user.id, new_role: 'admin' });
    return Boolean(error);
  });

  console.log('\nRegular member');
  await check('reads published recipes', async () => {
    const { data, error } = await user.client.from('recipes').select('id, is_published');
    if (error) return error.message;
    return data.length > 0 && data.every(r => r.is_published);
  });
  await check('cannot read a draft, even by id', async () => {
    const { data } = await user.client.from('recipes').select('id').eq('id', draft.id);
    return data?.length === 0;
  });
  await check('cannot create a recipe', async () => {
    const { error } = await user.client.from('recipes').insert({ ...draftRecipe, title: 'Hack' });
    return Boolean(error);
  });
  await check('cannot update a recipe', async () => {
    const { data } = await user.client.from('recipes').update({ title: 'Hacked title' }).eq('id', published!.id).select('id');
    return !data || data.length === 0;
  });
  await check('cannot publish a draft', async () => {
    const { data } = await user.client.from('recipes').update({ is_published: true }).eq('id', draft.id).select('id');
    return !data || data.length === 0;
  });
  await check('cannot delete a recipe', async () => {
    const { data } = await user.client.from('recipes').delete().eq('id', published!.id).select('id');
    return !data || data.length === 0;
  });
  await check('sees only own profile', async () => {
    const { data, error } = await user.client.from('profiles').select('id');
    if (error) return error.message;
    return data.length === 1 && data[0].id === user.id;
  });
  await check('cannot read admin profile by id', async () => {
    const { data } = await user.client.from('profiles').select('id').eq('id', admin.id);
    return data?.length === 0;
  });
  await check('cannot update another user\'s profile', async () => {
    const { data } = await user.client.from('profiles').update({ full_name: 'Pwned' }).eq('id', admin.id).select('id');
    return !data || data.length === 0;
  });
  await check('can update own profile (name, bio, specialties)', async () => {
    const { data: before } = await user.client.from('profiles').select('full_name, bio, specialties').eq('id', user.id).single();
    const { data, error } = await user.client
      .from('profiles')
      .update({ full_name: 'Membre Test (maj)', bio: 'Bio test', specialties: ['Yassa'] })
      .eq('id', user.id)
      .select('full_name')
      .single();
    await user.client.from('profiles').update(before!).eq('id', user.id);
    return !error && data?.full_name === 'Membre Test (maj)';
  });
  await check('cannot change own email/handle columns directly', async () => {
    const { error: e1 } = await user.client.from('profiles').update({ email: 'evil@example.com' }).eq('id', user.id);
    const { error: e2 } = await user.client.from('profiles').update({ handle: '@admin' }).eq('id', user.id);
    return Boolean(e1) && Boolean(e2);
  });
  await check('profile validation rejects oversized bio', async () => {
    const { error } = await user.client.from('profiles').update({ bio: 'x'.repeat(1001) }).eq('id', user.id);
    return Boolean(error);
  });
  await check('reads own role = user', async () => {
    const { data } = await user.client.from('user_roles').select('user_id, role');
    return data?.length === 1 && data[0].role === 'user';
  });
  await check('cannot update own role', async () => {
    const { data, error } = await user.client.from('user_roles').update({ role: 'admin' }).eq('user_id', user.id).select('role');
    return Boolean(error) || !data || data.length === 0;
  });
  await check('cannot insert a role row', async () => {
    const { error } = await user.client.from('user_roles').insert({ user_id: user.id, role: 'admin' });
    return Boolean(error);
  });
  await check('cannot self-promote via set_user_role', async () => {
    const { error } = await user.client.rpc('set_user_role', { target_user_id: user.id, new_role: 'admin' });
    return Boolean(error);
  });
  await check('is_admin() = false', async () => {
    const { data } = await user.client.rpc('is_admin');
    return data === false;
  });
  await check('cannot upload recipe images', async () => {
    const { error } = await user.client.storage
      .from('recipe-images')
      .upload(`recipes/test-${Date.now()}.png`, new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' }), { contentType: 'image/png' });
    return Boolean(error);
  });
  await check('role still "user" after all attempts', async () => {
    const { data } = await admin.client.from('user_roles').select('role').eq('user_id', user.id).single();
    return data?.role === 'user';
  });

  console.log('\nAdministrator');
  await check('reads all recipes including drafts', async () => {
    const { data } = await admin.client.from('recipes').select('id').eq('id', draft.id);
    return data?.length === 1;
  });
  await check('reads all profiles', async () => {
    const { data } = await admin.client.from('profiles').select('id');
    return (data?.length ?? 0) >= 2;
  });
  await check('updates a recipe', async () => {
    const { data, error } = await admin.client.from('recipes').update({ title: 'Test sécurité (modifié)' }).eq('id', draft.id).select('title').single();
    return !error && data.title === 'Test sécurité (modifié)';
  });
  await check('publishes then unpublishes a recipe (published_at tracked)', async () => {
    const { data: pub } = await admin.client.from('recipes').update({ is_published: true }).eq('id', draft.id).select('is_published, published_at').single();
    const { data: unpub } = await admin.client.from('recipes').update({ is_published: false }).eq('id', draft.id).select('is_published, published_at').single();
    return pub?.is_published === true && pub.published_at !== null && unpub?.is_published === false && unpub.published_at === null;
  });
  await check('created_by cannot be spoofed', async () => {
    const { data } = await admin.client.from('recipes').update({ created_by: user.id }).eq('id', draft.id).select('created_by').single();
    return data?.created_by === admin.id;
  });
  await check('database rejects invalid difficulty', async () => {
    const { error } = await admin.client.from('recipes').update({ difficulty: 'Impossible' }).eq('id', draft.id);
    return Boolean(error);
  });
  await check('uploads and deletes a recipe image', async () => {
    const path = `recipes/test-${Date.now()}.png`;
    const { error: upErr } = await admin.client.storage
      .from('recipe-images')
      .upload(path, new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' }), { contentType: 'image/png' });
    const { data: removed } = await admin.client.storage.from('recipe-images').remove([path]);
    return !upErr && removed?.length === 1;
  });
  await check('promotes and demotes a member via set_user_role', async () => {
    const { error: e1 } = await admin.client.rpc('set_user_role', { target_user_id: user.id, new_role: 'admin' });
    const { data: mid } = await admin.client.from('user_roles').select('role').eq('user_id', user.id).single();
    const { error: e2 } = await admin.client.rpc('set_user_role', { target_user_id: user.id, new_role: 'user' });
    const { data: end } = await admin.client.from('user_roles').select('role').eq('user_id', user.id).single();
    return !e1 && !e2 && mid?.role === 'admin' && end?.role === 'user';
  });
  await check('cannot remove own admin role (lock-out protection)', async () => {
    const { error } = await admin.client.rpc('set_user_role', { target_user_id: admin.id, new_role: 'user' });
    return Boolean(error);
  });
  await check('deletes a recipe', async () => {
    const { data } = await admin.client.from('recipes').delete().eq('id', draft.id).select('id');
    return data?.length === 1;
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  await admin.client.auth.signOut();
  await user.client.auth.signOut();
  process.exit(failed ? 1 : 0);
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
