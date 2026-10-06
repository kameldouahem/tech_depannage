import React from 'react';
import { InterventionTicket, InterventionStatus } from '../types';
import { getStatusLabel, getEquipmentLabel, getSourceLabel } from '../lib/storage';
import { makePhoneCall, openWhatsApp, openGoogleMaps, sendEmail } from '../utils/quickActions';
import { Phone, MessageCircle, MapPin, Mail, Calendar, Clock, Euro, AlertTriangle } from 'lucide-react';

interface TicketCardProps {
  ticket: InterventionTicket;
  onSelect: (ticket: InterventionTicket) => void;
  onStatusChange?: (ticketId: string, newStatus: InterventionStatus) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onSelect,
  onStatusChange,
}) => {
  const isToday = () => {
    if (!ticket.scheduledAt) return false;
    const todayStr = '2026-10-06'; // Local app date
    return ticket.scheduledAt.startsWith(todayStr);
  };

  const getStatusBorderColor = (status: InterventionStatus) => {
    switch (status) {
      case 'nouvelle': return 'border-l-blue-500';
      case 'a_contacter': return 'border-l-amber-500';
      case 'planifiee': return 'border-l-indigo-500';
      case 'en_intervention': return 'border-l-purple-500';
      case 'terminee': return 'border-l-emerald-500';
      case 'annulee': return 'border-l-slate-600';
      default: return 'border-l-slate-700';
    }
  };

  const getStatusBadgeStyle = (status: InterventionStatus) => {
    switch (status) {
      case 'nouvelle': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'a_contacter': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'planifiee': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'en_intervention': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'terminee': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'annulee': return 'text-slate-400 bg-slate-800/40 border-slate-700';
      default: return 'text-slate-400 bg-slate-800';
    }
  };

  return (
    <div
      onClick={() => onSelect(ticket)}
      className={`group relative bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 hover:shadow-md transition-all cursor-pointer border-l-4 ${getStatusBorderColor(ticket.status)}`}
    >
      {/* Top row: Client name + Status selector / indicator */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
              {ticket.clientName}
            </h3>
            {ticket.priority === 'critique' && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-red-400">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span className="hidden sm:inline">Urgent</span>
              </span>
            )}
          </div>
          {/* Metadata clean text with dot separators */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 truncate">
            <span className="font-mono text-slate-400">{ticket.ticketNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{getEquipmentLabel(ticket.equipmentType)}</span>
            <span aria-hidden="true">·</span>
            <span>via {getSourceLabel(ticket.source)}</span>
          </div>
        </div>

        {/* Status indicator / quick dropdown */}
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <select
            value={ticket.status}
            onChange={(e) => onStatusChange && onStatusChange(ticket.id, e.target.value as InterventionStatus)}
            className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none transition cursor-pointer ${getStatusBadgeStyle(ticket.status)}`}
          >
            <option value="nouvelle" className="bg-slate-900 text-slate-200">Nouvelle</option>
            <option value="a_contacter" className="bg-slate-900 text-slate-200">À contacter</option>
            <option value="planifiee" className="bg-slate-900 text-slate-200">Planifiée</option>
            <option value="en_intervention" className="bg-slate-900 text-slate-200">En intervention</option>
            <option value="terminee" className="bg-slate-900 text-slate-200">Terminée</option>
            <option value="annulee" className="bg-slate-900 text-slate-200">Annulée</option>
          </select>
        </div>
      </div>

      {/* Problem description + thumbnail if available */}
      <div className="flex items-start gap-3 my-2.5">
        {ticket.photoUrl && (
          <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
            <img
              src={ticket.photoUrl}
              alt="Photo du problème"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {ticket.issueDescription}
          </p>
          {ticket.diagnosticNotes && (
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
              Diag : {ticket.diagnosticNotes}
            </p>
          )}
        </div>
      </div>

      {/* Location / Schedule / Price bar */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-y-1.5 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 truncate max-w-[240px]">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{ticket.clientAddress}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          {ticket.scheduledAt && (
            <span className={`flex items-center gap-1 font-mono text-[11px] font-medium ${isToday() ? 'text-amber-400 font-semibold' : 'text-slate-300'}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isToday() ? "Aujourd'hui à " : ''}
                {ticket.scheduledAt.substring(11, 16)}
              </span>
            </span>
          )}

          {ticket.price > 0 && (
            <span className="flex items-center gap-0.5 font-mono text-slate-200 font-bold tabular-nums">
              <span>{ticket.price}</span>
              <span>€</span>
              {ticket.isPaid ? (
                <span className="text-[10px] text-emerald-400 font-normal ml-0.5">(Payé)</span>
              ) : (
                <span className="text-[10px] text-amber-400 font-normal ml-0.5">(En attente)</span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions Bar (Mandatory field technician ergonomic buttons) */}
      <div
        className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => makePhoneCall(ticket.clientPhone)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/40 text-xs font-semibold transition active:scale-95 cursor-pointer"
          title={`Appeler ${ticket.clientPhone}`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Appeler</span>
        </button>

        <button
          type="button"
          onClick={() => openWhatsApp(ticket.clientPhone, ticket.clientName, ticket.ticketNumber)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-green-950/40 hover:bg-green-900/50 text-green-400 border border-green-800/40 text-xs font-semibold transition active:scale-95 cursor-pointer"
          title="Écrire sur WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => openGoogleMaps(ticket.clientAddress, ticket.gpsUrl)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 text-blue-400 border border-blue-800/40 text-xs font-semibold transition active:scale-95 cursor-pointer"
          title="Itinéraire Google Maps"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Maps</span>
        </button>

        {ticket.clientEmail && (
          <button
            type="button"
            onClick={() => sendEmail(ticket.clientEmail!, ticket.clientName, ticket.ticketNumber)}
            className="flex items-center justify-center p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition active:scale-95 cursor-pointer"
            title="Envoyer un email"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
