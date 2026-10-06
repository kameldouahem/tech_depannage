import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Share2, Smartphone, QrCode, MessageSquare } from 'lucide-react';

interface ShareClientLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenClientView: () => void;
}

export const ShareClientLinkModal: React.FC<ShareClientLinkModalProps> = ({
  isOpen,
  onClose,
  onOpenClientView,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Compute public link
  const clientUrl = `${window.location.origin}${window.location.pathname}?view=client`;

  const handleCopy = () => {
    navigator.clipboard.writeText(clientUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Lien Client Réseaux Sociaux</h2>
              <p className="text-xs text-slate-400">À placer en bio Instagram, TikTok, WhatsApp & Facebook</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Link box with 1-click copy */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Votre lien public (Link-in-bio) :
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={clientUrl}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
          </div>

          {/* Social Media Recommendations */}
          <div className="space-y-2.5 text-xs text-slate-300">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              Où utiliser ce lien ?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="font-semibold text-pink-400 block mb-0.5">📸 Instagram & TikTok</span>
                <p className="text-slate-400 text-[11px]">Ajoutez-le dans votre bio comme bouton « Déclarer une panne ».</p>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="font-semibold text-green-400 block mb-0.5">💬 WhatsApp Business</span>
                <p className="text-slate-400 text-[11px]">Dans la description du profil entreprise ou message d'accueil.</p>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="font-semibold text-blue-400 block mb-0.5">🌐 Google My Business</span>
                <p className="text-slate-400 text-[11px]">Définissez ce lien comme « URL de prise de rendez-vous ».</p>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="font-semibold text-amber-400 block mb-0.5">📄 Flyer / Carte de visite</span>
                <p className="text-slate-400 text-[11px]">Créez un QR code pointant vers cette page compacte.</p>
              </div>
            </div>
          </div>

          {/* Test / Preview Button */}
          <button
            onClick={() => {
              onClose();
              onOpenClientView();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>Tester l'interface client (Aperçu mobile)</span>
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
