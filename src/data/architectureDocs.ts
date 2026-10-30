export interface ArchitectureDoc {
  id: string;
  title: string;
  badge: string;
  summary: string;
  markdownContent: string;
}

export const ARCHITECTURE_DOCS: ArchitectureDoc[] = [
  {
    id: 'prd',
    title: 'Product Requirements Document (PRD)',
    badge: 'PRD v2.4',
    summary: 'Vision produit, persona cibles, fonctionnalités clés, metrics & KPIs du réseau culinaire afro-caribéen.',
    markdownContent: `# 🍛 AfroKréyol Kitchen — Product Requirements Document (PRD)

## 1. Vision & Opportunité de Marché
Les patrimoines culinaires d'Afrique subsaharienne et des Caraïbes (Sénégal, Côte d'Ivoire, Haïti, Martinique, Guadeloupe, Jamaïque, Nigeria, Cameroun...) représentent une richesse gastronomique immense, portée par une diaspora mondiale de plus de 40 millions d'individus et un engouement planétaire grandissant. 
Cependant, ces recettes se transmettent souvent oralement ou sont dispersées sur des réseaux non adaptés (TikTok, Instagram, groupes WhatsApp) sans indexation d'ingrédients, sans conversion d'unités, et sans monétisation pour les chefs de la diaspora.

**AfroKréyol Kitchen** est la première plateforme sociale et éducative dédiée qui fusionne :
1. Un **fil social culinaire** visuel et communautaire (recettes enrichies, provenance géographique, pas-à-pas interactif).
2. Un **FAB universel inspiré de Samsung Food** (création guidée, importateur intelligent tous liens, scan d'assiette).
3. Une **Marketplace de Masterclasses de Chefs** (cours monétisés, progression vidéo, transmission du geste ancestral).
4. Un **Planificateur de repas intelligent & Liste de courses** adaptée aux épiceries afro-caribéennes.

---

## 2. Personas Cibles
* **Chef Fatou (38 ans, Cheffe & Créatrice de contenu - Paris / Dakar)** : Veut monétiser son expertise (cours de sauces traditionnelles & fumages), publier ses recettes sans se faire piller son travail, bâtir sa communauté d'élèves.
* **Kévin (27 ans, Ingénieur d'origine guadeloupéenne - Montréal)** : Nostalgique de la cuisine de sa grand-mère (Colombo, Bokits, Tourment d'amour). Cherche des recettes authentiques avec les équivalents d'ingrédients trouvables en Amérique du Nord.
* **Amina (32 ans, Mère active - Bruxelles)** : Veut planifier des menus sains afro-fusion pour toute la semaine (Alloco au four, Mafé végétarien, Diri ak Djon Djon) avec liste de courses automatique.

---

## 3. Matrice des Fonctionnalités Clés (MoSCoW)

### Must Have (P0)
* **Fil d'actualité culinaire** avec filtres par pays d'origine, catégories et niveaux de difficulté.
* **Bouton Flottant (FAB Samsung Food)** avec 3 actions : Création manuelle, Import URL (Instagram, TikTok, YouTube, blogs), Scan Caméra.
* **Fiches Recettes interactives** avec calculateur de portions dynamique, checklist d'ingrédients et étapes de cuisson pas-à-pas.
* **Marketplace Masterclasses Chefs** avec consultation de programme, vidéos previews et inscription/achat simulé.
* **Tableau de Bord Chef** pour suivre les revenus, les cours publiés et les élèves inscrits.
* **Planificateur hebdomadaire (Lundi - Dimanche)** avec génération instantanée de liste de courses par rayons (Marché frais, Épices afro, Boucherie...).

### Should Have (P1)
* **Diffusion de Stories Culinaires en Direct (24h)** : Carrousel immersif en tête de fil avec anneaux animés, visionneuse plein écran interactive (barres de progression segmentées, stickers de sondages, astuces de chef, réactions rapides emoji, liaison directe vers la recette complète) et studio de création/diffusion pour chefs et créateurs.
* **Système de Badges de Mérite Culinaire** : Attribution dynamique des distinctions **Top Chef 👑** (≥ 10 recettes, ≥ 250 likes) et **Expert Culinaire 🌟** (≥ 5 recettes, ≥ 100 likes), avec barre de progression live, privilèges accordés et affichage sur les publications et profils.
* **Système de Cercles & Communautés** (ex: *Les Maîtres du Mafé*, *Saveurs Créoles*, *Vegan Afro*).
* **Double type de profil** : Membre Gourmet et Chef Certifié avec badge officiel et spécialités.
* **Système de notifications in-app** (likes, commentaires, inscriptions masterclasses, réactions aux stories, évolution de badge).
* **Favoris & Dossiers de recettes**.

### Could Have (P2)
* Scan intelligent d'ingrédients pour suggérer des recettes anti-gaspillage.
* Export PDF de fiches recettes et liste de courses partagée via WhatsApp.

---

## 4. Métriques de Succès (KPIs)
* **Activation** : ≥ 65% des nouveaux inscrits sauvegardent une recette ou rejoignent un cercle dans les premières 48h.
* **Engagement** : Fréquence de retour hebdomadaire ≥ 3.5 sessions/utilisateur (usage soutenu du planificateur le weekend).
* **Monétisation Chefs** : Panier moyen des masterclasses à 19.99€ avec un taux de rétention de complétion de cours ≥ 72%.
`
  },
  {
    id: 'trd',
    title: 'Technical Requirements Document (TRD)',
    badge: 'TRD Architecture',
    summary: 'Spécifications techniques, stack Frontend/Backend, contrats d’API, sécurité, déploiement Vercel & Supabase.',
    markdownContent: `# 🛠️ AfroKréyol Kitchen — Technical Requirements Document (TRD)

## 1. Vue d'Ensemble de l'Architecture
L'application adopte une architecture moderne **Jamstack & BaaS**, optimisée pour une scalabilité horizontale et une expérience utilisateur instantanée (zero latency UI) :

* **Frontend** : React 19 SPA, Tailwind CSS v4, Motion pour les micro-interactions, Lucide Icons.
* **Backend de Persistance** : Supabase (PostgreSQL 16) hébergé avec Row Level Security (RLS) et Realtime Subscriptions.
* **Stockage de Fichiers (Storage)** : Supabase Storage Buckets (\`recipe-photos\`, \`course-assets\`, \`user-avatars\`).
* **Hébergement & Déploiement** : Vercel avec Edge Network CDN, Serverless Functions pour l'extraction de liens et webhooks de paiement.
* **Authentification** : Supabase Auth (OAuth Google + Magic Link Email/Password) avec JWT stocké en cookie sécurisé \`HttpOnly\`.

---

## 2. Spécifications Techniques Détaillées

### A. Performance & Core Web Vitals
* **First Contentful Paint (FCP)** : < 0.8s grâce au bundle tree-shaking et optimisation des polices Web (\`swap\`).
* **Time to Interactive (TTI)** : < 1.2s.
* **Images Optimization** : Formats WebP/AVIF avec \`srcset\` responsive et lazy-loading natif.

### B. Gestion d'État Client & Offline-First
* État applicatif synchronisé via React State + Local Storage fallback pour le planificateur de repas et le brouillon de recettes.
* Récupération optimiste des Likes, Favoris et Inscriptions aux cours.

### C. Moteur d'Importation de Recettes (FAB Link Importer)
* Service de scraping headless et analyse sémantique (JSON-LD \`Recipe\` schema.org, balises OpenGraph, microformats).
* Fallback sur extracteur heuristique pour Instagram Captions et descriptions YouTube.

---

## 3. Sécurité & Conformité
* **Row Level Security (RLS)** activé sur toutes les tables PostgreSQL.
* Aucune clé API secrète exposée côté client ; \`SUPABASE_ANON_KEY\` restreinte par RLS.
* Conformité RGPD pour le consentement utilisateur, l'exportation et la suppression des données personnelles.
`
  },
  {
    id: 'appflow',
    title: 'App Flow & Parcours Utilisateur',
    badge: 'UX Flows',
    summary: 'Cartographie des flux de navigation, créations de recettes via FAB, parcours masterclass et planification.',
    markdownContent: `# 🗺️ AfroKréyol Kitchen — App Flow & Parcours Utilisateur

## 1. Diagramme Global des Flux

\`\`\`mermaid
graph TD
    A[Visiteur] --> B{Authentification}
    B -->|Connexion Google / Email| C[Fil d'Actualités Social]
    
    C --> D[Explorer & Filtres Pays]
    C --> E[Masterclasses de Chefs]
    C --> F[Planificateur de Repas]
    C --> G[Communautés & Cercles]
    C --> H[Mon Profil / Tableau Chef]
    
    %% Floating Action Button
    C & D & E & F & G --> FAB[Bouton Flottant Samsung Food]
    FAB -->|Option 1| FAB_Create[Créer une Recette Pas-à-Pas]
    FAB -->|Option 2| FAB_Import[Importer depuis Lien Web/Insta/YT]
    FAB -->|Option 3| FAB_Camera[Scanner un Plat / Caméra Culinaire]
    
    FAB_Create --> C
    FAB_Import --> C
    
    %% Masterclass Flow
    E --> CourseDetail[Détail du Cours & Vidéos Previews]
    CourseDetail --> Checkout[Achat Simulé & Inscription]
    Checkout --> CoursePlayer[Lecteur de Cours & Suivi Progression]
    
    %% Meal Planner Flow
    D & C --> AddToPlan[Ajouter au Menu de la Semaine]
    AddToPlan --> F
    F --> GroceryList[Génération Liste de Courses par Rayons]
\`\`\`

---

## 2. Parcours Détaillés

### A. Flux "Bouton Flottant (Samsung Food FAB)"
1. L'utilisateur clique sur le bouton orange terracotta flottant.
2. Un menu circulaire ou étendu s'anime avec 3 actions distinctes :
   - **Créer une recette** : Ouvre un stepper interactif (Infos clés, Pays d'origine, Ingrédients dynamiques, Étapes avec minuteurs et astuces).
   - **Importer depuis un lien** : Invite l'utilisateur à coller une URL TikTok, YouTube, Instagram ou Blog culinaire. Un aperçu structuré est généré automatiquement.
   - **Prendre une photo** : Active la caméra de l'appareil ou le simulateur de reconnaissance d'assiette africaine/caribéenne (Thiéboudienne, Alloco, Griot, Colombo...).

### B. Flux "Masterclass & Monétisation Chef"
1. L'élève explore le catalogue par niveau ou chef certifié.
2. Clic sur un cours : consultation du programme des leçons, avis des élèves et aperçu vidéo gratuit.
3. Clic sur "S'inscrire au cours" : confirmation immédiate avec débit simulé.
4. Accès immédiat au lecteur interactif avec case à cocher pour marquer les leçons terminées et évaluer le cours.
`
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design Brief & Charte Graphique',
    badge: 'Design System',
    summary: 'Couleurs chaudes afro-caribéennes, typographies Fraunces & Plus Jakarta Sans, discipline zéro-pill.',
    markdownContent: `# 🎨 AfroKréyol Kitchen — UI/UX Design Brief

## 1. Philosophie Esthétique : "L'Élégance Chaleureuse"
L'identité visuelle d'AfroKréyol Kitchen célèbre les couleurs de la terre, des épices et de la flore afro-caribéenne, tout en respectant une rigueur typographique et un minimalisme haut de gamme digne des plus belles applications contemporaines.

---

## 2. Palette de Couleurs & Tokens de Marque

| Token | Hex | Rôle & Usage |
| :--- | :--- | :--- |
| **Terracotta Royal** | \`#D9532F\` | Bouton d'action principal, accents chaleureux, badges chef |
| **Ocre & Mangue Mûre** | \`#F4A261\` | Étoiles de notation, surbrillance d'ingrédients, alertes douces |
| **Vert Palmier Tropical** | \`#1B4332\` | Marqueur d'authenticité, éléments végétariens, touches organiques |
| **Vert Sauge Doux** | \`#2D6A4F\` | États actifs secondaires, tags discrets |
| **Sable Lin Chaud** | \`#FAF7F2\` | Fond principal de l'application (chaleureux, doux pour les yeux) |
| **Ébène Café Profond** | \`#1A1615\` | Typographie principale, contrastes élevés WCAG AAA |
| **Sable Fumé** | \`#F3EDE2\` | Cartes, bordures délicates, conteneurs de listes |

---

## 3. Typographie & Rythme Visuel
* **Titres & Identité Émotionnelle** : \`Fraunces\` (Google Font avec empattements chaleureux, expressifs et prestigieux).
* **Corps de Texte & Données** : \`Plus Jakarta Sans\` (sans-serif géométrique lisible et aéré).
* **Minuteurs & Quantités** : \`JetBrains Mono\` (police à chasse fixe pour les métriques de cuisson précises).

---

## 4. Règles Anti-Slop & Discipline Zéro-Pill
1. **Pas de pilules statiques multicolores** empilées au-dessus des titres. Les métadonnées (pays, durée, difficulté) s'affichent sous forme de texte sobre avec séparateur médian (\`·\`).
2. **Rayons de courbure proportionnés** : $r_{inner} = r_{outer} - padding$. Cartes principales à \`rounded-2xl\`, conteneurs internes à \`rounded-xl\`.
3. **Micro-animations feutrées** : Transitions \`ease-out\` de 200ms sur les clics de boutons, scale-up discret de 1.02 sur le survol des cartes.
`
  },
  {
    id: 'backend-schema',
    title: 'Backend Schema (Supabase & PostgreSQL)',
    badge: 'SQL DDL Supabase',
    summary: 'Tables relationnelles complètes, clés étrangères, index, politiques RLS et triggers Supabase.',
    markdownContent: `# 🗄️ AfroKréyol Kitchen — Schema PostgreSQL / Supabase

Voici le script SQL complet prêt à être exécuté dans le SQL Editor de Supabase pour instancier la totalité de la base de données relationnelle :

\`\`\`sql
-- ============================================================================
-- AFROKREYOL KITCHEN - SUPABASE DATABASE MIGRATION SCRIPT
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('member', 'chef');
CREATE TYPE recipe_difficulty AS ENUM ('Facile', 'Moyen', 'Expert');
CREATE TYPE course_level AS ENUM ('Tous niveaux', 'Intermédiaire', 'Master Chef');

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    role user_role DEFAULT 'member',
    country TEXT NOT NULL DEFAULT 'Sénégal',
    country_flag TEXT NOT NULL DEFAULT '🇸🇳',
    bio TEXT,
    specialties TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT FALSE,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. RECIPES TABLE
CREATE TABLE public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    country TEXT NOT NULL,
    country_flag TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty recipe_difficulty NOT NULL DEFAULT 'Moyen',
    prep_time_minutes INT NOT NULL DEFAULT 30,
    cook_time_minutes INT NOT NULL DEFAULT 45,
    servings INT NOT NULL DEFAULT 4,
    image_url TEXT NOT NULL,
    heritage_story TEXT,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    bookmarks_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. RECIPE INGREDIENTS TABLE
CREATE TABLE public.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC(8,2) NOT NULL,
    unit TEXT NOT NULL,
    aisle TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0
);

-- 6. RECIPE STEPS TABLE
CREATE TABLE public.recipe_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    title TEXT NOT NULL,
    instruction TEXT NOT NULL,
    duration_minutes INT,
    tip TEXT
);

-- 7. SOCIAL INTERACTIONS: LIKES, COMMENTS, BOOKMARKS
CREATE TABLE public.recipe_likes (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE public.recipe_bookmarks (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE public.recipe_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. COURSES & MASTERCLASSES
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chef_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'EUR',
    level course_level NOT NULL DEFAULT 'Tous niveaux',
    duration_hours TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    thumbnail_url TEXT NOT NULL,
    enrolled_count INT DEFAULT 0,
    learning_outcomes TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT,
    is_free_preview BOOLEAN DEFAULT FALSE,
    order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE public.course_enrollments (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    progress_percent INT DEFAULT 0,
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, course_id)
);

-- 9. MEAL PLANNER
CREATE TABLE public.meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_name TEXT NOT NULL, -- 'Lundi', 'Mardi', etc.
    slot_type TEXT NOT NULL, -- 'lunch' ou 'dinner'
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. NOTIFICATIONS IN-APP
CREATE TYPE notification_type AS ENUM ('like', 'comment', 'enrollment');

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_id TEXT, -- recipe_id ou course_id
    target_title TEXT,
    target_image TEXT,
    amount_earned NUMERIC(8,2) DEFAULT 0.00,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public read recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Users insert recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users update own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Chefs create courses" ON public.courses FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'chef')
);

CREATE POLICY "Users read own notifications" ON public.notifications 
    FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "Users update own notifications" ON public.notifications 
    FOR UPDATE USING (auth.uid() = recipient_id);
\`\`\`
`
  },
  {
    id: 'implementation-plan',
    title: 'Plan d\'Implémentation & Déploiement',
    badge: 'Roadmap & Ops',
    summary: 'Feuille de route en 6 phases, checklist de mise en production Vercel & Supabase, tests & monitoring.',
    markdownContent: `# 🚀 AfroKréyol Kitchen — Plan d'Implémentation & Déploiement

## 1. Feuille de Route en 6 Sprints

### Sprint 1 : Socle & Design System Afro-Caribéen (Semaines 1-2)
* Mise en place du layout responsive, des polices \`Fraunces\` et \`Plus Jakarta Sans\`.
* Création des composants atomes : cartes de recettes, badges de pays, boutons d'action.
* Intégration du thème de couleurs (Terracotta, Ocre, Palmier, Ébène).

### Sprint 2 : Cœur Social & Exploration (Semaines 3-4)
* Fil d'actualité avec pagination infinie / virtualisée.
* Système de likes, commentaires et signets optimistes.
* Filtrage géographique (Afrique de l'Ouest, Centrale, Antilles, Caraïbes anglophones).
* Vue détaillée de recette avec calculateur de portions en direct.

### Sprint 3 : Bouton Flottant Samsung Food (Semaines 5-6)
* FAB animé en 3 volets interactifs :
  1. Assistant de création pas-à-pas avec upload photo.
  2. Parseur d'URL pour extraire les recettes de réseaux sociaux.
  3. Scanner de caméra culinaire avec reconnaissance d'assiette.

### Sprint 4 : Marketplace Masterclasses Chefs (Semaines 7-8)
* Fiches cours avec curriculum, avis et prévisualisation vidéo.
* Flux d'inscription immédiat et lecteur de leçons avec suivi de progression.
* Tableau de bord Chef pour suivre les revenus et les métriques d'élèves.

### Sprint 5 : Planificateur & Liste de Courses Intelligente (Semaines 9-10)
* Grille hebdomadaire (Lundi au Dimanche, Déjeuner/Dîner).
* Consolidation automatique des ingrédients par rayons d'épicerie spécialisée.
* Exportation de liste et mode case à cocher pour les courses.

### Sprint 6 : Tests, Sécurité & Déploiement Vercel (Semaines 11-12)
* Exécution des migrations Supabase et configuration des buckets S3.
* Audit d'accessibilité WCAG AA et tests de charge.
* Déploiement sur le réseau Vercel Edge avec monitoring d'erreurs Sentry.

---

## 2. Guide de Déploiement en Production sur Vercel & Supabase

\`\`\`bash
# 1. Cloner le repository
git clone https://github.com/afrogourmet/afrokreyol-kitchen.git
cd afrokreyol-kitchen

# 2. Configurer les variables d'environnement
cp .env.example .env.local
# Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

# 3. Installer les dépendances et builder
npm install
npm run build

# 4. Déploiement Vercel
vercel --prod
\`\`\`
`
  }
];
