import React, { useState } from 'react';
import { AlertCircle, Loader2, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { AfrodeliciousLogo } from '../AfrodeliciousLogo';
import { AuthScreen } from './AuthScreen';

const CenteredCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-4">
      <div className="flex justify-center">
        <AfrodeliciousLogo size="md" showTagline />
      </div>
      {children}
    </div>
  </div>
);

/** Protects the whole application: only authenticated users with a loaded profile get through. */
export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status, session, profile, profileError, isPasswordRecovery, reloadProfile, signOut } = useAuth();
  const [isRetrying, setIsRetrying] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <CenteredCard>
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <p className="text-sm font-bold text-slate-900">Configuration du serveur manquante</p>
        <p className="text-xs text-slate-500">
          Les variables VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY doivent être définies.
        </p>
      </CenteredCard>
    );
  }

  if (status === 'loading') {
    return (
      <CenteredCard>
        <Loader2 className="w-6 h-6 text-[#FF4E27] animate-spin mx-auto" aria-label="Chargement" />
        <p className="text-xs text-slate-500">Chargement de votre espace…</p>
      </CenteredCard>
    );
  }

  if (isPasswordRecovery && session) {
    return <AuthScreen recoveryMode />;
  }

  if (status === 'signedOut' || !session) {
    return <AuthScreen />;
  }

  if (!profile) {
    return (
      <CenteredCard>
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
        <p className="text-sm font-bold text-slate-900">{profileError}</p>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={isRetrying}
            onClick={async () => {
              setIsRetrying(true);
              await reloadProfile();
              setIsRetrying(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#FF4E27] text-white text-xs font-bold hover:bg-[#E03814] flex items-center gap-1.5 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>Réessayer</span>
          </button>
          <button
            type="button"
            onClick={() => signOut()}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </CenteredCard>
    );
  }

  return <>{children}</>;
};
