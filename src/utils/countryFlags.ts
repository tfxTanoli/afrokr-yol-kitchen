// Country flags mapping and formatting utilities for Afrodelicious

export const COUNTRY_FLAG_MAP: Record<string, string> = {
  // Afrique
  'Sénégal': '🇸🇳',
  'Senegal': '🇸🇳',
  'SN': '🇸🇳',
  'SEN': '🇸🇳',
  'Côte d\'Ivoire': '🇨🇮',
  'Cote d\'Ivoire': '🇨🇮',
  'Ivory Coast': '🇨🇮',
  'CI': '🇨🇮',
  'CIV': '🇨🇮',
  'Cameroun': '🇨🇲',
  'Cameroon': '🇨🇲',
  'CM': '🇨🇲',
  'CMR': '🇨🇲',
  'Nigeria': '🇳🇬',
  'Nigéria': '🇳🇬',
  'NG': '🇳🇬',
  'NGA': '🇳🇬',
  'Ghana': '🇬🇭',
  'GH': '🇬🇭',
  'GHA': '🇬🇭',
  'Congo': '🇨🇬',
  'Congo DRC': '🇨🇩',
  'RDC': '🇨🇩',
  'CD': '🇨🇩',
  'COD': '🇨🇩',
  'Mali': '🇲🇱',
  'ML': '🇲🇱',
  'MLI': '🇲🇱',
  'Bénin': '🇧🇯',
  'Benin': '🇧🇯',
  'BJ': '🇧🇯',
  'BEN': '🇧🇯',
  'Togo': '🇹🇬',
  'TG': '🇹🇬',
  'TGO': '🇹🇬',
  'Gabon': '🇬🇦',
  'GA': '🇬🇦',
  'GAB': '🇬🇦',
  'Guinée': '🇬🇳',
  'Guinea': '🇬🇳',
  'GN': '🇬🇳',
  'GIN': '🇬🇳',
  'Madagascar': '🇲🇬',
  'MG': '🇲🇬',
  'MDG': '🇲🇬',
  'Afrique du Sud': '🇿🇦',
  'South Africa': '🇿🇦',
  'ZA': '🇿🇦',
  'ZAF': '🇿🇦',
  'Maroc': '🇲🇦',
  'Morocco': '🇲🇦',
  'MA': '🇲🇦',
  'MAR': '🇲🇦',
  'Éthiopie': '🇪🇹',
  'Ethiopia': '🇪🇹',
  'ET': '🇪🇹',
  'ETH': '🇪🇹',
  'Kenya': '🇰🇪',
  'KE': '🇰🇪',
  'KEN': '🇰🇪',
  'Cap-Vert': '🇨🇻',
  'Cape Verde': '🇨🇻',
  'CV': '🇨🇻',
  'CPV': '🇨🇻',
  'Algérie': '🇩🇿',
  'Tunisie': '🇹🇳',
  'Angola': '🇦🇴',
  'Burkina Faso': '🇧🇫',

  // Caraïbes & Amérique Latine
  'Haïti': '🇭🇹',
  'Haiti': '🇭🇹',
  'HT': '🇭🇹',
  'HTI': '🇭🇹',
  'Martinique': '🇲🇶',
  'MQ': '🇲🇶',
  'MTQ': '🇲🇶',
  'Guadeloupe': '🇬🇵',
  'GP': '🇬🇵',
  'GLP': '🇬🇵',
  'Jamaïque': '🇯🇲',
  'Jamaica': '🇯🇲',
  'JM': '🇯🇲',
  'JAM': '🇯🇲',
  'Trinité-et-Tobago': '🇹🇹',
  'Trinidad': '🇹🇹',
  'TT': '🇹🇹',
  'TTO': '🇹🇹',
  'Guyane': '🇬🇫',
  'Guyane Française': '🇬🇫',
  'GF': '🇬🇫',
  'Cuba': '🇨🇺',
  'CU': '🇨🇺',
  'CUB': '🇨🇺',
  'Brésil': '🇧🇷',
  'Brazil': '🇧🇷',
  'BR': '🇧🇷',
  'BRA': '🇧🇷',
  'Colombie': '🇨🇴',
  'Colombia': '🇨🇴',
  'CO': '🇨🇴',
  'COL': '🇨🇴',
  'Panama': '🇵🇦',
  'PA': '🇵🇦',
  'PAN': '🇵🇦',
  'Costa Rica': '🇨🇷',
  'CR': '🇨🇷',
  'CRI': '🇨🇷',

  // Amérique du Nord & Europe & Asie
  'France': '🇫🇷',
  'FR': '🇫🇷',
  'FRA': '🇫🇷',
  'États-Unis': '🇺🇸',
  'Etats-Unis': '🇺🇸',
  'USA': '🇺🇸',
  'US': '🇺🇸',
  'United States': '🇺🇸',
  'Canada': '🇨🇦',
  'CA': '🇨🇦',
  'CAN': '🇨🇦',
  'Royaume-Uni': '🇬🇧',
  'UK': '🇬🇧',
  'GB': '🇬🇧',
  'Belgique': '🇧🇪',
  'BE': '🇧🇪',
  'Suisse': '🇨🇭',
  'CH': '🇨🇭',
  'Singapour': '🇸🇬',
  'Singapore': '🇸🇬',
  'SG': '🇸🇬',
  'Thaïlande': '🇹🇭',
  'Thailand': '🇹🇭',
  'TH': '🇹🇭',
  'Malaisie': '🇲🇾',
  'Malaysia': '🇲🇾',
  'MY': '🇲🇾',
  'Vietnam': '🇻🇳',
  'VN': '🇻🇳'
};

/**
 * Returns authentic emoji flag for any country name or ISO acronym.
 */
export function getCountryFlag(country?: string): string {
  if (!country) return '🌍';
  const clean = country.trim();
  if (COUNTRY_FLAG_MAP[clean]) return COUNTRY_FLAG_MAP[clean];

  // Try case-insensitive and partial match
  const lower = clean.toLowerCase();
  for (const [key, flag] of Object.entries(COUNTRY_FLAG_MAP)) {
    if (key.toLowerCase() === lower) {
      return flag;
    }
  }

  for (const [key, flag] of Object.entries(COUNTRY_FLAG_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return flag;
    }
  }

  return '🌍';
}

/**
 * Ensures country label is always accompanied by its authentic flag.
 * E.g. "Sénégal" -> "🇸🇳 Sénégal"
 * E.g. "SN" -> "🇸🇳 SN (Sénégal)"
 */
export function formatCountryWithFlag(country?: string): string {
  if (!country) return '🌍 Terroirs du Monde';
  const clean = country.trim();
  const flag = getCountryFlag(clean);
  // If flag already present in text, return clean
  if (clean.includes(flag)) return clean;
  return `${flag} ${clean}`;
}
