import { supabase, RECIPE_IMAGES_BUCKET } from '../lib/supabase';
import type { Database, Json } from '../lib/database.types';
import type { Ingredient, Recipe, RecipeStep } from '../types';
import { initialsAvatar } from './profileService';

export type RecipeRow = Database['public']['Tables']['recipes']['Row'];
type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];

/** Editable recipe fields (what the admin form submits). */
export interface RecipeInput {
  title: string;
  description: string;
  country: string;
  countryFlag: string;
  category: Recipe['category'];
  difficulty: Recipe['difficulty'];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  imageUrl: string;
  heritageStory: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  isPublished: boolean;
}

const CATEGORIES: Recipe['category'][] = [
  'Plats Traditionnels', 'Street Food', 'Desserts & Douceurs',
  'Sauces & Marinades', 'Boissons & Cocktails', 'Végétarien & Vegan',
];
const DIFFICULTIES: Recipe['difficulty'][] = ['Facile', 'Moyen', 'Expert'];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80';

export function rowToRecipe(row: RecipeRow): Recipe {
  const authorName = row.author_name || 'Afrodelicious';
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    authorId: row.created_by || '',
    authorName,
    authorAvatar: row.author_avatar_url || initialsAvatar(authorName),
    authorHandle: row.author_handle || '@afrodelicious',
    authorRole: 'chef',
    country: row.country || '',
    countryFlag: row.country_flag || '🌍',
    category: row.category as Recipe['category'],
    difficulty: row.difficulty as Recipe['difficulty'],
    prepTimeMinutes: row.preparation_time,
    cookTimeMinutes: row.cooking_time,
    servings: row.servings,
    imageUrl: row.image_url || FALLBACK_IMAGE,
    ingredients: (Array.isArray(row.ingredients) ? row.ingredients : []) as unknown as Ingredient[],
    steps: (Array.isArray(row.instructions) ? row.instructions : []) as unknown as RecipeStep[],
    heritageStory: row.heritage_story || undefined,
    // Filled in from recipe_likes / recipe_bookmarks / recipe_comments (socialService)
    likesCount: 0,
    commentsCount: 0,
    bookmarksCount: 0,
    isLiked: false,
    isBookmarked: false,
    comments: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isPublished: row.is_published,
  };
}

function validationError(message: string) {
  return Object.assign(new Error(message), { code: 'validation' });
}

/** Keeps a step's photo/video only when it points to an uploaded (http/https) file. */
function stepMedia(s: RecipeStep): Pick<RecipeStep, 'mediaType' | 'mediaUrl' | 'videoDurationSeconds'> {
  const url = s.mediaUrl?.trim();
  if (!url || (s.mediaType !== 'photo' && s.mediaType !== 'video')) return {};
  if (!/^https?:\/\//i.test(url)) {
    throw validationError(`Le média de l’étape ${s.stepNumber} n’a pas encore été téléversé.`);
  }
  if (s.mediaType === 'photo') return { mediaType: 'photo', mediaUrl: url.slice(0, 2000) };
  const seconds = Math.round(Number(s.videoDurationSeconds) || 0);
  return {
    mediaType: 'video',
    mediaUrl: url.slice(0, 2000),
    ...(seconds > 0 ? { videoDurationSeconds: Math.min(seconds, MAX_STEP_VIDEO_SECONDS) } : {}),
  };
}

function toRow(input: RecipeInput): Omit<RecipeInsert, 'created_by' | 'id'> {
  const title = input.title.trim();
  if (title.length < 3 || title.length > 150) throw validationError('Le titre doit contenir entre 3 et 150 caractères.');
  if (input.description.length > 2000) throw validationError('La description ne peut pas dépasser 2000 caractères.');
  if (!CATEGORIES.includes(input.category)) throw validationError('Catégorie invalide.');
  if (!DIFFICULTIES.includes(input.difficulty)) throw validationError('Difficulté invalide.');

  const intIn = (value: number, min: number, max: number, label: string) => {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n) || n < min || n > max) throw validationError(`${label} doit être compris entre ${min} et ${max}.`);
    return n;
  };

  const ingredients = input.ingredients
    .filter(i => i.name.trim() !== '')
    .map((i, idx) => ({
      id: i.id || String(idx + 1),
      name: i.name.trim().slice(0, 200),
      amount: Number(i.amount) || 0,
      unit: (i.unit || '').trim().slice(0, 40),
      aisle: i.aisle,
    }));
  const steps = input.steps
    .filter(s => s.instruction.trim() !== '')
    .map((s, idx) => ({
      stepNumber: idx + 1,
      title: (s.title || '').trim().slice(0, 200),
      instruction: s.instruction.trim().slice(0, 4000),
      ...(s.durationMinutes ? { durationMinutes: s.durationMinutes } : {}),
      ...(s.tip?.trim() ? { tip: s.tip.trim().slice(0, 1000) } : {}),
      ...stepMedia(s),
    }));

  if (ingredients.length === 0) throw validationError('Ajoutez au moins un ingrédient.');
  if (steps.length === 0) throw validationError('Ajoutez au moins une étape de préparation.');
  if (input.imageUrl.startsWith('blob:') || input.imageUrl.startsWith('data:')) {
    throw validationError('L’image n’a pas encore été téléversée.');
  }

  return {
    title,
    description: input.description.trim(),
    country: input.country.trim() || null,
    country_flag: input.countryFlag.trim() || null,
    category: input.category,
    difficulty: input.difficulty,
    preparation_time: intIn(input.prepTimeMinutes, 0, 1440, 'Le temps de préparation'),
    cooking_time: intIn(input.cookTimeMinutes, 0, 2880, 'Le temps de cuisson'),
    servings: intIn(input.servings, 1, 100, 'Le nombre de portions'),
    image_url: input.imageUrl.trim() || null,
    heritage_story: input.heritageStory.trim() || null,
    ingredients: ingredients as unknown as Json,
    instructions: steps as unknown as Json,
    is_published: input.isPublished,
  };
}

