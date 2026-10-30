/**
 * Security & Sanitization Utility for Afrodelicious
 * Provides defense-in-depth against:
 * - XSS (Cross-Site Scripting) & HTML/Script injection
 * - Open Redirects & Reverse Tabnabbing (window.opener hijacking)
 * - Prototype Pollution & Insecure Deserialization
 * - Insecure Protocol Injections (javascript:, vbscript:, data:text/html)
 * - Rate Limiting & Denial of Service via oversized payloads
 * - Sensitive PII & Financial Data Exposure (Credit card & IBAN masking)
 */

export interface SecurityThreatReport {
  isThreat: boolean;
  threatType?: 'XSS' | 'SQL_INJECTION' | 'PROTOCOL_INJECTION' | 'PROTOTYPE_POLLUTION' | 'OVERSIZED_PAYLOAD' | 'TABNABBING';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description?: string;
  originalPayload: string;
  sanitizedPayload: string;
  timestamp: string;
}

/**
 * Escapes sensitive HTML characters to prevent XSS execution
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;');
}

/**
 * Strips script tags, style tags, and dangerous inline events (onerror, onload, onclick, etc.)
 */
export function sanitizeText(text: string, maxLength: number = 2000): string {
  if (typeof text !== 'string') return '';
  
  // Truncate to prevent memory exhaustion / ReDoS
  let clean = text.trim().slice(0, maxLength);
  
  // Neutralize script tags and tags
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  
  // Neutralize inline event handlers like onerror, onclick, etc.
  clean = clean.replace(/\bon\w+\s*=/gi, 'data-blocked=');
  
  // Neutralize javascript: pseudo-protocol
  clean = clean.replace(/javascript\s*:/gi, 'blocked-scheme:');
  
  return clean;
}

/**
 * Validates URLs against dangerous schemes (javascript:, vbscript:, data:, file:)
 * Only allows safe protocols: http, https, mailto, tel, sms, whatsapp, signal, or relative paths.
 */
export function sanitizeUrl(url: string, fallback: string = '#'): string {
  if (!url || typeof url !== 'string') return fallback;
  
  const trimmed = url.trim();
  
  // Block javascript:, vbscript:, data: protocols
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:text/html') ||
    lower.startsWith('file:') ||
    lower.includes('&#') || // Obfuscated entities in schemes
    lower.includes('%6a%61%76%61') // Encoded "java"
  ) {
    console.warn('[Security Guard] Dangerous URL scheme blocked:', trimmed);
    return fallback;
  }
  
  // Allow safe relative URLs starting with / or #
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return trimmed;
  }
  
  // Allow safe external schemes
  const allowedSchemes = ['http:', 'https:', 'mailto:', 'tel:', 'sms:', 'whatsapp:', 'sgnl:'];
  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (allowedSchemes.includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    // If not a valid URL format, return fallback
    return fallback;
  }
  
  return fallback;
}

/**
 * Safely opens an external link preventing reverse tabnabbing (rel="noopener noreferrer")
 */
export function safeOpenWindow(url: string, target: string = '_blank'): Window | null {
  const safeUrl = sanitizeUrl(url);
  if (safeUrl === '#') return null;
  
  try {
    const win = window.open(safeUrl, target, 'noopener,noreferrer');
    if (win) {
      win.opener = null; // Enforce noopener
    }
    return win;
  } catch (err) {
    console.warn('[Security Guard] Failed to open external window safely:', err);
    return null;
  }
}

/**
 * Sanitizes numeric values (preventing NaN, negative price/tips injection, infinity)
 */
export function sanitizeNumber(value: unknown, min: number = 0, max: number = 1000000, defaultValue: number = 0): number {
  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) return defaultValue;
    return Math.min(Math.max(value, min), max);
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (isNaN(parsed) || !isFinite(parsed)) return defaultValue;
    return Math.min(Math.max(parsed, min), max);
  }
  return defaultValue;
}

/**
 * Mask sensitive payment cards and financial credentials
 */
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber) return '•••• •••• •••• ••••';
  const clean = cardNumber.replace(/\D/g, '');
  if (clean.length < 4) return '•••• •••• •••• ••••';
  const last4 = clean.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function maskIban(iban: string): string {
  if (!iban) return '•••• •••• •••• ••••';
  const clean = iban.replace(/\s/g, '');
  if (clean.length < 8) return 'FR•• •••• •••• ••••';
  return `${clean.slice(0, 4)} •••• •••• ${clean.slice(-4)}`;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '••••@••••.•••';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  return `${user[0]}${'*'.repeat(Math.max(user.length - 2, 2))}${user[user.length - 1]}@${domain}`;
}

/**
 * Safe LocalStorage wrapper preventing Prototype Pollution & JSON deserialization crash
 */
const STORAGE_PREFIX = 'afrodel_sec_';

