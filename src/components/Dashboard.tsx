import React, { useState, useMemo } from 'react';
import { InterventionTicket, InterventionStatus, RequestSource } from '../types';
import { TicketCard } from './TicketCard';
import { getStatusLabel } from '../lib/storage';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Kanban,
  List,
  AlertTriangle,
  CheckCircle2,
  Euro,
  MapPin,
  TrendingUp,
  Inbox,
  UserCheck
} from 'lucide-react';

interface DashboardProps {
  tickets: InterventionTicket[];
  currentView: 'dashboard' | 'today' | 'all' | 'completed';
  onSelectTicket: (ticket: InterventionTicket) => void;
  onStatusChange: (ticketId: string, newStatus: InterventionStatus) => void;
  onOpenNewTicket: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tickets,
  currentView,
  onSelectTicket,
  onStatusChange,
  onOpenNewTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'kanban' | 'list'>('kanban');

  const todayStr = '2026-10-06';

  // Interventions specifically scheduled for today
  const todayInterventions = useMemo(() => {
    return tickets.filter((t) => t.scheduledAt && t.scheduledAt.startsWith(todayStr));
  }, [tickets, todayStr]);

  // General KPIs
  const stats = useMemo(() => {
    const total = tickets.length;
    const pendingContact = tickets.filter((t) => t.status === 'nouvelle' || t.status === 'a_contacter').length;
    const inProgress = tickets.filter((t) => t.status === 'en_intervention' || t.status === 'planifiee').length;
    const completed = tickets.filter((t) => t.status === 'terminee').length;
    const totalRevenue = tickets
      .filter((t) => t.isPaid)
      .reduce((sum, t) => sum + (t.price || 0), 0);

    return { total, pendingContact, inProgress, completed, totalRevenue };
  }, [tickets]);

  // Filtered tickets based on active view and filters
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // View mode filtering
      if (currentView === 'today') {
        if (!t.scheduledAt || !t.scheduledAt.startsWith(todayStr)) return false;
      } else if (currentView === 'completed') {
        if (t.status !== 'terminee') return false;
      }

      // Search query filtering (name, phone, address, issue, number)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = t.clientName.toLowerCase().includes(q);
        const matchesPhone = t.clientPhone.toLowerCase().includes(q);
        const matchesAddress = t.clientAddress.toLowerCase().includes(q);
        const matchesIssue = t.issueDescription.toLowerCase().includes(q);
        const matchesNumber = t.ticketNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesAddress && !matchesIssue && !matchesNumber) {
          return false;
        }
      }

      // Source filter
      if (selectedSource !== 'all' && t.source !== selectedSource) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [tickets, currentView, searchQuery, selectedSource, selectedPriority, todayStr]);

  const kanbanColumns: { id: InterventionStatus; title: string; color: string }[] = [
    { id: 'nouvelle', title: 'Nouvelles', color: 'border-blue-500' },
    { id: 'a_contacter', title: 'À contacter', color: 'border-amber-500' },
    { id: 'planifiee', title: 'Planifiées', color: 'border-indigo-500' },
    { id: 'en_intervention', title: 'En intervention', color: 'border-purple-500' },
    { id: 'terminee', title: 'Terminées', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section: Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Interventions du jour</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {todayInterventions.length}
            </span>
            <span className="text-[11px] text-slate-400">programmées</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">À traiter / Rappeler</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-300">
              {stats.pendingContact}
            </span>
            <span className="text-[11px] text-slate-400">demandes</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">En cours / Planifiées</span>
            <UserCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-300">
              {stats.inProgress}
            </span>
            <span className="text-[11px] text-slate-400">dépannages</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">CA Encaissé</span>
            <Euro className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {stats.totalRevenue}
            </span>
            <span className="text-sm font-semibold text-emerald-400">€</span>
          </div>
        </div>
      </div>

      {/* Focus Box: Interventions du Jour (Always prominently accessible) */}
      {currentView === 'dashboard' && todayInterventions.length > 0 && (
        <section className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Interventions prioritaires prévues aujourd'hui</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {todayInterventions.length}
                </span>
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Mardi 06 Octobre 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {todayInterventions.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onSelect={onSelectTicket}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par client, téléphone, problème, adresse..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters & Layout switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">Toutes sources</option>
            <option value="telephone">📞 Téléphone</option>
            <option value="whatsapp">💬 WhatsApp</option>
            <option value="email">📧 Email</option>
            <option value="recommandation">🤝 Recommandation</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">Toutes priorités</option>
            <option value="critique">Critique (Urgent)</option>
            <option value="urgent">Urgente</option>
            <option value="normal">Normale</option>
          </select>

          {/* View toggle (Kanban vs List) */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setLayoutMode('kanban')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === 'kanban' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Kanban (par colonnes)"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                layoutMode === 'list' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Kanban or List */}
      {filteredTickets.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Aucune demande trouvée</h3>
          <p className="text-xs text-slate-400 mb-5">
            Aucun ticket ne correspond à vos filtres actuels.
          </p>
          <button
            onClick={onOpenNewTicket}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition cursor-pointer"
          >
            + Enregistrer une nouvelle demande
          </button>
        </div>
      ) : layoutMode === 'kanban' && currentView === 'dashboard' ? (
        /* Kanban Columns View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colTickets = filteredTickets.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-3 min-h-[300px]">
                {/* Column header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300">
                    {col.title}
                  </span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {colTickets.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {colTickets.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-800/80 rounded-lg">
                      Aucune demande
                    </div>
                  ) : (
                    colTickets.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onSelect={onSelectTicket}
                        onStatusChange={onStatusChange}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid / List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onSelect={onSelectTicket}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
