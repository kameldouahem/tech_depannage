import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Plus, LogOut, Settings, Wrench, Share2, Smartphone } from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'today' | 'all' | 'completed';
  setCurrentView: (view: 'dashboard' | 'today' | 'all' | 'completed') => void;
  onOpenNewTicket: () => void;
  onOpenSettings: () => void;
  onOpenShareModal: () => void;
  onOpenInstallModal: () => void;
  todayCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenNewTicket,
  onOpenSettings,
  onOpenShareModal,
  onOpenInstallModal,
  todayCount,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Zone (Single text element wordmark with icon) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
            <Wrench className="w-5 h-5" />
          </div>
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className="text-left cursor-pointer group"
          >
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
              {user?.companyName || 'TechDepan'}
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (clean text links with subtle hover/active states) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-slate-800 text-blue-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Tableau de bord
          </button>

          <button
            onClick={() => setCurrentView('today')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              currentView === 'today'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>Interventions du jour</span>
            {todayCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {todayCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'all'
                ? 'bg-slate-800 text-blue-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Toutes les demandes
          </button>

          <button
            onClick={() => setCurrentView('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'completed'
                ? 'bg-slate-800 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Terminées
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <PWAInstallButton />

          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3 py-2 text-xs font-semibold active:scale-95 transition cursor-pointer whitespace-nowrap"
            title="Installer sur Smartphone & Générer APK Android"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">App / APK</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3 py-2 text-xs font-semibold active:scale-95 transition cursor-pointer whitespace-nowrap"
            title="Lien bio réseaux sociaux (Instagram, TikTok, WhatsApp)"
          >
            <Share2 className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden lg:inline">Lien Réseaux</span>
          </button>

          <button
            onClick={onOpenNewTicket}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 text-xs font-bold shadow-lg shadow-blue-600/25 active:scale-95 transition cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle Demande</span>
            <span className="sm:hidden">Nouvelle</span>
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* User profile & actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Paramètres & Base de données"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition cursor-pointer"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab strip for one-handed reach */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-slate-900 border-t border-slate-800/80 overflow-x-auto text-xs">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer ${
            currentView === 'dashboard' ? 'text-blue-400 font-bold bg-slate-800' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentView('today')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer flex items-center gap-1 ${
            currentView === 'today' ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-400'
          }`}
        >
          <span>Aujourd'hui</span>
          {todayCount > 0 && (
            <span className="text-[10px] px-1 bg-amber-500/20 text-amber-300 rounded-full font-mono">
              {todayCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setCurrentView('all')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer ${
            currentView === 'all' ? 'text-blue-400 font-bold bg-slate-800' : 'text-slate-400'
          }`}
        >
          Demandes
        </button>
        <button
          onClick={() => setCurrentView('completed')}
          className={`px-2.5 py-1 rounded-md whitespace-nowrap cursor-pointer ${
            currentView === 'completed' ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-400'
          }`}
        >
          Terminées
        </button>
      </div>
    </header>
  );
};