export const safeStorage = {
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) return defaultValue;
      
      // Prevent prototype pollution
      if (raw.includes('__proto__') || raw.includes('constructor') || raw.includes('prototype')) {
        console.warn(`[Security Guard] Malicious prototype pollution payload detected in storage key "${key}"`);
        return defaultValue;
      }
      
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  },
  
  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      // Double check prototype pollution before writing
      if (serialized.includes('__proto__')) {
        return false;
      }
      localStorage.setItem(STORAGE_PREFIX + key, serialized);
      return true;
    } catch {
      return false;
    }
  },
  
  removeItem(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // Ignored
    }
  }
};

/**
 * In-memory client rate limiter to prevent brute force / click spamming
 */
class ClientRateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  checkLimit(actionKey: string, maxAttempts: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const timestamps = this.attempts.get(actionKey) || [];
    const validTimestamps = timestamps.filter(t => now - t < windowMs);
    
    if (validTimestamps.length >= maxAttempts) {
      this.attempts.set(actionKey, validTimestamps);
      return { allowed: false, remaining: 0 };
    }
    
    validTimestamps.push(now);
    this.attempts.set(actionKey, validTimestamps);
    return { allowed: true, remaining: maxAttempts - validTimestamps.length };
  }
  
  reset(actionKey: string): void {
    this.attempts.delete(actionKey);
  }
}

export const securityRateLimiter = new ClientRateLimiter();

/**
 * Pentester / Hacker Payload Security Analyzer
 * Analyzes simulated inputs and explains how Afrodelicious protects against them.
 */
export function auditSecurityPayload(input: string): SecurityThreatReport {
  const timestamp = new Date().toLocaleTimeString('fr-FR');
  
  if (!input || input.trim().length === 0) {
    return {
      isThreat: false,
      originalPayload: '',
      sanitizedPayload: '',
      timestamp
    };
  }
  
  const lower = input.toLowerCase();
  
  // 1. XSS Check
  if (
    lower.includes('<script') ||
    lower.includes('javascript:') ||
    lower.includes('onerror=') ||
    lower.includes('onload=') ||
    lower.includes('eval(') ||
    lower.includes('alert(') ||
    lower.includes('<img src=') ||
    lower.includes('<svg onload=')
  ) {
    return {
      isThreat: true,
      threatType: 'XSS',
      severity: 'CRITICAL',
      description: 'Tentative d\'injection de script malveillant (XSS). Les balises et gestionnaires d\'événements sont neutralisés par échappement strict.',
      originalPayload: input,
      sanitizedPayload: escapeHtml(sanitizeText(input)),
      timestamp
    };
  }
  
  // 2. Protocol Injection Check
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:text/html') ||
    lower.startsWith('file:')
  ) {
    return {
      isThreat: true,
      threatType: 'PROTOCOL_INJECTION',
      severity: 'HIGH',
      description: 'Tentative d\'exécution via faux protocole URL. Remplacé immédiatement par un lien sécurisé neutralisé (#).',
      originalPayload: input,
      sanitizedPayload: sanitizeUrl(input),
      timestamp
    };
  }
  
  // 3. SQL Injection simulation Check
  if (
    lower.includes('or 1=1') ||
    lower.includes('union select') ||
    lower.includes('drop table') ||
    lower.includes('--') ||
    lower.includes(';--') ||
    lower.includes('xp_cmdshell')
  ) {
    return {
      isThreat: true,
      threatType: 'SQL_INJECTION',
      severity: 'HIGH',
      description: 'Signature d\'injection SQL détectée. Toutes les requêtes sont isolées et paramétrées avec typage strict sans concaténation SQL.',
      originalPayload: input,
      sanitizedPayload: sanitizeText(input),
      timestamp
    };
  }
  
  // 4. Prototype Pollution Check
  if (lower.includes('__proto__') || lower.includes('constructor.prototype')) {
    return {
      isThreat: true,
      threatType: 'PROTOTYPE_POLLUTION',
      severity: 'CRITICAL',
      description: 'Tentative de pollution de prototype d\'objet JavaScript. Neutralisé par le filtre de désérialisation sécurisé.',
      originalPayload: input,
      sanitizedPayload: input.replace(/__proto__|constructor|prototype/gi, '[BLOCKED_KEY]'),
      timestamp
    };
  }
  
  // 5. Oversized payload check
  if (input.length > 5000) {
    return {
      isThreat: true,
      threatType: 'OVERSIZED_PAYLOAD',
      severity: 'MEDIUM',
      description: 'Payload volumineux susceptible de provoquer un déni de service (ReDoS). Tronqué automatiquement aux limites autorisées.',
      originalPayload: input.slice(0, 50) + '... (longueur ' + input.length + ')',
      sanitizedPayload: sanitizeText(input, 500),
      timestamp
    };
  }
  
  return {
    isThreat: false,
    originalPayload: input,
    sanitizedPayload: sanitizeText(input),
    timestamp
  };
}
