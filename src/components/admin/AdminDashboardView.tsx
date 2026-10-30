import React, { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  Users,
  BookOpen,
  FileText,
  Plus,
  RefreshCw,
  Search,
  Eye,
  Edit3,
  Trash2,
  AlertCircle,
  Loader2,
  Utensils,
  Crown,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Recipe, User } from '../../types';
import { AdminUserRow, fetchAllUsers, setUserRole } from '../../services/adminService';
import { initialsAvatar } from '../../services/profileService';
import { toUserMessage } from '../../lib/supabase';

interface AdminDashboardViewProps {
  currentUser: User;
  /** Every recipe, drafts included (admins receive them all through RLS). */
  recipes: Recipe[];
  recipesStatus: 'loading' | 'ready' | 'error';
  onReloadRecipes: () => void;
  onCreateRecipe: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onPreviewRecipe: (recipeId: string) => void;
  onTogglePublishRecipe: (recipe: Recipe) => Promise<void>;
  onDeleteRecipe: (recipe: Recipe) => Promise<void>;
  onOpenAdvancedPortal: () => void;
}

type Section = 'recipes' | 'users';
type RecipeFilter = 'all' | 'published' | 'draft';
type RoleFilter = 'all' | 'admin' | 'user';

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/**
 * Administrator home page: real KPIs, recipe management and user/role management.
 * Every action is re-checked by the database (RLS + admin-only RPC).
 */
