import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { InterventionTicket, EquipmentType } from '../types';
import { addTicket, getStoredTickets, getStatusLabel, getEquipmentLabel } from '../lib/storage';
import { makePhoneCall, openWhatsApp } from '../utils/quickActions';
import {
  Wrench,
  Phone,
  MessageCircle,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  Search,
  MapPin,
  Laptop,
  Check,
  AlertCircle,
  Share2,
  ArrowRight,
  ShieldCheck,
  Zap,
  ArrowLeft
} from 'lucide-react';

interface ClientPublicViewProps {
  onSwitchToAdmin: () => void;
}

export const ClientPublicView: React.FC<ClientPublicViewProps> = ({ onSwitchToAdmin }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'request' | 'track'>('request');

  const companyName = user?.companyName || 'TechDepan Express';
  const technicianName = user?.fullName || 'Votre Technicien';
  const phone = user?.phone || '06 12 34 56 78';
  const whatsappPhone = user?.whatsappNumber || user?.phone || '06 12 34 56 78';
  const bioDesc = user?.bioDescription || 'Dépannage informatique rapide à domicile & en atelier · PC, Mac, Imprimante, Réseau';
  const hours = user?.openingHours || 'Du Lundi au Samedi : 8h30 - 19h30';
  const address = user?.companyAddress || 'Atelier & Dépannage à domicile';
  const area = user?.interventionArea || 'Paris & Île-de-France';

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('portable');
  const [issueDescription, setIssueDescription] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'telephone'>('whatsapp');
  const [submittedTicket, setSubmittedTicket] = useState<InterventionTicket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Tracking states
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedTicket, setTrackedTicket] = useState<InterventionTicket | null | 'not_found'>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('La photo ne doit pas dépasser 5 Mo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoDataUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!clientName.trim()) {
      setFormError('Veuillez indiquer votre prénom ou nom.');
      return;
    }
    if (!clientPhone.trim()) {
      setFormError('Veuillez indiquer votre numéro de téléphone.');
      return;
    }
    if (!issueDescription.trim()) {
      setFormError('Veuillez décrire brièvement la panne.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = addTicket({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientAddress: clientCity.trim() || 'À déterminer',
        source: preferredContact === 'whatsapp' ? 'whatsapp' : 'site_web',
        equipmentType,
        category: 'Demande en ligne (Réseaux Sociaux)',
        issueDescription: issueDescription.trim(),
        photoUrl: photoDataUrl,
        status: 'nouvelle',
        priority: 'normal',
        price: 0,
        isPaid: false,
      });

      setSubmittedTicket(newTicket);
    } catch {
      setFormError('Une erreur est survenue lors de l\'envoi. Veuillez nous contacter directement par WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    const tickets = getStoredTickets();
    const cleanQ = trackQuery.trim().toLowerCase();
    const found = tickets.find(
      (t) =>
        t.ticketNumber.toLowerCase() === cleanQ ||
        t.clientPhone.replace(/[\s.-]/g, '').includes(cleanQ.replace(/[\s.-]/g, ''))
    );

    if (found) {
      setTrackedTicket(found);
    } else {
      setTrackedTicket('not_found');
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'nouvelle': return { step: 1, label: 'Demande reçue', text: 'Le technicien examine votre demande.' };
      case 'a_contacter': return { step: 1, label: 'En attente de contact', text: 'Le technicien va vous appeler / écrire.' };
      case 'planifiee': return { step: 2, label: 'Intervention planifiée', text: 'Rendez-vous fixé pour la prise en charge.' };
      case 'en_intervention': return { step: 3, label: 'Dépannage en cours', text: 'Votre matériel est en cours de réparation.' };
      case 'terminee': return { step: 4, label: 'Réparation terminée', text: 'Votre équipement est prêt et réparé !' };
      case 'annulee': return { step: 0, label: 'Demande annulée', text: 'Cette intervention a été clôturée.' };
      default: return { step: 1, label: 'En cours', text: 'Traitement en cours.' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-3 sm:p-4">
      {/* Container sized specifically for mobile social media webview (Instagram, TikTok, WhatsApp bio) */}
      <div className="w-full max-w-md mx-auto space-y-4 pb-12">
        {/* Top Mini Bar with Admin Switch */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Technicien disponible aujourd'hui</span>
          </span>
          <button
            onClick={onSwitchToAdmin}
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            <span>Espace Pro</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Hero Card / Brand profile (Link-in-bio style) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30 mb-3">
            <Wrench className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight">
            {companyName}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            {bioDesc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Intervention sous 24h</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>Diagnostic clair</span>
            </span>
            {area && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{area}</span>
              </>
            )}
          </div>

          {/* Direct Contact Buttons (Instant Thumb Reach) */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <button
              onClick={() => openWhatsApp(whatsappPhone, 'Client Réseaux Sociaux')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-xs shadow-md shadow-green-600/25 active:scale-95 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </button>

            <button
              onClick={() => makePhoneCall(phone)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 active:scale-95 transition cursor-pointer"
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span>Appeler ({phone})</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation: Demander un dépannage VS Suivre mon ticket */}
        <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('request');
              setSubmittedTicket(null);
            }}
            className={`py-2 rounded-lg transition text-center cursor-pointer ${
              activeTab === 'request'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛠️ Déclarer une panne
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`py-2 rounded-lg transition text-center cursor-pointer ${
              activeTab === 'track'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔍 Suivre ma réparation
          </button>
        </div>

        {/* TAB 1: EXPRESS REPAIR REQUEST FORM */}
        {activeTab === 'request' && (
          submittedTicket ? (
            /* Success confirmation card */
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Demande bien reçue !</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Votre demande a été transmise directement au technicien.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Numéro de suivi :</span>
                  <span className="font-mono font-bold text-amber-400">{submittedTicket.ticketNumber}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Client :</span>
                  <span className="font-semibold text-white">{submittedTicket.clientName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Matériel :</span>
                  <span className="text-slate-200">{getEquipmentLabel(submittedTicket.equipmentType)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Le technicien va vous recontacter par {submittedTicket.source === 'whatsapp' ? 'WhatsApp' : 'téléphone'} dans les plus brefs délais.
              </p>

              {/* Instant WhatsApp forward */}
              <button
                onClick={() =>
                  openWhatsApp(
                    whatsappPhone,
                    submittedTicket.clientName,
                    submittedTicket.ticketNumber
                  )
                }
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-600/30 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmer sur WhatsApp maintenant</span>
              </button>

              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  setClientName('');
                  setClientPhone('');
                  setIssueDescription('');
                  setPhotoDataUrl(undefined);
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            /* Express request form */
            <form onSubmit={handleSubmitRequest} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white">Formulaire express de dépannage</h2>
                <p className="text-xs text-slate-400">Remplissez en 30 secondes pour une prise en charge prioritaire</p>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Votre Nom ou Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Sophie Martin"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Type d'appareil en panne *
                  </label>
                  <select
                    value={equipmentType}
                    onChange={(e) => setEquipmentType(e.target.value as EquipmentType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="portable">💻 Ordinateur Portable (PC)</option>
                    <option value="tour">🖥️ Ordinateur Fixe / Tour</option>
                    <option value="mac">🍎 Mac (MacBook, iMac)</option>
                    <option value="imprimante">🖨️ Imprimante / Scanner</option>
                    <option value="reseau">📶 Box Internet / Wifi</option>
                    <option value="tablette">📱 Tablette / iPad</option>
                    <option value="autre">Autre matériel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description de la panne *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Ex: L'écran reste noir avec un ventilateur bruyant / Windows plante au démarrage / Virus pub..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ville ou Code Postal
                  </label>
                  <input
                    type="text"
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder="Ex: Paris 11ème, Montreuil..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Photo upload / Camera button */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Photo de la panne (optionnel)</span>
                    {photoDataUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoDataUrl(undefined)}
                        className="text-[11px] text-red-400 hover:underline cursor-pointer"
                      >
                        Retirer
                      </button>
                    )}
                  </label>

                  {photoDataUrl ? (
                    <div className="flex items-center gap-3 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                      <img
                        src={photoDataUrl}
                        alt="Aperçu panne"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-700"
                      />
                      <span className="text-xs text-emerald-400 font-medium">Photo jointe ✓</span>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-950 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-blue-500 rounded-xl text-xs text-slate-300 transition cursor-pointer">
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span>Prendre ou joindre une photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Preferred contact channel */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mode de rappel souhaité
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreferredContact('whatsapp')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition cursor-pointer ${
                        preferredContact === 'whatsapp'
                          ? 'bg-green-950/50 border-green-500 text-green-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-green-400" />
                      <span>Par WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredContact('telephone')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition cursor-pointer ${
                        preferredContact === 'telephone'
                          ? 'bg-blue-950/50 border-blue-500 text-blue-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>Par Appel</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande de dépannage'}
              </button>
            </form>
          )
        )}

        {/* TAB 2: TRACKING AN EXISTING REPAIR */}
        {activeTab === 'track' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white">Suivi de votre dépannage en direct</h2>
              <p className="text-xs text-slate-400">Entrez votre numéro de ticket (ex: DEP-2026-081) ou votre numéro de téléphone</p>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="DEP-2026-081 ou 06..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Vérifier</span>
              </button>
            </form>

            {trackedTicket === 'not_found' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                <p>Aucune intervention trouvée avec cet identifiant.</p>
                <p className="mt-1 text-slate-300">Vérifiez le numéro ou contactez-nous directement par WhatsApp.</p>
              </div>
            )}

            {trackedTicket && trackedTicket !== 'not_found' && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3.5">
                <div className="flex items-start justify-between border-b border-slate-800/80 pb-2.5">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">{trackedTicket.ticketNumber}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{trackedTicket.clientName}</h3>
                    <p className="text-xs text-slate-400">{getEquipmentLabel(trackedTicket.equipmentType)}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30">
                    {getStatusLabel(trackedTicket.status)}
                  </span>
                </div>

                {/* Progress bar steps */}
                <div className="py-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                    <span>Avancement</span>
                    <span className="text-blue-400 font-semibold">{getStatusProgress(trackedTicket.status).label}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(getStatusProgress(trackedTicket.status).step / 4) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-300 mt-2 italic">
                    « {getStatusProgress(trackedTicket.status).text} »
                  </p>
                </div>

                {/* Details */}
                {trackedTicket.diagnosticNotes && (
                  <div className="text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="font-semibold text-slate-300 block mb-0.5">Note du technicien :</span>
                    <p className="text-slate-400">{trackedTicket.diagnosticNotes}</p>
                  </div>
                )}

                {trackedTicket.price > 0 && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Montant de la prestation :</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {trackedTicket.price} € {trackedTicket.isPaid ? '(Réglé)' : '(À régler)'}
                    </span>
                  </div>
                )}

                {/* Direct question button */}
                <button
                  onClick={() => openWhatsApp(whatsappPhone, trackedTicket.clientName, trackedTicket.ticketNumber)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs text-white font-medium flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-green-400" />
                  <span>Poser une question sur ce ticket</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer info & guarantees */}
        <div className="text-center space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-900">
          <p className="font-semibold text-slate-300">
            {companyName} · {technicianName}
          </p>
          <p className="text-[11px] text-slate-400">
            {address} · {hours}
          </p>
          <p className="text-[11px] text-slate-500">
            Tél : {phone} · Devis gratuit · Pièces garanties
          </p>
        </div>
      </div>
    </div>
  );
};
