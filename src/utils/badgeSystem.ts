import { CulinaryBadge, Recipe, User, UserCulinaryStats } from '../types';

export const CULINARY_BADGES: Record<string, CulinaryBadge> = {
  top_chef: {
    id: 'top_chef',
    title: 'Top Chef',
    shortTitle: 'Top Chef',
    iconName: 'crown',
    emoji: '👑',
    description: 'Distinction d\'élite décernée aux maîtres de la gastronomie afro-caribéenne ayant publié au moins 10 recettes et fédéré plus de 250 mentions j\'aime.',
    minRecipes: 10,
    minLikes: 250,
    gradientClass: 'from-[#D9532F] via-[#F4A261] to-[#E76F51]',
    borderClass: 'border-[#D9532F]/50 ring-1 ring-[#D9532F]/30',
    badgeBgLight: 'bg-[#FDF2EE]',
    textColor: 'text-[#D9532F]',
    tagColor: 'bg-gradient-to-r from-[#B83E1D] via-[#D9532F] to-[#E76F51] text-white shadow-xs shadow-[#D9532F]/30',
    perks: [
      'Insigne prestigieux Top Chef 👑 visible sur toutes vos publications',
      'Mise en avant prioritaire dans l\'accueil et l\'exploration',
      'Habilitation à publier des Masterclasses payantes sur la marketplace',
      'Statut d\'autorité certifiée de la cuisine afro-caribéenne'
    ]
  },
  expert_culinaire: {
    id: 'expert_culinaire',
    title: 'Expert Culinaire',
    shortTitle: 'Expert',
    iconName: 'award',
    emoji: '🌟',
    description: 'Attribué aux créateurs culinaires réguliers ayant partagé au moins 5 recettes remarquées et rassemblé plus de 100 mentions j\'aime.',
    minRecipes: 5,
    minLikes: 100,
    gradientClass: 'from-[#1B4332] via-[#2D6A4F] to-[#40916C]',
    borderClass: 'border-[#2D6A4F]/50 ring-1 ring-[#2D6A4F]/30',
    badgeBgLight: 'bg-[#EBF2EE]',
    textColor: 'text-[#1B4332]',
    tagColor: 'bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-xs shadow-[#1B4332]/25',
    perks: [
      'Badge émeraude Expert Culinaire 🌟 sur votre profil public',
      'Indexation prioritaire dans les recherches par pays & terroirs',
      'Possibilité d\'animer des cercles et communautés culinaires',
      'Invitation aux dégustations et avant-premières partenaires'
    ]
  },
  cordon_bleu: {
    id: 'cordon_bleu',
    title: 'Cordon Bleu',
    shortTitle: 'Cordon Bleu',
    iconName: 'medal',
    emoji: '🎖️',
    description: 'Récompense les passionnés réguliers partageant activement leurs secrets de famille (au moins 3 recettes et 40 likes).',
    minRecipes: 3,
    minLikes: 40,
    gradientClass: 'from-[#C44927] to-[#E76F51]',
    borderClass: 'border-[#E76F51]/40 ring-1 ring-[#E76F51]/20',
    badgeBgLight: 'bg-[#FFF7ED]',
    textColor: 'text-[#C44927]',
    tagColor: 'bg-[#C44927] text-white',
    perks: [
      'Insigne Cordon Bleu sur chaque fiche recette',
      'Accès aux statistiques détaillées de consultation'
    ]
  },
  toque_montante: {
    id: 'toque_montante',
    title: 'Toque Montante',
    shortTitle: 'Toque Montante',
    iconName: 'chef-hat',
    emoji: '🍳',
    description: 'Encourage les nouveaux talents culinaires ayant partagé au moins 1 recette et reçu au moins 10 mentions j\'aime.',
    minRecipes: 1,
    minLikes: 10,
    gradientClass: 'from-[#B27C44] to-[#D4A373]',
    borderClass: 'border-[#D4A373]/50',
    badgeBgLight: 'bg-[#FAF3E8]',
    textColor: 'text-[#855B2E]',
    tagColor: 'bg-[#9E6C38] text-white',
    perks: [
      'Badge Toque Montante sur le profil et les commentaires',
      'Notification automatique aux abonnés lors d\'un nouveau post'
    ]
  },
  gourmet_novice: {
    id: 'gourmet_novice',
    title: 'Gourmet Découvreur',
    shortTitle: 'Gourmet',
    iconName: 'sprout',
    emoji: '🌱',
    description: 'Bienvenue dans la communauté AfroKréyol ! Publiez votre 1ère recette et récoltez des likes pour débloquer les badges supérieurs.',
    minRecipes: 0,
    minLikes: 0,
    gradientClass: 'from-[#7A6E63] to-[#8C7D70]',
    borderClass: 'border-[#E8DFD1]',
    badgeBgLight: 'bg-[#FAF7F2]',
    textColor: 'text-[#5C4F44]',
    tagColor: 'bg-[#5C4F44] text-white',
    perks: [
      'Sauvegarde illimitée de recettes favorites',
      'Accès libre à la planification de menus et listes de courses'
    ]
  }
};

// Badges ordered by prestige (highest first)
export const BADGES_ORDER: CulinaryBadge[] = [
  CULINARY_BADGES.top_chef,
  CULINARY_BADGES.expert_culinaire,
  CULINARY_BADGES.cordon_bleu,
  CULINARY_BADGES.toque_montante,
  CULINARY_BADGES.gourmet_novice
];

/**
 * Computes the total likes received by a user across all recipes they created.
 * Also considers baseline user stats for existing notable figures.
 */
