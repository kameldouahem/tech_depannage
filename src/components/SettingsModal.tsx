import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured, saveSupabaseCredentials } from '../lib/supabase';
import { resetTicketsToDefault } from '../lib/storage';
import {
  X,
  Database,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  MessageCircle,
  Download,
  RotateCcw,
  Check,
  AlertCircle,
  Save,
  Globe,
  Briefcase
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
}) => {
  const { user, updateProfile, isSupabaseActive } = useAuth();
  const [activeTab, setActiveTab] = useState<'company' | 'database'>('company');

  // Company and Admin profile state
  const [companyName, setCompanyName] = useState(user?.companyName || 'TechDepan Express');
  const [fullName, setFullName] = useState(user?.fullName || 'Kamel Douahem');
  const [email, setEmail] = useState(user?.email || 'admin@depannage.fr');
  const [phone, setPhone] = useState(user?.phone || '06 12 34 56 78');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsappNumber || '06 12 34 56 78');
  const [companyAddress, setCompanyAddress] = useState(user?.companyAddress || '14 Rue de la République, 75011 Paris');
  const [siret, setSiret] = useState(user?.siret || '892 145 678 00019');
  const [interventionArea, setInterventionArea] = useState(user?.interventionArea || 'Paris & Île-de-France (rayon 25 km)');
  const [openingHours, setOpeningHours] = useState(user?.openingHours || 'Du Lundi au Samedi : 8h30 - 19h30');
  const [bioDescription, setBioDescription] = useState(
    user?.bioDescription || 'Dépannage informatique rapide à domicile & en atelier · PC, Mac, Imprimante, Réseau'
  );

  // Database / Supabase state
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('techdepan_supabase_url') || import.meta.env.VITE_SUPABASE_URL || ''
  );
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('techdepan_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );
  
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  if (!isOpen) return null;

  const handleSaveCompanyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setStatusMsg(null);

    const success = await updateProfile({
      companyName: companyName.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim() || phone.trim(),
      companyAddress: companyAddress.trim(),
      siret: siret.trim(),
      interventionArea: interventionArea.trim(),
      openingHours: openingHours.trim(),
      bioDescription: bioDescription.trim(),
    });

    setIsSavingProfile(false);
    if (success) {
      setStatusMsg({
        type: 'success',
        text: 'Coordonnées de l\'entreprise et du technicien mises à jour avec succès !',
      });
      setTimeout(() => setStatusMsg(null), 3000);
    } else {
      setStatusMsg({
        type: 'error',
        text: 'Erreur lors de la mise à jour des coordonnées.',
      });
    }
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl && !supabaseKey) {
      saveSupabaseCredentials('', '');
      setStatusMsg({ type: 'success', text: 'Supabase déconnecté. Mode autonome local activé.' });
      return;
    }

    if (!supabaseUrl.startsWith('http')) {
      setStatusMsg({ type: 'error', text: 'L\'URL Supabase doit commencer par https://' });
      return;
    }

    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    setStatusMsg({ type: 'success', text: 'Paramètres Supabase enregistrés avec succès !' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Voulez-vous réinitialiser les demandes avec les données de démonstration ?')) {
      resetTicketsToDefault();
      onDataReset();
      setStatusMsg({ type: 'success', text: 'Base de données réinitialisée aux données de démo !' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleExportJSON = () => {
    const data = localStorage.getItem('techdepan_tickets_v1') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techdepan-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Paramètres Administrateur</h2>
              <p className="text-xs text-slate-400">Coordonnées de l'entreprise, profil & connexions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="px-6 pt-3 bg-slate-900 border-b border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'company'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Coordonnées Entreprise & Téléphones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'database'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Base Supabase & Sauvegarde</span>
          </button>
        </div>

        {/* Notification feedback */}
        {statusMsg && (
          <div className={`mx-6 mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${statusMsg.type === 'success' ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' : 'bg-red-950/60 border border-red-800 text-red-300'}`}>
            {statusMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'company' && (
            <form onSubmit={handleSaveCompanyProfile} className="space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3.5">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Identité de l'Entreprise</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nom de la société / Enseigne *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: TechDepan Express"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nom & Prénom de l'Administrateur *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Kamel Douahem"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>Téléphone principal (Appels) *</span>
                      </span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Utilisé sur la page réseaux sociaux et fiches d'intervention</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-green-400" />
                        <span>Numéro WhatsApp Business</span>
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Lien direct pour le bouton WhatsApp client</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-400" />
                      <span>Email professionnel *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@techdepan.fr"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span>Numéro SIRET (optionnel)</span>
                    </label>
                    <input
                      type="text"
                      value={siret}
                      onChange={(e) => setSiret(e.target.value)}
                      placeholder="Ex: 892 145 678 00019"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>Adresse de l'Atelier / Siège social</span>
                  </label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Ex: 14 Rue de la République, 75011 Paris"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Practical information & social bio */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3.5">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Informations Publiques & Réseaux Sociaux</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Horaires d'ouverture</span>
                    </label>
                    <input
                      type="text"
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                      placeholder="Ex: Du Lundi au Samedi : 8h30 - 19h30"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>Zone d'intervention</span>
                    </label>
                    <input
                      type="text"
                      value={interventionArea}
                      onChange={(e) => setInterventionArea(e.target.value)}
                      placeholder="Ex: Paris & Île-de-France (rayon 25 km)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Slogan / Description courte (affiché en tête de l'interface client réseaux)
                  </label>
                  <textarea
                    rows={2}
                    value={bioDescription}
                    onChange={(e) => setBioDescription(e.target.value)}
                    placeholder="Ex: Dépannage informatique rapide à domicile & en atelier · PC, Mac, Imprimante, Réseau"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Enregistrement...' : 'Enregistrer les coordonnées de la société'}</span>
              </button>
            </form>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              {/* Supabase Connection Config */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Base de données Supabase / PostgreSQL</span>
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isSupabaseActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                    {isSupabaseActive ? 'Connecté' : 'Mode Local'}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Connectez votre projet Supabase ou laissez vide pour continuer avec le stockage local hors-ligne.
                </p>

                <form onSubmit={handleSaveSupabase} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      SUPABASE URL (ex: https://xyz.supabase.co)
                    </label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyz.supabase.co"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      SUPABASE ANON KEY
                    </label>
                    <input
                      type="password"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition cursor-pointer"
                  >
                    Enregistrer la configuration Supabase
                  </button>
                </form>
              </div>

              {/* Backup & Reset */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sauvegarde & Restauration
                </h3>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter backup JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/40 text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser démo</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {user ? `${user.companyName} · ${user.phone}` : 'Profil Administrateur'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
