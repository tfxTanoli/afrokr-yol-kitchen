import React, { useState } from 'react';
import { 
  ChefHat, 
  DollarSign, 
  Users, 
  Star, 
  BookOpen, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  FileText,
  Calendar,
  X,
  Megaphone,
  Video,
  ShoppingBag,
  Sparkles,
  Clock,
  Globe,
  Layers,
  ExternalLink,
  Bookmark,
  PlayCircle,
  ChevronDown,
  Filter,
  Check
} from 'lucide-react';
import { Course, Recipe, User } from '../types';
import { CulinaryBadgeChip } from './CulinaryBadgeChip';
import { BadgesModal } from './BadgesModal';
import { calculateUserCulinaryStats } from '../utils/badgeSystem';
import { INITIAL_MEDIA_CAMPAIGNS, MediaCampaign } from '../data/mediaCampaignData';

interface ChefDashboardProps {
  currentUser: User;
  courses: Course[];
  recipes: Recipe[];
  onSelectRecipe: (recipeId: string) => void;
  onOpenCreateRecipe: () => void;
  onAddNewCourse: (newCourse: Course) => void;
  onSwitchToChef: () => void;
}

export const ChefDashboard: React.FC<ChefDashboardProps> = ({
  currentUser,
  courses,
  recipes,
  onSelectRecipe,
  onOpenCreateRecipe,
  onAddNewCourse,
  onSwitchToChef,
}) => {
  const [currencyMode, setCurrencyMode] = useState<'EUR' | 'XOF'>('EUR');
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');

  // Active Media Campaigns & Engagement metrics
  const activeMediaCampaigns = INITIAL_MEDIA_CAMPAIGNS.filter(c => c.status === 'active');
  const selectedCampaign = selectedCampaignId === 'all' 
    ? null 
    : activeMediaCampaigns.find(c => c.id === selectedCampaignId) || null;

  // Derived specific KPIs for the selected campaign (or aggregated if 'all')
  const campaignPayoutEur = selectedCampaign 
    ? Math.round(selectedCampaign.budgetSpentEur * 0.35)
    : activeMediaCampaigns.reduce((sum, c) => sum + Math.round(c.budgetSpentEur * 0.35), 0);
  const campaignPayoutXof = Math.round(campaignPayoutEur * 655.957);

  // Engagement stats isolated per campaign
  const campaignStats = selectedCampaign ? {
    timeSpent: selectedCampaign.id === 'camp-1' ? '4 min 28s'
      : selectedCampaign.id === 'camp-2' ? '5 min 14s'
      : selectedCampaign.id === 'camp-3' ? '3 min 52s'
      : selectedCampaign.id === 'camp-4' ? '4 min 05s'
      : selectedCampaign.id === 'camp-5' ? '4 min 45s'
      : selectedCampaign.id === 'camp-6' ? '3 min 38s' : '4 min 18s',
    saveRate: selectedCampaign.id === 'camp-1' ? '18.2%'
      : selectedCampaign.id === 'camp-2' ? '16.4%'
      : selectedCampaign.id === 'camp-3' ? '17.1%'
      : selectedCampaign.id === 'camp-4' ? '15.8%'
      : selectedCampaign.id === 'camp-5' ? '19.3%'
      : selectedCampaign.id === 'camp-6' ? '14.7%' : '16.9%',
    vcrRate: selectedCampaign.id === 'camp-1' ? '72.4%'
      : selectedCampaign.id === 'camp-2' ? '68.4%'
      : selectedCampaign.id === 'camp-3' ? '65.1%'
      : selectedCampaign.id === 'camp-4' ? '74.0%'
      : selectedCampaign.id === 'camp-5' ? '71.8%'
      : selectedCampaign.id === 'camp-6' ? '67.5%' : '69.8%',
    groceryAdds: selectedCampaign.groceryListAdds.toLocaleString('fr-FR'),
    groceryRate: selectedCampaign.clicks > 0 
      ? ((selectedCampaign.groceryListAdds / selectedCampaign.clicks) * 100).toFixed(1) + '%'
      : '76.0%',
    retailerClicks: selectedCampaign.productAndRetailerClicks.toLocaleString('fr-FR'),
    retailerOutboundRate: selectedCampaign.retailerOutboundRatePercent + '%',
    searchLift: `+${selectedCampaign.searchLiftPercent}%`,
    targetGeo: selectedCampaign.targetGeography,
    retailers: selectedCampaign.retailersTargeted,
    formats: selectedCampaign.formatsUsed
  } : {
    timeSpent: '4 min 18s',
    saveRate: '16.9%',
    vcrRate: '69.8%',
    groceryAdds: activeMediaCampaigns.reduce((sum, c) => sum + c.groceryListAdds, 0).toLocaleString('fr-FR'),
    groceryRate: '76.4%',
    retailerClicks: activeMediaCampaigns.reduce((sum, c) => sum + c.productAndRetailerClicks, 0).toLocaleString('fr-FR'),
    retailerOutboundRate: '76.8%',
    searchLift: '+42.5%',
    targetGeo: 'Afrique, Amérique Centrale, Amérique Latine, Asie du Sud-Est, États-Unis & Europe',
    retailers: ['Amazon Fresh', 'Walmart', 'Instacart', 'Target', 'Kroger', 'Marchés Locaux Abidjan/Dakar', 'Carrefour Brésil', 'Lazada Grocery'],
    formats: ['Recette Sponsorisée', 'Vidéo In-Feed & Stories', 'Shoppable Ads', 'Coupons Promotionnels']
  };

  // Culinary Badge Stats
  const culinaryStats = calculateUserCulinaryStats(currentUser, recipes);

  // New course modal state
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newPrice, setNewPrice] = useState(24.99);
  const [newLevel, setNewLevel] = useState<'Tous niveaux' | 'Intermédiaire' | 'Master Chef'>('Intermédiaire');
  const [newDuration, setNewDuration] = useState('2h 15min');

  // Chef filtered data
  const myCourses = courses.filter(c => c.chefId === currentUser.id || c.chefName.includes(currentUser.name));
  const myRecipes = recipes.filter(r => r.authorId === currentUser.id || r.authorName.includes(currentUser.name));

  // Calculated metrics
  const totalStudents = myCourses.reduce((acc, c) => acc + c.enrolledStudentsCount, 0) || 496;
  const estimatedRevenueEUR = myCourses.reduce((acc, c) => acc + (c.price * c.enrolledStudentsCount * 0.85), 0) || 7850.50; // 85% chef payout
  const estimatedRevenueXOF = Math.round(estimatedRevenueEUR * 655.957);

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Course = {
      id: `course-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Masterclass culinaire pas-à-pas.',
      chefId: currentUser.id,
      chefName: currentUser.name,
      chefAvatar: currentUser.avatar,
      chefCountry: `${currentUser.country} ${currentUser.countryFlag}`,
      chefTitle: 'Cheffe Certifiée AfroKréyol',
      price: newPrice,
      currency: 'EUR',
      level: newLevel,
      durationHours: newDuration,
      rating: 5.0,
      reviewsCount: 1,
      thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      description: newSubtitle,
      learningOutcomes: [
        'Maîtriser les dosages d\'épices du terroir',
        'Techniques de cuisson traditionnelles'
      ],
      lessons: [
        { id: `l-${Date.now()}-1`, title: '1. Introduction & Ingrédients', duration: '15 min', description: 'Présentation du matériel et sélection des produits frais.', isFreePreview: true },
        { id: `l-${Date.now()}-2`, title: '2. Réalisation pas-à-pas', duration: '35 min', description: 'Le geste et la cuisson.', isFreePreview: false }
      ],
      enrolledStudentsCount: 0,
      isEnrolled: true,
      progressPercent: 0
    };

    onAddNewCourse(created);
    setIsCreatingCourse(false);
    setNewTitle('');
    setNewSubtitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Role Notice banner if not chef */}
      {currentUser.role !== 'chef' && (
        <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ChefHat className="w-6 h-6 text-[#FF4E27]" />
            <div>
              <h4 className="font-bold text-xs text-slate-900">
                Vous êtes actuellement en mode "Membre Gourmet"
              </h4>
              <p className="text-[11px] text-slate-500">
                Passez en mode Chef pour publier des cours payants et débloquer vos analytics de revenus.
              </p>
            </div>
          </div>
          <button
            onClick={onSwitchToChef}
            className="px-4 py-2 rounded-xl bg-[#FF4E27] text-white text-xs font-bold shadow-xs hover:bg-[#E03814] transition-colors"
          >
            Activer l'Espace Chef
          </button>
        </div>
      )}

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#FF4E27]"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif font-black text-xl sm:text-2xl text-slate-900">
                Tableau de Bord de {currentUser.name}
              </h1>
              <CheckCircle2 className="w-4 h-4 text-[#FF4E27]" />
              <CulinaryBadgeChip
                badge={culinaryStats.currentBadge}
                size="sm"
                showDetailsOnClick={() => setIsBadgesModalOpen(true)}
              />
            </div>
            <p className="text-xs text-slate-500">
              Gestion de vos masterclasses, revenus de transmission et recettes partagées
            </p>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setCurrencyMode('EUR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currencyMode === 'EUR' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Euros (€)
          </button>
          <button
            onClick={() => setCurrencyMode('XOF')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currencyMode === 'XOF' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            FCFA (XOF)
          </button>
        </div>
      </div>

      {/* Culinary Merit & Badge Banner */}
      <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
        culinaryStats.currentBadge.id === 'top_chef'
          ? 'bg-gradient-to-r from-orange-50/80 via-white to-amber-50/50 border-orange-200 shadow-xs'
          : 'bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/50 border-emerald-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${
            culinaryStats.currentBadge.id === 'top_chef'
              ? 'bg-gradient-to-br from-[#FF4E27] to-[#FF7849] text-white ring-2 ring-amber-400/30'
              : 'bg-gradient-to-br from-[#0F3E2E] to-[#15523E] text-white ring-2 ring-emerald-400/30'
          }`}>
            {culinaryStats.currentBadge.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27]">
                Statut Culinaire Vérifié
              </span>
              <span className="text-[10px] text-slate-300">·</span>
              <span className="text-[11px] text-slate-600 font-medium">
                {culinaryStats.recipesCount} recettes publiées · {culinaryStats.totalLikesReceived.toLocaleString()} likes reçus
              </span>
            </div>
            <h3 className="font-serif font-black text-lg text-slate-900 mt-0.5 flex items-center gap-2">
              <span>Distinction : {culinaryStats.currentBadge.title}</span>
              <span className="text-sm">{culinaryStats.currentBadge.emoji}</span>
            </h3>
            <p className="text-xs text-slate-600 max-w-xl line-clamp-1 font-normal">
              {culinaryStats.currentBadge.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsBadgesModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#FF4E27] text-xs font-bold text-slate-900 shadow-2xs hover:shadow-xs transition-all shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Voir critères & privilèges</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#FF4E27]" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Estimated Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Revenus nets estimés</span>
            <DollarSign className="w-4 h-4 text-[#0F3E2E]" />
          </div>
          <div className="font-serif font-black text-2xl text-[#0F3E2E]">
            {currencyMode === 'EUR' 
              ? `${estimatedRevenueEUR.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
              : `${estimatedRevenueXOF.toLocaleString('fr-FR')} FCFA`}
          </div>
          <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% ce mois-ci</span>
          </p>
        </div>

        {/* Total Students */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Élèves inscrits</span>
            <Users className="w-4 h-4 text-[#FF4E27]" />
          </div>
          <div className="font-serif font-black text-2xl text-slate-900">
            {totalStudents} élèves
          </div>
          <p className="text-[11px] text-slate-500">
            Dans 14 pays (France, Sénégal, Canada, etc.)
          </p>
        </div>

        {/* Masterclasses created */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Masterclasses</span>
            <BookOpen className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="font-serif font-black text-2xl text-slate-900">
            {myCourses.length} cours
          </div>
          <p className="text-[11px] text-slate-500">
            Note moyenne : 4.95 / 5 ★
          </p>
        </div>

        {/* Recipes published */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Recettes publiées</span>
            <ChefHat className="w-4 h-4 text-[#FF7849]" />
          </div>
          <div className="font-serif font-black text-2xl text-slate-900">
            {myRecipes.length} recettes
          </div>
          <p className="text-[11px] text-slate-500">
            1,240 sauvegardes au total
          </p>
        </div>

      </div>

      {/* Course Management Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-lg text-slate-900">
              Gestion de vos Masterclasses de Cuisine
            </h2>
            <p className="text-xs text-slate-500">
              Consultez le nombre d'inscrits et vos gains par formation
            </p>
          </div>

          <button
            onClick={() => setIsCreatingCourse(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une nouvelle masterclass</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Masterclass</th>
                <th className="p-3">Prix</th>
                <th className="p-3">Niveau</th>
                <th className="p-3">Inscrits</th>
                <th className="p-3">Note</th>
                <th className="p-3 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-12 h-9 rounded-lg object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block max-w-xs truncate">
                          {c.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {c.lessons.length} leçons · {c.durationHours}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-[#0F3E2E]">
                    {c.price === 0 ? 'Gratuit' : `${c.price} €`}
                  </td>
                  <td className="p-3 text-slate-500">{c.level}</td>
                  <td className="p-3 font-semibold text-slate-800">{c.enrolledStudentsCount} élèves</td>
                  <td className="p-3 text-[#F59E0B] font-bold">★ {c.rating}</td>
                  <td className="p-3 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      En ligne & actif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recipes Management Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-slate-900">
              Vos Recettes du Terroir Publiées
            </h2>
            <p className="text-xs text-slate-500">
              Interactions sociales, likes et commentaires en temps réel
            </p>
          </div>

          <button
            onClick={onOpenCreateRecipe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#FF4E27] text-[#FF4E27] hover:bg-orange-50 text-xs font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une recette</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myRecipes.map((r) => (
            <div
              key={r.id}
              onClick={() => onSelectRecipe(r.id)}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#FF4E27] cursor-pointer transition-all flex gap-3"
            >
              <img
                src={r.imageUrl}
                alt={r.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-[#FF4E27]">
                  {r.countryFlag} {r.category}
                </span>
                <h4 className="font-bold text-xs text-slate-900 truncate">
                  {r.title}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                  <span>{r.likesCount} j'aime</span>
                  <span>·</span>
                  <span>{r.commentsCount} avis</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partenariats Marques & Performance Média (Campagnes Publicitaires) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#142d20] text-white shadow-xl space-y-6">
        {/* Header & Chef Revenue */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Programme Partenaires & Marques
              </span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-xs text-emerald-400 font-semibold">Moyenne 90 jours certifiée</span>
            </div>
            <h3 className="font-serif font-black text-xl text-white mt-1 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#FF4E27]" />
              Impact de Vos Recettes & Vidéos Sponsorisées
            </h3>
            <p className="text-xs text-slate-300">
              Analysez l'impact de vos créations culinaires et co-branding avec les annonceurs agroalimentaires.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 px-4 text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {selectedCampaign ? `Dotation Chef (${selectedCampaign.brandName})` : 'Dotations Sponsoring Cumulées'}
            </span>
            <span className="text-2xl font-black font-mono text-emerald-400 block">
              {currencyMode === 'EUR' 
                ? `${campaignPayoutEur.toLocaleString('fr-FR')} €` 
                : `${campaignPayoutXof.toLocaleString('fr-FR')} FCFA`}
            </span>
            <span className="text-[10px] text-slate-400">
              {selectedCampaign ? '35% reversés sur budget consommé' : `${activeMediaCampaigns.length} campagnes actives rémunérées`}
            </span>
          </div>
        </div>

        {/* Campagnes Actives Selector */}
        <div className="space-y-3 bg-black/30 p-4 rounded-2xl border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Campagne publicitaire analysée :</span>
            </label>

            {/* Dropdown Selector */}
            <div className="relative min-w-[280px]">
              <select
                aria-label="Sélectionner une campagne publicitaire"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full appearance-none bg-slate-800 text-white text-xs font-semibold rounded-xl pl-3.5 pr-9 py-2.5 border border-slate-700 hover:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-sm"
              >
                <option value="all">🌐 Toutes les campagnes actives (Vue consolidée)</option>
                {activeMediaCampaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.brandName} — {camp.name.slice(0, 36)}...
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Quick Select Horizontal Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            <button
              onClick={() => setSelectedCampaignId('all')}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedCampaignId === 'all'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              Vue Consolidée ({activeMediaCampaigns.length})
            </button>
            {activeMediaCampaigns.map((camp) => {
              const isSelected = selectedCampaignId === camp.id;
              let regionBadge = '🌐';
              if (camp.targetGeography.includes('Afrique')) regionBadge = '🌍 Afrique';
              else if (camp.targetGeography.includes('Centrale')) regionBadge = '🌴 Am. Centrale';
              else if (camp.targetGeography.includes('Latine')) regionBadge = '🌎 Am. Latine';
              else if (camp.targetGeography.includes('Asie')) regionBadge = '🌏 Asie SE';
              else if (camp.targetGeography.includes('États-Unis')) regionBadge = '🗽 USA';
              else regionBadge = '🇫🇷 France';

              return (
                <button
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(camp.id)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  <span className="opacity-90">{regionBadge}</span>
                  <span>·</span>
                  <span className="truncate max-w-[130px]">{camp.brandName}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Campaign Header Info */}
          <div className="pt-2 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white">
                {selectedCampaign ? selectedCampaign.name : 'Campagnes multi-régions en cours de diffusion'}
              </span>
              {selectedCampaign && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold uppercase">
                  Active
                </span>
              )}
            </div>

            {/* Targeted Geography Banner */}
            <div className="flex items-center gap-1.5 text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">Ciblage Géographique :</span>
              <span className="text-white font-medium">{campaignStats.targetGeo}</span>
            </div>
          </div>
        </div>

        {/* Isolated Engagement KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[10px] font-bold uppercase">Temps Passé Moyen</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xl font-black font-mono text-white block">{campaignStats.timeSpent}</span>
            <span className="text-[10px] text-amber-300 font-semibold block">Immersion recette complète</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[10px] font-bold uppercase">Taux de Sauvegarde</span>
              <Bookmark className="w-3.5 h-3.5 text-[#FF4E27]" />
            </div>
            <span className="text-xl font-black font-mono text-[#FF4E27] block">{campaignStats.saveRate}</span>
            <span className="text-[10px] text-orange-200 font-semibold block">Intention de cuisiner sous 14j</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[10px] font-bold uppercase">Complétion Vidéo (VCR)</span>
              <PlayCircle className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-xl font-black font-mono text-purple-300 block">{campaignStats.vcrRate}</span>
            <span className="text-[10px] text-purple-200 font-semibold block">Vues vidéo 100% complétées</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[10px] font-bold uppercase">Ajout Liste Courses</span>
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-xl font-black font-mono text-emerald-300 block">{campaignStats.groceryAdds}</span>
            <span className="text-[10px] text-emerald-200 font-semibold block">Taux d'ajout : {campaignStats.groceryRate}</span>
          </div>
        </div>

        {/* Secondary KPIs: Outbound Retailers Clicks, Search Lift & Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                Redirections Marchands & Partenaires
              </span>
              <span className="text-xs font-mono font-bold text-blue-300">{campaignStats.retailerClicks} clics ({campaignStats.retailerOutboundRate})</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {campaignStats.retailers.map((ret, idx) => (
                <span key={idx} className="text-[11px] bg-white/10 text-slate-200 px-2 py-0.5 rounded-md font-medium border border-white/5">
                  {ret}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                Impact Notoriété & Formats
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">Search Lift : {campaignStats.searchLift}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {campaignStats.formats.map((fmt, idx) => (
                <span key={idx} className="text-[11px] bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded-md font-medium border border-amber-400/20">
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Coverage Summary footer */}
        <div className="pt-2 border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-400">
          <span>Territoires ciblés : 🌍 Afrique · 🌴 Amérique Centrale · 🌎 Amérique Latine · 🌏 Asie du Sud-Est · 🗽 États-Unis · 🇪🇺 Europe</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Mesure certifiée cookies tiers & post-view 30j
          </span>
        </div>
      </div>

      {/* Create New Course Modal */}
      {isCreatingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Créer une nouvelle Masterclass
              </h3>
              <button onClick={() => setIsCreatingCourse(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Titre du cours *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Maîtriser le poisson braisé à l'ivoirienne"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Sous-titre accrocheur
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="Ex: Les secrets de la marinade aux aromates frais et cuisson au charbon"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Niveau
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none"
                  >
                    <option value="Tous niveaux">Tous niveaux</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Master Chef">Master Chef</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Durée
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="2h 15min"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingCourse(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF4E27] text-white text-xs font-bold hover:bg-[#E03814] shadow-xs"
                >
                  Publier la Masterclass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Badges Criteria & Merits Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        user={currentUser}
        recipes={recipes}
        onOpenCreateRecipe={onOpenCreateRecipe}
      />

    </div>
  );
};
