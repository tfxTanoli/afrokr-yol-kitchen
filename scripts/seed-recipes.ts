/**
 * Seeds the original Afrodelicious recipes into Supabase.
 *
 * Runs as a regular *administrator account* (no service-role key needed): every
 * write goes through the same RLS policies as the application.
 *
 *   SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... npx tsx scripts/seed-recipes.ts
 *
 * Idempotent: recipes are upserted on their slug, images on their path.
 */
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_RECIPES } from '../src/data/initialData';
import type { Database, Json } from '../src/lib/database.types';

dotenv.config({ path: '.env.local' });
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!url || !key || !email || !password) {
  console.error('Missing VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD.');
  process.exit(1);
}

const supabase = createClient<Database>(url, key, { auth: { persistSession: false } });
const BUCKET = 'recipe-images';
const uploaded = new Map<string, string>();

/** Uploads a bundled `/src/assets/...` image to Storage and returns its public URL. */
async function toPublicUrl(src: string | undefined): Promise<string | null> {
  if (!src) return null;
  if (!src.startsWith('/src/assets/')) return src;
  if (uploaded.has(src)) return uploaded.get(src)!;

  const filePath = path.join(process.cwd(), src);
  const objectPath = `seed/${path.basename(src)}`;
  const contentType = src.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, fs.readFileSync(filePath), { contentType, upsert: true, cacheControl: '31536000' });
  if (error) throw new Error(`Upload failed for ${src}: ${error.message}`);

  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
  uploaded.set(src, publicUrl);
  return publicUrl;
}

async function main() {
  const { error: authError } = await supabase.auth.signInWithPassword({ email: email!, password: password! });
  if (authError) throw new Error(`Admin sign-in failed: ${authError.message}`);

  const rows: Database['public']['Tables']['recipes']['Insert'][] = [];
  for (const r of INITIAL_RECIPES) {
    rows.push({
      slug: r.id,
      title: r.title,
      description: r.description,
      ingredients: r.ingredients as unknown as Json,
      instructions: r.steps as unknown as Json,
      preparation_time: r.prepTimeMinutes,
      cooking_time: r.cookTimeMinutes,
      servings: r.servings,
      difficulty: r.difficulty,
      category: r.category,
      country: r.country,
      country_flag: r.countryFlag,
      heritage_story: r.heritageStory ?? null,
      image_url: await toPublicUrl(r.imageUrl),
      author_name: r.authorName,
      author_handle: r.authorHandle,
      author_avatar_url: await toPublicUrl(r.authorAvatar),
      is_published: true,
    });
  }

  const { data, error } = await supabase.from('recipes').upsert(rows, { onConflict: 'slug' }).select('slug, title');
  if (error) throw new Error(`Recipe upsert failed: ${error.message}`);
  console.log(`Seeded ${data.length} recipes:`, data.map(d => d.slug).join(', '));
  await supabase.auth.signOut();
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
