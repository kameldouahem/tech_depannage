/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './components/LoginView';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { NewTicketModal } from './components/NewTicketModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { ShareClientLinkModal } from './components/ShareClientLinkModal';
import { InstallAppModal } from './components/InstallAppModal';
import { ClientPublicView } from './components/ClientPublicView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { InterventionTicket, InterventionStatus } from './types';
import { getStoredTickets, updateTicket, deleteTicket } from './lib/storage';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [tickets, setTickets] = useState<InterventionTicket[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'today' | 'all' | 'completed'>('dashboard');
  
  // Public client interface mode (e.g., from Instagram/TikTok/WhatsApp bio link)
  const [isClientViewMode, setIsClientViewMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return search.includes('view=client') || search.includes('client=1') || hash.includes('client');
    }
    return false;
  });

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<InterventionTicket | null>(null);

  // Load tickets on mount
  useEffect(() => {
    setTickets(getStoredTickets());
  }, []);

  const refreshTickets = () => {
    setTickets(getStoredTickets());
  };

  const handleTicketCreated = (newTicket: InterventionTicket) => {
    refreshTickets();
    setSelectedTicket(newTicket);
  };

  const handleStatusChange = (ticketId: string, newStatus: InterventionStatus) => {
    const updated = updateTicket(ticketId, { status: newStatus });
    if (updated) {
      refreshTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updated);
      }
    }
  };

  const handleUpdateTicket = (id: string, updates: Partial<InterventionTicket>, changeNote?: string) => {
    const updated = updateTicket(id, updates, changeNote);
    if (updated) {
      refreshTickets();
      setSelectedTicket(updated);
    }
  };

  const handleDeleteTicket = (id: string) => {
    deleteTicket(id);
    refreshTickets();
    setSelectedTicket(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Chargement de TechDepan...</p>
        </div>
      </div>
    );
  }

  // Public Client Interface mode for Social Media bios
  if (isClientViewMode) {
    return (
      <ClientPublicView
        onSwitchToAdmin={() => {
          setIsClientViewMode(false);
          // Clean URL param
          if (window.history?.pushState) {
            window.history.pushState({}, '', window.location.pathname);
          }
        }}
      />
    );
  }

  // All pages are protected: if not logged in, show LoginView with client switch option
  if (!isAuthenticated) {
    return (
      <LoginView
        onSwitchToClient={() => setIsClientViewMode(true)}
      />
    );
  }

  const todayStr = '2026-10-06';
  const todayCount = tickets.filter(
    (t) => t.scheduledAt && t.scheduledAt.startsWith(todayStr) && t.status !== 'terminee' && t.status !== 'annulee'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenNewTicket={() => setIsNewModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        todayCount={todayCount}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <Dashboard
          tickets={tickets}
          currentView={currentView}
          onSelectTicket={(ticket) => setSelectedTicket(ticket)}
          onStatusChange={handleStatusChange}
          onOpenNewTicket={() => setIsNewModalOpen(true)}
        />
      </main>

      {/* Footer info for field technician */}
      <footer className="border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-400 no-print">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <p>TechDepan · Outil de dépannage informatique pour technicien de terrain</p>
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="text-emerald-400 hover:underline cursor-pointer"
          >
            📱 Installer sur Smartphone / APK
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Lien Bio Réseaux Sociaux
          </button>
        </div>
      </footer>

      {/* Modal: New Ticket */}
      <NewTicketModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onTicketCreated={handleTicketCreated}
      />

      {/* Modal: Ticket Detail / Fiche Intervention */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdate={handleUpdateTicket}
        onDelete={handleDeleteTicket}
      />

      {/* Modal: Settings & Database */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataReset={refreshTickets}
      />

      {/* Modal: Share Client Link */}
      <ShareClientLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenClientView={() => setIsClientViewMode(true)}
      />

      {/* Modal: Install App & APK Generator */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Offline PWA Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