export function getUserCulinaryMetrics(user: User, allRecipes: Recipe[]) {
  // Normalize strings for robust matching
  const userNameLower = (user.name || '').toLowerCase().trim();
  const userHandleLower = (user.handle || '').toLowerCase().trim();

  const userRecipes = allRecipes.filter(r => {
    const matchesId = r.authorId === user.id;
    const matchesName = r.authorName && (r.authorName.toLowerCase().trim() === userNameLower || r.authorName.toLowerCase().includes(userNameLower));
    const matchesHandle = r.authorHandle && r.authorHandle.toLowerCase().trim() === userHandleLower;
    return matchesId || matchesName || matchesHandle;
  });

  const sumLikesFromRecipes = userRecipes.reduce((acc, r) => acc + (r.likesCount || 0), 0);
  const publishedCount = Math.max(user.recipesCount || 0, userRecipes.length);

  // Baseline adjustment if this is an established user who has historical likes outside the immediate initial sample
  let totalLikesReceived = sumLikesFromRecipes;
  if (user.id === 'user-current' || userNameLower.includes('fatou')) {
    totalLikesReceived = Math.max(1450, sumLikesFromRecipes + 1100);
  } else if (user.id === 'user-rodrigue' || userNameLower.includes('rodrigue')) {
    totalLikesReceived = Math.max(890, sumLikesFromRecipes + 700);
  } else if (user.id === 'user-marcus' || userNameLower.includes('marcus')) {
    totalLikesReceived = Math.max(1620, sumLikesFromRecipes + 1200);
  } else if (user.id === 'user-marieline' || userNameLower.includes('marie-line')) {
    totalLikesReceived = Math.max(145, sumLikesFromRecipes + 80);
  }

  return {
    userRecipes,
    publishedCount,
    totalLikesReceived
  };
}

/**
 * Calculates complete culinary statistics and badge levels for a user.
 */
export function calculateUserCulinaryStats(user: User, allRecipes: Recipe[]): UserCulinaryStats {
  const { publishedCount, totalLikesReceived } = getUserCulinaryMetrics(user, allRecipes);

  // Determine unlocked badges based on:
  // 1. Published recipes count >= minRecipes
  // 2. Likes received >= minLikes
  const unlockedBadges = BADGES_ORDER.filter(badge => {
    return publishedCount >= badge.minRecipes && totalLikesReceived >= badge.minLikes;
  });

  // Fallback to gourmet_novice if none unlocked
  const currentBadge = unlockedBadges[0] || CULINARY_BADGES.gourmet_novice;

  // Find next higher badge
  const currentIndex = BADGES_ORDER.findIndex(b => b.id === currentBadge.id);
  const nextBadge = currentIndex > 0 ? BADGES_ORDER[currentIndex - 1] : null;

  // Calculate progress towards next badge
  let recipesProgressPercent = 100;
  let likesProgressPercent = 100;
  let overallProgressPercent = 100;

  if (nextBadge) {
    recipesProgressPercent = Math.min(100, Math.round((publishedCount / nextBadge.minRecipes) * 100));
    likesProgressPercent = Math.min(100, Math.round((totalLikesReceived / nextBadge.minLikes) * 100));
    // Average progress between recipes and likes
    overallProgressPercent = Math.min(100, Math.round((recipesProgressPercent + likesProgressPercent) / 2));
  }

  const allBadgesReport = [...BADGES_ORDER].reverse().map(badge => {
    const isUnlocked = publishedCount >= badge.minRecipes && totalLikesReceived >= badge.minLikes;
    const rProgress = badge.minRecipes > 0 ? Math.min(100, Math.round((publishedCount / badge.minRecipes) * 100)) : 100;
    const lProgress = badge.minLikes > 0 ? Math.min(100, Math.round((totalLikesReceived / badge.minLikes) * 100)) : 100;

    return {
      badge,
      isUnlocked,
      recipesCurrent: publishedCount,
      likesCurrent: totalLikesReceived,
      recipesProgress: rProgress,
      likesProgress: lProgress
    };
  });

  return {
    recipesCount: publishedCount,
    totalLikesReceived,
    currentBadge,
    nextBadge,
    recipesProgressPercent,
    likesProgressPercent,
    overallProgressPercent,
    allBadges: allBadgesReport
  };
}

/**
 * Helper to get the culinary badge for any recipe author by author info.
 */
export function getAuthorCulinaryBadge(authorName: string, authorId?: string, allRecipes: Recipe[] = []): CulinaryBadge {
  const nameLower = (authorName || '').toLowerCase();
  
  // Specific quick checks for known prominent demo authors
  if (nameLower.includes('fatou') || nameLower.includes('rodrigue') || nameLower.includes('marcus')) {
    return CULINARY_BADGES.top_chef;
  }
  if (nameLower.includes('marie-line') || nameLower.includes('gbagbo')) {
    return CULINARY_BADGES.expert_culinaire;
  }

  // If we have recipes, compute dynamically
  if (allRecipes.length > 0) {
    const authorRecipes = allRecipes.filter(r => 
      (authorId && r.authorId === authorId) || 
      (r.authorName && r.authorName.toLowerCase().includes(nameLower))
    );
    const count = authorRecipes.length;
    const likes = authorRecipes.reduce((acc, r) => acc + (r.likesCount || 0), 0);

    if (count >= 10 && likes >= 250) return CULINARY_BADGES.top_chef;
    if (count >= 5 && likes >= 100) return CULINARY_BADGES.expert_culinaire;
    if (count >= 3 && likes >= 40) return CULINARY_BADGES.cordon_bleu;
    if (count >= 1 && likes >= 10) return CULINARY_BADGES.toque_montante;
  }

  return CULINARY_BADGES.gourmet_novice;
}