/**
 * Lists recipes visible to the caller. RLS returns only published recipes to
 * regular users, and every recipe (drafts included) to administrators.
 */
export async function fetchRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(rowToRecipe);
}

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  const { data, error } = await supabase.from('recipes').insert(toRow(input)).select('*').single();
  if (error) throw error;
  return rowToRecipe(data);
}

export async function updateRecipe(id: string, input: RecipeInput): Promise<Recipe> {
  const { data, error } = await supabase.from('recipes').update(toRow(input)).eq('id', id).select('*').single();
  if (error) throw error;
  return rowToRecipe(data);
}

export async function setRecipePublished(id: string, isPublished: boolean): Promise<Recipe> {
  const { data, error } = await supabase
    .from('recipes')
    .update({ is_published: isPublished })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return rowToRecipe(data);
}

export async function deleteRecipe(id: string): Promise<void> {
  const { data, error } = await supabase.from('recipes').delete().eq('id', id).select('id, image_url, instructions');
  if (error) throw error;
  // RLS silently filters rows the caller may not delete.
  if (!data || data.length === 0) throw Object.assign(new Error('not allowed'), { code: '42501' });

  // Best-effort cleanup of the files uploaded for this recipe: main photo and step photos/videos
  // (seed images are shared and kept: only objects under recipes/ are removed).
  const marker = `/object/public/${RECIPE_IMAGES_BUCKET}/`;
  const toObjectPath = (url?: string | null) =>
    url && url.includes(marker) ? decodeURIComponent(url.split(marker)[1].split('?')[0]) : '';
  const steps = (Array.isArray(data[0].instructions) ? data[0].instructions : []) as unknown as RecipeStep[];
  const objectPaths = [data[0].image_url, ...steps.map(s => s?.mediaUrl)]
    .map(toObjectPath)
    .filter(path => path.startsWith('recipes/'));
  if (objectPaths.length > 0) {
    await supabase.storage.from(RECIPE_IMAGES_BUCKET).remove([...new Set(objectPaths)]);
  }
}

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_VIDEO_TYPES: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
/** Preparation-step videos are short clips. */
export const MAX_STEP_VIDEO_SECONDS = 30;

/** Uploads a recipe photo (admins only, enforced by storage RLS) and returns its public URL. */
export async function uploadRecipeImage(file: File): Promise<string> {
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) throw validationError('Format d’image non supporté (JPEG, PNG ou WebP).');
  if (file.size > MAX_IMAGE_BYTES) throw validationError('Image trop volumineuse (5 Mo maximum).');

  const path = `recipes/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(RECIPE_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false });
  if (error) throw error;
  return supabase.storage.from(RECIPE_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Uploads a preparation-step photo or short video (admins only, enforced by storage RLS).
 * Video length is checked in the form; here we check type and size.
 */
export async function uploadRecipeStepMedia(file: File): Promise<{ mediaType: 'photo' | 'video'; url: string }> {
  if (ALLOWED_IMAGE_TYPES[file.type]) {
    return { mediaType: 'photo', url: await uploadRecipeImage(file) };
  }
  const ext = ALLOWED_VIDEO_TYPES[file.type];
  if (!ext) throw validationError('Format non supporté (photo JPEG, PNG, WebP ou vidéo MP4, WebM, MOV).');
  if (file.size > MAX_VIDEO_BYTES) throw validationError('Vidéo trop volumineuse (25 Mo maximum).');

  const path = `recipes/steps/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(RECIPE_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false });
  if (error) throw error;
  return { mediaType: 'video', url: supabase.storage.from(RECIPE_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl };
}
