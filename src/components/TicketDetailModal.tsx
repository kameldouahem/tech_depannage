import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { InterventionTicket, InterventionStatus } from '../types';
import { getStatusLabel, getEquipmentLabel, getSourceLabel } from '../lib/storage';
import { makePhoneCall, openWhatsApp, openGoogleMaps, sendEmail } from '../utils/quickActions';
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Calendar,
  Clock,
  Euro,
  Printer,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  History,
  Wrench,
  ShieldCheck,
  Save,
  Building2,
  ArrowRight
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: InterventionTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<InterventionTicket>, changeNote?: string) => void;
  onDelete: (id: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const { user } = useAuth();
  if (!isOpen || !ticket) return null;

  const [diagnosticNotes, setDiagnosticNotes] = useState(ticket.diagnosticNotes || '');
  const [workDone, setWorkDone] = useState(ticket.workDone || '');
  const [scheduledAt, setScheduledAt] = useState(ticket.scheduledAt || '');
  const [price, setPrice] = useState(ticket.price || 0);
  const [isPaid, setIsPaid] = useState(ticket.isPaid || false);
  const [paymentMethod, setPaymentMethod] = useState(ticket.paymentMethod || 'carte');
  const [newLogNote, setNewLogNote] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(ticket.id, {
      diagnosticNotes,
      workDone,
      scheduledAt: scheduledAt || undefined,
      price: Number(price) || 0,
      isPaid,
      paymentMethod,
    }, newLogNote.trim() ? newLogNote.trim() : undefined);

    setNewLogNote('');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleStatusChange = (newStatus: InterventionStatus) => {
    onUpdate(ticket.id, { status: newStatus }, `Changement de statut vers : ${getStatusLabel(newStatus)}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (st: InterventionStatus) => {
    switch (st) {
      case 'nouvelle': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'a_contacter': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'planifiee': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'en_intervention': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'terminee': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'annulee': return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto no-print">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">{ticket.ticketNumber}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(ticket.status)}`}>
                  {getStatusLabel(ticket.status)}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Fiche d'intervention · {ticket.clientName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Imprimer la fiche d'intervention"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions Bar (Prominent for field technician) */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => makePhoneCall(ticket.clientPhone)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Appeler ({ticket.clientPhone})</span>
            </button>

            <button
              onClick={() => openWhatsApp(ticket.clientPhone, ticket.clientName, ticket.ticketNumber)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => openGoogleMaps(ticket.clientAddress, ticket.gpsUrl)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Itinéraire GPS</span>
            </button>

            {ticket.clientEmail && (
              <button
                onClick={() => sendEmail(ticket.clientEmail!, ticket.clientName, ticket.ticketNumber)}
                className="flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                title="Email client"
              >
                <Mail className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Company Header Banner */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-white text-sm">{user?.companyName || 'TechDepan Express'}</span>
              <p className="text-slate-400 mt-0.5">{user?.fullName || 'Technicien'} · Tél : {user?.phone || '06 12 34 56 78'} · {user?.email || 'admin@depannage.fr'}</p>
              {user?.companyAddress && <p className="text-slate-500 text-[11px] mt-0.5">{user.companyAddress}</p>}
            </div>
            {user?.siret && (
              <div className="text-right text-[11px] text-slate-400 font-mono">
                <span>SIRET : {user.siret}</span>
              </div>
            )}
          </div>

          {isSavedNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Modifications enregistrées avec succès !</span>
            </div>
          )}

          {/* Status Pipeline Buttons */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Faire évoluer le statut du dépannage :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {(['nouvelle', 'a_contacter', 'planifiee', 'en_intervention', 'terminee', 'annulee'] as InterventionStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                    ticket.status === st
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                      : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                  }`}
                >
                  {getStatusLabel(st)}
                </button>
              ))}
            </div>
          </div>

          {/* Two-Column Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Problem & Hardware & Photo */}
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Problème Déclaré & Matériel</span>
                </h3>

                <div>
                  <span className="text-xs text-slate-400">Matériel :</span>
                  <p className="text-sm font-semibold text-white">
                    {getEquipmentLabel(ticket.equipmentType)} · {ticket.category}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400">Description du client :</span>
                  <p className="text-sm text-slate-200 mt-0.5 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                    {ticket.issueDescription}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400">Adresse d'intervention :</span>
                  <p className="text-sm text-slate-300 flex items-start gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{ticket.clientAddress}</span>
                  </p>
                </div>

                {/* Photo Viewer */}
                {ticket.photoUrl && (
                  <div className="pt-2">
                    <span className="text-xs text-slate-400 block mb-1.5">Photo jointe :</span>
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img
                        src={ticket.photoUrl}
                        alt="Problème matériel"
                        className="w-full max-h-56 object-cover hover:scale-105 transition duration-300 cursor-zoom-in"
                        onClick={() => window.open(ticket.photoUrl, '_blank')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Editable Diagnostic, Work Done & Pricing */}
            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3.5">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Diagnostic & Réalisation Technique</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Notes de diagnostic / Analyse technique
                  </label>
                  <textarea
                    rows={2}
                    value={diagnosticNotes}
                    onChange={(e) => setDiagnosticNotes(e.target.value)}
                    placeholder="Ex: Disque dur SMART en alerte, secteurs défectueux détectés. Remplacement SSD recommandé."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Intervention réalisée / Pièces changées
                  </label>
                  <textarea
                    rows={2}
                    value={workDone}
                    onChange={(e) => setWorkDone(e.target.value)}
                    placeholder="Ex: Clonage système vers SSD Crucial 500 Go, dépoussiérage ventirad, test de charge OK."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Date & Heure planifiée
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Prix Total (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPaid"
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:outline-none bg-slate-900 border-slate-700 cursor-pointer"
                    />
                    <label htmlFor="isPaid" className="text-xs font-semibold text-slate-200 cursor-pointer">
                      Paiement encaissé ({price} €)
                    </label>
                  </div>

                  {isPaid && (
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as 'carte' | 'especes' | 'virement' | 'cheque')}
                      className="text-xs bg-slate-900 border border-slate-800 text-slate-200 rounded-lg p-1.5 focus:outline-none"
                    >
                      <option value="carte">Carte bancaire</option>
                      <option value="especes">Espèces</option>
                      <option value="virement">Virement</option>
                      <option value="cheque">Chèque</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ajouter une note au journal / historique
                  </label>
                  <input
                    type="text"
                    value={newLogNote}
                    onChange={(e) => setNewLogNote(e.target.value)}
                    placeholder="Ex: Appel client à 11h, accord sur devis 89€."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>

          {/* Chronological History Log */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Historique & Traçabilité</span>
            </h3>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {ticket.history && ticket.history.length > 0 ? (
                ticket.history.map((h, i) => (
                  <div key={h.id || i} className="flex items-start gap-2.5 text-xs text-slate-300 border-l-2 border-slate-800 pl-3 py-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 -ml-[17px] mt-1 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="font-semibold text-slate-200">{h.action}</span>
                        <span>{new Date(h.timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      {h.note && (
                        <p className="text-slate-400 mt-0.5 text-xs">{h.note}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Aucun historique disponible.</p>
              )}
            </div>
          </div>

          {/* Delete Danger Zone */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">Confirmer la suppression ?</span>
                <button
                  onClick={() => {
                    onDelete(ticket.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Oui, supprimer
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer cette demande</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
