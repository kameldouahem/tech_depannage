import React, { useState } from 'react';
import { InterventionTicket, InterventionStatus, RequestSource, EquipmentType, Priority } from '../types';
import { addTicket } from '../lib/storage';
import { X, Upload, Camera, MapPin, AlertTriangle, Check, Phone, User, FileText, Smartphone } from 'lucide-react';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: (newTicket: InterventionTicket) => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [gpsUrl, setGpsUrl] = useState('');
  const [source, setSource] = useState<RequestSource>('telephone');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('portable');
  const [category, setCategory] = useState('Démarrage & Système');
  const [issueDescription, setIssueDescription] = useState('');
  const [status, setStatus] = useState<InterventionStatus>('nouvelle');
  const [priority, setPriority] = useState<Priority>('normal');
  const [scheduledAt, setScheduledAt] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [diagnosticNotes, setDiagnosticNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('La photo ne doit pas dépasser 5 Mo.');
        return;
      }
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoDataUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressChange = (address: string) => {
    setClientAddress(address);
    if (address.trim().length > 3) {
      setGpsUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`);
    } else {
      setGpsUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientName.trim()) {
      setError('Le nom du client est requis.');
      return;
    }
    if (!clientPhone.trim()) {
      setError('Le numéro de téléphone est requis.');
      return;
    }
    if (!issueDescription.trim()) {
      setError('La description du problème est requise.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = addTicket({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || undefined,
        clientAddress: clientAddress.trim() || 'À l\'atelier / Non renseignée',
        gpsUrl: gpsUrl.trim() || undefined,
        source,
        equipmentType,
        category,
        issueDescription: issueDescription.trim(),
        photoUrl: photoDataUrl,
        status,
        priority,
        scheduledAt: scheduledAt || undefined,
        diagnosticNotes: diagnosticNotes.trim() || undefined,
        price: Number(price) || 0,
        isPaid: false,
      });

      onTicketCreated(created);
      onClose();
    } catch {
      setError('Erreur lors de l\'enregistrement de la demande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Enregistrer une demande client
              </h2>
              <p className="text-xs text-slate-400">
                Prise en charge rapide du dépannage informatique
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Client Info */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 space-y-3.5">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Informations Client</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nom du client *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Sophie Martin, Boulangerie..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Téléphone *</span>
                  <span className="text-[10px] text-slate-400">Pour appel & WhatsApp</span>
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Ex: 06 12 34 56 78"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email (optionnel)
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@domaine.fr"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Source de la demande
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as RequestSource)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="telephone">📞 Téléphone</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="email">📧 Email</option>
                  <option value="recommandation">🤝 Recommandation</option>
                  <option value="site_web">🌐 Site Web / Formulaire</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            {/* Address & GPS */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Adresse / Localisation</span>
                <span className="text-[10px] text-slate-400">Lien GPS calculé automatiquement</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="Ex: 14 Rue de la Paix, 75002 Paris"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              {gpsUrl && (
                <p className="text-[11px] text-blue-400 mt-1 truncate">
                  Lien Maps : {gpsUrl}
                </p>
              )}
            </div>
          </div>

          {/* Section 2: Problème & Matériel */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 space-y-3.5">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Matériel & Description du Problème</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Type de Matériel
                </label>
                <select
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value as EquipmentType)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="portable">💻 PC Portable</option>
                  <option value="tour">🖥️ Tour Fixe / Bureau</option>
                  <option value="mac">🍎 MacBook / iMac</option>
                  <option value="imprimante">🖨️ Imprimante / Périphérique</option>
                  <option value="reseau">📶 Box / Réseau / WiFi</option>
                  <option value="tablette">📱 Tablette / iPad</option>
                  <option value="serveur">🖧 Serveur / NAS</option>
                  <option value="autre">Autre matériel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catégorie de panne
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Démarrage & Système">Démarrage & Système (BSOD, blocage)</option>
                  <option value="Écran / Affichage">Écran / Dalle fissurée / Affichage</option>
                  <option value="Virus / Sécurité">Virus / Adware / Sécurité</option>
                  <option value="Lenteur & Optimisation">Lenteur & Nettoyage</option>
                  <option value="Surchauffe & Bruit">Surchauffe / Ventilateur / Poussière</option>
                  <option value="Réseau & Connexion">Réseau / Wifi / Perte internet</option>
                  <option value="Sauvegarde & Données">Sauvegarde & Récupération de données</option>
                  <option value="Autre">Autre diagnostic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description du problème décrit par le client *
              </label>
              <textarea
                required
                rows={3}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Ex: Le PC s'allume mais l'écran reste noir après avoir émis 3 bips. Le client a un dossier urgent à rendre..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Photo Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Photo du matériel / message d'erreur</span>
                {photoDataUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoDataUrl(undefined);
                      setPhotoFileName('');
                    }}
                    className="text-[11px] text-red-400 hover:underline cursor-pointer"
                  >
                    Supprimer la photo
                  </button>
                )}
              </label>

              {photoDataUrl ? (
                <div className="flex items-center gap-4 p-2 bg-slate-900 border border-slate-800 rounded-xl">
                  <img
                    src={photoDataUrl}
                    alt="Aperçu"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white truncate font-medium">{photoFileName || 'Photo jointe'}</p>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Check className="w-3 h-3" />
                      <span>Photo prête à l'enregistrement</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-blue-500 rounded-xl text-xs text-slate-300 transition cursor-pointer">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span>Sélectionner une photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-blue-500 rounded-xl text-xs text-slate-300 transition cursor-pointer">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Prendre photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Statut, Planification & Tarif */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 space-y-3.5">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Gestion & Planification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Statut initial
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InterventionStatus)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="nouvelle">Nouvelle</option>
                  <option value="a_contacter">À contacter</option>
                  <option value="planifiee">Planifiée</option>
                  <option value="en_intervention">En intervention</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Priorité
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="normal">Normale</option>
                  <option value="urgent">Urgente</option>
                  <option value="critique">Critique (Urgent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tarif / Devis (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={price || ''}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="0 €"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Date et Heure prévue (optionnel)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes diagnostic pré-intervention
                </label>
                <input
                  type="text"
                  value={diagnosticNotes}
                  onChange={(e) => setDiagnosticNotes(e.target.value)}
                  placeholder="Ex: Prévoir clé USB bootable + câble SATA"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer la demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