export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  recipes,
  recipesStatus,
  onReloadRecipes,
  onCreateRecipe,
  onEditRecipe,
  onPreviewRecipe,
  onTogglePublishRecipe,
  onDeleteRecipe,
  onOpenAdvancedPortal
}) => {
  const [section, setSection] = useState<Section>('recipes');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Users
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [usersStatus, setUsersStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [roleUpdatingId, setRoleUpdatingId] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  // Recipes
  const [recipeQuery, setRecipeQuery] = useState('');
  const [recipeFilter, setRecipeFilter] = useState<RecipeFilter>('all');
  const [recipeActionId, setRecipeActionId] = useState<string | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(prev => (prev?.message === message ? null : prev)), 4000);
  };

  const loadUsers = async () => {
    setUsersStatus('loading');
    try {
      setUsers(await fetchAllUsers());
      setUsersStatus('ready');
    } catch (error) {
      setUsersStatus('error');
      showFeedback('error', toUserMessage(error, 'Impossible de charger les utilisateurs.'));
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRefresh = () => {
    onReloadRecipes();
    loadUsers();
  };

  // ---- KPIs (real data only) ----
  const publishedCount = recipes.filter(r => r.isPublished).length;
  const draftCount = recipes.length - publishedCount;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const newUsersThisWeek = users.filter(u => Date.now() - new Date(u.created_at).getTime() < 7 * 24 * 3600 * 1000).length;

  const kpis = [
    { label: 'Utilisateurs inscrits', value: usersStatus === 'ready' ? users.length : '…', hint: usersStatus === 'ready' ? `+${newUsersThisWeek} cette semaine` : '', icon: Users, tone: 'bg-orange-100 text-[#FF4E27]' },
    { label: 'Administrateurs', value: usersStatus === 'ready' ? adminCount : '…', hint: 'Accès complet', icon: Crown, tone: 'bg-emerald-100 text-[#0F3E2E]' },
    { label: 'Recettes publiées', value: recipesStatus === 'ready' ? publishedCount : '…', hint: 'Visibles par les membres', icon: BookOpen, tone: 'bg-sky-100 text-sky-700' },
    { label: 'Brouillons', value: recipesStatus === 'ready' ? draftCount : '…', hint: 'Visibles par les admins', icon: FileText, tone: 'bg-amber-100 text-amber-700' }
  ];

  // ---- Recipes ----
  const filteredRecipes = useMemo(() => {
    const q = recipeQuery.trim().toLowerCase();
    return recipes.filter(r => {
      if (recipeFilter === 'published' && !r.isPublished) return false;
      if (recipeFilter === 'draft' && r.isPublished) return false;
      if (!q) return true;
      return [r.title, r.country, r.category, r.authorName].some(v => v?.toLowerCase().includes(q));
    });
  }, [recipes, recipeQuery, recipeFilter]);

  const runRecipeAction = async (recipe: Recipe, action: () => Promise<void>, failure: string) => {
    setRecipeActionId(recipe.id);
    try {
      await action();
    } catch (error) {
      showFeedback('error', toUserMessage(error, failure));
    } finally {
      setRecipeActionId(null);
    }
  };

  const handleTogglePublish = (recipe: Recipe) =>
    runRecipeAction(recipe, () => onTogglePublishRecipe(recipe), 'Le statut de publication n’a pas pu être modifié.');

  const handleDelete = (recipe: Recipe) => {
    if (!window.confirm(`Supprimer définitivement la recette "${recipe.title}" ? Cette action est irréversible.`)) return;
    runRecipeAction(recipe, () => onDeleteRecipe(recipe), 'La recette n’a pas pu être supprimée.');
  };

  // ---- Users ----
  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    return users.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (!q) return true;
      return [u.full_name, u.email, u.handle, u.country].some(v => v?.toLowerCase().includes(q));
    });
  }, [users, userQuery, roleFilter]);

  const handleChangeRole = async (target: AdminUserRow, role: 'admin' | 'user') => {
    if (target.role === role) return;
    const name = target.full_name || target.email;
    const question = role === 'admin'
      ? `Accorder les droits administrateur à ${name} ?`
      : `Retirer les droits administrateur de ${name} ?`;
    if (!window.confirm(question)) return;

    setRoleUpdatingId(target.id);
    try {
      await setUserRole(target.id, role);
      setUsers(prev => prev.map(u => (u.id === target.id ? { ...u, role } : u)));
      showFeedback('success', `${name} est maintenant ${role === 'admin' ? 'Administrateur' : 'Membre'}.`);
    } catch (error) {
      showFeedback('error', toUserMessage(error, 'Le rôle n’a pas pu être modifié.'));
    } finally {
      setRoleUpdatingId(null);
    }
  };

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
      active ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#0F3E2E] text-white shadow-md shadow-[#0F3E2E]/25">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">Tableau de bord Admin</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Bonjour {currentUser.name.split(' ')[0]} · Gérez les recettes et les membres d’Afrodelicious
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${recipesStatus === 'loading' || usersStatus === 'loading' ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          <button
            type="button"
            onClick={onCreateRecipe}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] text-white text-xs font-black shadow-md shadow-[#FF4E27]/25 flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle recette</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            feedback.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          {feedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
              <span className={`p-1.5 rounded-xl ${kpi.tone}`}>
                <kpi.icon className="w-3.5 h-3.5" />
              </span>
            </div>
            <span className="block text-2xl font-black text-slate-900 font-mono mt-1.5">{kpi.value}</span>
            <span className="block text-[11px] text-slate-500 mt-0.5">{kpi.hint}</span>
          </div>
        ))}
      </div>

      {/* Section switcher */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSection('recipes')}
            className={`py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${section === 'recipes' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-600'}`}
          >
            <Utensils className="w-3.5 h-3.5 text-[#FF4E27]" />
            <span>Recettes ({recipes.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSection('users')}
            className={`py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${section === 'users' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-600'}`}
          >
            <Users className="w-3.5 h-3.5 text-[#0F3E2E]" />
            <span>Utilisateurs ({usersStatus === 'ready' ? users.length : '…'})</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onOpenAdvancedPortal}
          className="text-[11px] font-bold text-slate-500 hover:text-[#0F3E2E] flex items-center gap-1 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Portail avancé (modules à venir)</span>
        </button>
      </div>

      {/* ===================== RECIPES ===================== */}
      {section === 'recipes' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="search"
                value={recipeQuery}
                onChange={(e) => setRecipeQuery(e.target.value)}
                placeholder="Rechercher une recette, un pays…"
                aria-label="Rechercher une recette"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none bg-slate-50/50"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <button type="button" onClick={() => setRecipeFilter('all')} className={chip(recipeFilter === 'all')}>Toutes ({recipes.length})</button>
              <button type="button" onClick={() => setRecipeFilter('published')} className={chip(recipeFilter === 'published')}>Publiées ({publishedCount})</button>
              <button type="button" onClick={() => setRecipeFilter('draft')} className={chip(recipeFilter === 'draft')}>Brouillons ({draftCount})</button>
            </div>
          </div>

          {recipesStatus === 'loading' && recipes.length === 0 ? (
            <div className="py-14 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF4E27]" />
              <span>Chargement des recettes…</span>
            </div>
          ) : recipesStatus === 'error' ? (
            <div className="py-14 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs font-bold text-slate-800">Impossible de charger les recettes.</p>
              <button type="button" onClick={onReloadRecipes} className="px-4 py-2 rounded-xl bg-[#FF4E27] text-white text-xs font-bold">Réessayer</button>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-900">Aucune recette dans cette vue</p>
              <p className="text-xs text-slate-500">Créez une recette avec « Nouvelle recette ».</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredRecipes.map(recipe => {
                const busy = recipeActionId === recipe.id;
                return (
                  <li key={recipe.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={recipe.imageUrl} alt="" className="w-16 h-12 rounded-xl object-cover shrink-0 bg-slate-100" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-slate-900 truncate">{recipe.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${recipe.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {recipe.isPublished ? 'Publiée' : 'Brouillon'}
                          </span>
                        </div>
                        <span className="block text-[11px] text-slate-500 truncate">
                          {recipe.countryFlag} {recipe.country || '—'} · {recipe.category} · {recipe.authorName} · modifiée le {formatDate(recipe.updatedAt || recipe.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      {busy ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400 m-2" aria-label="En cours" />
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onPreviewRecipe(recipe.id)}
                            title="Voir la recette"
                            aria-label={`Voir ${recipe.title}`}
                            className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditRecipe(recipe)}
                            title="Modifier"
                            aria-label={`Modifier ${recipe.title}`}
                            className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(recipe)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer ${
                              recipe.isPublished ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {recipe.isPublished ? 'Dépublier' : 'Publier'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(recipe)}
                            title="Supprimer"
                            aria-label={`Supprimer ${recipe.title}`}
                            className="p-2 rounded-xl hover:bg-rose-100 text-slate-500 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* ===================== USERS ===================== */}
      {section === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="search"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Rechercher un nom, un email…"
                aria-label="Rechercher un utilisateur"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none bg-slate-50/50"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <button type="button" onClick={() => setRoleFilter('all')} className={chip(roleFilter === 'all')}>Tous ({users.length})</button>
              <button type="button" onClick={() => setRoleFilter('admin')} className={chip(roleFilter === 'admin')}>Administrateurs ({adminCount})</button>
              <button type="button" onClick={() => setRoleFilter('user')} className={chip(roleFilter === 'user')}>Membres ({users.length - adminCount})</button>
            </div>
          </div>

          {usersStatus === 'loading' ? (
            <div className="py-14 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF4E27]" />
              <span>Chargement des utilisateurs…</span>
            </div>
          ) : usersStatus === 'error' ? (
            <div className="py-14 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs font-bold text-slate-800">Impossible de charger les utilisateurs.</p>
              <button type="button" onClick={loadUsers} className="px-4 py-2 rounded-xl bg-[#FF4E27] text-white text-xs font-bold">Réessayer</button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-14 text-center text-xs text-slate-500">Aucun utilisateur ne correspond à cette recherche.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredUsers.map(u => {
                const isSelf = u.id === currentUser.id;
                const name = u.full_name || u.email.split('@')[0];
                return (
                  <li key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={u.avatar_url || initialsAvatar(name)} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-slate-900 truncate">{name}</span>
                          {isSelf && <span className="text-[10px] font-bold text-slate-400">(vous)</span>}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${u.role === 'admin' ? 'bg-[#0F3E2E] text-white' : 'bg-slate-100 text-slate-700'}`}>
                            {u.role === 'admin' ? 'Administrateur' : 'Membre'}
                          </span>
                        </div>
                        <span className="block text-[11px] text-slate-500 truncate">
                          {u.email} · {u.country_flag || '🌍'} {u.country || '—'} · inscrit le {formatDate(u.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {roleUpdatingId === u.id && <Loader2 className="w-4 h-4 animate-spin text-slate-400" aria-label="En cours" />}
                      <select
                        value={u.role}
                        disabled={isSelf || roleUpdatingId === u.id}
                        title={isSelf ? 'Vous ne pouvez pas modifier votre propre rôle' : 'Modifier le rôle'}
                        aria-label={`Rôle de ${name}`}
                        onChange={(e) => handleChangeRole(u, e.target.value as 'admin' | 'user')}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-black text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4E27]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="user">👤 Membre</option>
                        <option value="admin">🛡️ Administrateur</option>
                      </select>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
