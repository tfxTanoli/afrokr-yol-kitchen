import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, Loader2 } from 'lucide-react';
import { AfrodeliciousEmblem } from '../AfrodeliciousLogo';
import { ALL_WORLD_COUNTRIES, getCountryFlag } from '../../data/allWorldCountries';
import { useAuth, PASSWORD_MIN_LENGTH } from '../../context/AuthContext';
import { toUserMessage } from '../../lib/supabase';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

const inputClass = 'w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none bg-slate-50/50';
const labelClass = 'block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1';

/**
 * Full-page authentication (login, registration, password recovery & reset),
 * styled after the original "Connexion & Inscription" panel.
 */
export const AuthScreen: React.FC<{ recoveryMode?: boolean }> = ({ recoveryMode = false }) => {
  const { signIn, signUp, requestPasswordReset, updatePassword, signOut } = useAuth();

  const [mode, setMode] = useState<Mode>(recoveryMode ? 'reset' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('Sénégal');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Expired / already-used email links come back with an error in the URL fragment
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search.slice(1));
    if (params.get('error') || params.get('error_code')) {
      setError(params.get('error_code') === 'otp_expired'
        ? 'Ce lien a expiré ou a déjà été utilisé. Demandez un nouveau lien de réinitialisation.'
        : 'Ce lien est invalide. Veuillez réessayer.');
      if (params.get('error_code') === 'otp_expired') setMode('forgot');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const activeMode: Mode = recoveryMode ? 'reset' : mode;

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setSuccess(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setSuccess(null);

    if ((activeMode === 'register' || activeMode === 'reset') && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeMode === 'login') {
        await signIn(email, password);
      } else if (activeMode === 'register') {
        const { needsEmailConfirmation } = await signUp({
          fullName: name,
          email,
          password,
          country,
          countryFlag: getCountryFlag(country),
        });
        if (needsEmailConfirmation) {
          setSuccess('Compte créé ! Consultez votre boîte mail pour confirmer votre adresse, puis connectez-vous.');
          setMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      } else if (activeMode === 'forgot') {
        await requestPasswordReset(email);
        setSuccess('Si un compte existe pour cette adresse, un lien de réinitialisation vient d’être envoyé.');
      } else {
        await updatePassword(password);
      }
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = {
    login: 'Se connecter à mon compte Afrodelicious',
    register: 'Créer mon compte Afrodelicious 🚀',
    forgot: 'Envoyer le lien de réinitialisation',
    reset: 'Enregistrer mon nouveau mot de passe',
  }[activeMode];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-7 space-y-6 bg-gradient-to-b from-orange-50/30 via-white to-amber-50/20">

          {/* Brand header */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 pt-1">
            {/* Official logo shown large: it already carries the brand name */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-[#FF4E27]/25 via-amber-400/20 to-[#FF7849]/25 rounded-full blur-xl opacity-75 pointer-events-none" />
              <AfrodeliciousEmblem className="relative w-28 h-28 sm:w-32 sm:h-32 shadow-[0_8px_30px_rgba(255,78,39,0.15)]" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-[#FF4E27] text-[10px] font-black uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#FF4E27]" />
                <span>Espace Gastronomique Panafricain & Caribéen</span>
              </div>
              <h1 className="font-serif font-black text-2xl text-slate-900 tracking-tight">
                {activeMode === 'forgot' ? 'Mot de passe oublié' : activeMode === 'reset' ? 'Nouveau mot de passe' : 'Connexion & Inscription'}
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                {activeMode === 'forgot'
                  ? 'Saisissez votre adresse email : nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.'
                  : activeMode === 'reset'
                    ? 'Choisissez un nouveau mot de passe pour votre compte.'
                    : 'Rejoignez des milliers de passionnés : découvrez et sauvegardez les recettes authentiques d’Afrique et des Caraïbes.'}
              </p>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div role="alert" className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span className="flex-1">{error}</span>
            </div>
          )}
          {success && (
            <div role="status" className="p-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2.5 shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-100" />
              <span className="flex-1">{success}</span>
            </div>
          )}

          {/* Login / register toggle */}
          {(activeMode === 'login' || activeMode === 'register') && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold shadow-inner">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeMode === 'login' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-[#FF4E27]" />
                <span>Se Connecter</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeMode === 'register' ? 'bg-white text-[#FF4E27] shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-[#FF4E27]" />
                <span>Créer un Compte</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {activeMode === 'register' && (
              <div>
                <label htmlFor="auth-name" className={labelClass}>Nom complet *</label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Aïssatou Diallo"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none bg-slate-50/50"
                />
              </div>
            )}

            {activeMode !== 'reset' && (
              <div>
                <label htmlFor="auth-email" className={labelClass}>Adresse Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {activeMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="auth-password" className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                    {activeMode === 'reset' ? 'Nouveau mot de passe *' : 'Mot de passe *'}
                  </label>
                  {activeMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-[10px] font-bold text-[#FF4E27] hover:underline cursor-pointer"
                    >
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={activeMode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs focus:border-[#FF4E27] focus:outline-none bg-slate-50/50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {(activeMode === 'register' || activeMode === 'reset') && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    {PASSWORD_MIN_LENGTH} caractères minimum, avec au moins une lettre et un chiffre.
                  </p>
                )}
              </div>
            )}

            {(activeMode === 'register' || activeMode === 'reset') && (
              <div>
                <label htmlFor="auth-password-confirm" className={labelClass}>Confirmer le mot de passe *</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="auth-password-confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>
            )}

            {activeMode === 'register' && (
              <div>
                <label htmlFor="auth-country" className={`${labelClass} flex items-center justify-between`}>
                  <span>Pays d'origine ou de tradition culinaire</span>
                  <span className="text-[10px] font-normal text-slate-400">({ALL_WORLD_COUNTRIES.length} pays)</span>
                </label>
                <select
                  id="auth-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs bg-white focus:border-[#FF4E27] focus:outline-none"
                >
                  {Array.from(new Set(ALL_WORLD_COUNTRIES.map(c => c.region))).map(region => (
                    <optgroup key={region} label={`📍 ${region}`}>
                      {ALL_WORLD_COUNTRIES.filter(c => c.region === region).map(c => (
                        <option key={c.name} value={c.name}>{c.name} {c.flag}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] via-[#FF6036] to-[#F59E0B] hover:from-[#E03814] hover:to-[#FF4E27] text-white text-xs sm:text-sm font-black tracking-wide transition-all shadow-md shadow-[#FF4E27]/30 hover:shadow-lg hover:shadow-[#FF4E27]/40 active:scale-[0.99] cursor-pointer disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{submitLabel}</span>
            </button>

            {activeMode === 'forgot' && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour à la connexion</span>
              </button>
            )}
            {activeMode === 'reset' && (
              <button
                type="button"
                onClick={() => signOut()}
                className="w-full text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Annuler et revenir à la connexion</span>
              </button>
            )}
          </form>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Connexion chiffrée</span>
            </span>
            <span>·</span>
            <span>Conforme RGPD Européen</span>
          </div>
        </div>
      </div>
    </div>
  );
};
