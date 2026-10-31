import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import type { Comment, Recipe } from '../types';
import { initialsAvatar } from './profileService';

type CommentRow = Database['public']['Tables']['recipe_comments']['Row'];

export const COMMENT_MAX_LENGTH = 1000;

/** Per-recipe social state for the signed-in user. */
export type SocialState = Pick<Recipe, 'likesCount' | 'bookmarksCount' | 'commentsCount' | 'isLiked' | 'isBookmarked'>;

/** "À l'instant", "il y a 5 min", "il y a 3 h", "il y a 2 j", then the date. */
export function formatRelativeTime(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "À l'instant";
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)} h`;
  if (seconds < 7 * 86400) return `il y a ${Math.floor(seconds / 86400)} j`;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function rowToComment(row: CommentRow): Comment {
  const userName = row.author_name || 'Membre Afrodelicious';
  return {
    id: row.id,
    userId: row.user_id,
    userName,
    userAvatar: row.author_avatar_url || initialsAvatar(userName),
    userHandle: row.author_handle || '',
    text: row.body,
    createdAt: formatRelativeTime(row.created_at),
    likesCount: 0
  };
}

/** Counters for every visible recipe plus the caller's own likes and bookmarks. */
export async function fetchSocialState(): Promise<Record<string, SocialState>> {
  const [counts, likes, bookmarks] = await Promise.all([
    supabase.rpc('recipe_social_counts'),
    supabase.from('recipe_likes').select('recipe_id'),
    supabase.from('recipe_bookmarks').select('recipe_id')
  ]);
  if (counts.error) throw counts.error;
  if (likes.error) throw likes.error;
  if (bookmarks.error) throw bookmarks.error;

  const liked = new Set(likes.data.map(l => l.recipe_id));
  const bookmarked = new Set(bookmarks.data.map(b => b.recipe_id));
  const state: Record<string, SocialState> = {};
  for (const c of counts.data) {
    state[c.recipe_id] = {
      likesCount: Number(c.likes_count),
      bookmarksCount: Number(c.bookmarks_count),
      commentsCount: Number(c.comments_count),
      isLiked: liked.has(c.recipe_id),
      isBookmarked: bookmarked.has(c.recipe_id)
    };
  }
  return state;
}

export async function setRecipeLiked(recipeId: string, userId: string, liked: boolean): Promise<void> {
  const { error } = liked
    ? await supabase.from('recipe_likes').upsert({ recipe_id: recipeId, user_id: userId }, { ignoreDuplicates: true })
    : await supabase.from('recipe_likes').delete().eq('recipe_id', recipeId).eq('user_id', userId);
  if (error) throw error;
}

export async function setRecipeBookmarked(recipeId: string, userId: string, bookmarked: boolean): Promise<void> {
  const { error } = bookmarked
    ? await supabase.from('recipe_bookmarks').upsert({ recipe_id: recipeId, user_id: userId }, { ignoreDuplicates: true })
    : await supabase.from('recipe_bookmarks').delete().eq('recipe_id', recipeId).eq('user_id', userId);
  if (error) throw error;
}

/** Newest first. */
export async function fetchComments(recipeId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('recipe_comments')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(rowToComment);
}

export async function addComment(recipeId: string, userId: string, text: string): Promise<Comment> {
  const body = text.trim();
  if (!body) throw Object.assign(new Error('Le commentaire est vide.'), { code: 'validation' });
  if (body.length > COMMENT_MAX_LENGTH) {
    throw Object.assign(new Error(`Le commentaire ne peut pas dépasser ${COMMENT_MAX_LENGTH} caractères.`), { code: 'validation' });
  }
  const { data, error } = await supabase
    .from('recipe_comments')
    .insert({ recipe_id: recipeId, user_id: userId, body })
    .select('*')
    .single();
  if (error) throw error;
  return rowToComment(data);
}

/** Authors delete their own comments, admins any comment (enforced by RLS). */
export async function deleteComment(commentId: string): Promise<void> {
  const { data, error } = await supabase.from('recipe_comments').delete().eq('id', commentId).select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw Object.assign(new Error('not allowed'), { code: '42501' });
}
