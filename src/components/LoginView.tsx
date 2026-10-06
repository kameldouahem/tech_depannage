import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wrench, Shield, Lock, Mail, ArrowRight, KeyRound, AlertCircle, CheckCircle2, Database } from 'lucide-react';

interface LoginViewProps {
  onSwitchToClient?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSwitchToClient }) => {
  const { login, resetPassword, isSupabaseActive } = useAuth();
  const [email, setEmail] = useState('admin@depannage.fr');
  const [password, setPassword] = useState('tech2026!');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Erreur d\'authentification');
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@depannage.fr');
    setPassword('tech2026!');
    setError(null);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);
    if (!resetEmail) return;

    const res = await resetPassword(resetEmail);
    if (res.success) {
      setResetStatus({ type: 'success', message: res.message });
    } else {
      setResetStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-4">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            TechDepan
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Espace Technicien Dépannage Informatique
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>{isSupabaseActive ? 'Connecté à Supabase & PostgreSQL' : 'Mode Autonome / Base Locale'}</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-base">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Connexion Administrateur</span>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 cursor-pointer"
            >
              Remplir Démo
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@depannage.fr"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Mot de Passe
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotPassword(true);
                    setResetStatus(null);
                  }}
                  className="text-xs text-slate-400 hover:text-blue-400 transition cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Accéder à l'espace de dépannage</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Reminder */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Identifiants administrateur par défaut :
            </p>
            <p className="text-xs font-mono text-slate-300 mt-1 select-all">
              <span className="text-blue-400">admin@depannage.fr</span> / <span className="text-amber-400">tech2026!</span>
            </p>
          </div>
        </div>

        {/* Public Client Interface Link for Social Media */}
        {onSwitchToClient && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={onSwitchToClient}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition shadow-sm cursor-pointer"
            >
              <span>📱 Vous êtes client ? Déclarer une panne (Lien Réseaux)</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-4">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-white">
                Réinitialisation du mot de passe
              </h2>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Indiquez votre adresse e-mail administrateur. Vous recevrez les instructions pour réinitialiser votre accès.
            </p>

            {resetStatus && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
                  resetStatus.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                    : 'bg-red-950/60 border border-red-800 text-red-300'
                }`}
              >
                {resetStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <span>{resetStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email du compte
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  placeholder="admin@depannage.fr"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                >
                  Envoyer le lien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
