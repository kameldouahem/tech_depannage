import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  X,
  Smartphone,
  Download,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  QrCode,
  AlertTriangle,
  HelpCircle,
  FileCode
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'qr' | 'manual' | 'explain'>('qr');

  const appUrl = 'https://ais-pre-pmxvlnscioks3ee25cvfkh-560212273104.europe-west2.run.app';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(appUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Erreur QR code:', err));
    }
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerInstall = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  const handleDownloadAndroidProject = () => {
    const content = `// Guide de compilation APK Android pour TechDepan
// ===============================================

Pour créer un fichier .apk natif avec Android Studio :
1. Créez un nouveau projet "Empty Activity" dans Android Studio
2. Package : fr.techdepan.app
3. Ajoutez la dépendance TWA dans app/build.gradle :
   implementation 'androidx.browser:browser:1.8.0'
   implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'

4. Dans AndroidManifest.xml, configurez la Trusted Web Activity :
   <meta-data
       android:name="android.support.customtabs.trusted.DEFAULT_URL"
       android:value="${appUrl}" />

5. Cliquez sur Build > Build Bundle(s) / APK(s) > Build APK(s)
   Votre fichier APK sera généré dans app/build/outputs/apk/release/app-release.apk !
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TechDepan-Android-APK-Guide.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Installer sur votre Smartphone</h2>
              <p className="text-xs text-slate-400">Installation directe sans passer par un site tiers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="px-6 pt-3 bg-slate-900 border-b border-slate-800 flex gap-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-3 font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'qr'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>1. Scanner le QR Code (Immédiat)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`pb-2.5 px-3 font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'manual'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>2. Guide Android & iPhone</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('explain')}
            className={`pb-2.5 px-3 font-semibold flex items-center gap-1.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'explain'
                ? 'border-blue-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Pourquoi PWABuilder échoue ?</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: QR CODE DIRECT SCAN */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
                <p className="text-xs font-semibold text-slate-300 mb-3">
                  Pointez l'appareil photo de votre smartphone vers ce QR Code :
                </p>

                {qrCodeDataUrl ? (
                  <div className="p-3 bg-white rounded-2xl shadow-xl inline-block">
                    <img
                      src={qrCodeDataUrl}
                      alt="QR Code TechDepan"
                      className="w-56 h-56 rounded-lg block"
                    />
                  </div>
                ) : (
                  <div className="w-56 h-56 bg-slate-900 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-500">
                    Génération du QR Code...
                  </div>
                )}

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ouvre directement TechDepan sur votre smartphone</span>
                </div>
              </div>

              {/* Instructions on phone */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-left space-y-2 text-xs text-slate-300">
                <span className="font-bold text-white block">Dès que la page s'ouvre sur votre téléphone :</span>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                  <span>Sur <strong>Android</strong> : Appuyez sur les <strong>3 points (⋮)</strong> en haut à droite de Chrome → <strong>« Installer l'application »</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                  <span>Sur <strong>iPhone</strong> : Appuyez sur <strong>Partager</strong> en bas de Safari → <strong>« Sur l'écran d'accueil »</strong>.</span>
                </p>
                <p className="text-slate-400 text-[11px] italic pt-1">
                  ✓ L'icône de l'application s'installe directement dans vos applications Android/iOS, sans aucun fichier à télécharger.
                </p>
              </div>

              {/* Direct URL copy fallback */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL GUIDANCE */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  🤖 Comment Android installe l'application (WebAPK Natif) :
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sur Android, Google a créé le système <strong>WebAPK</strong>. Lorsque vous cliquez sur « Installer » dans Google Chrome :
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  <li>Android compile automatiquement un <strong>vrai APK</strong> dans votre téléphone.</li>
                  <li>L'application apparaît dans vos paramètres Android comme une application installée.</li>
                  <li>Elle s'ouvre en <strong>plein écran sans barre de navigateur</strong>.</li>
                  <li>Elle fonctionne hors-ligne avec le stockage local.</li>
                </ul>
              </div>

              {isInstallable && (
                <button
                  type="button"
                  onClick={handleTriggerInstall}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Installer sur cet appareil maintenant</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 3: WHY PWABUILDER FAILED EXPLANATION */}
          {activeTab === 'explain' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pourquoi PWABuilder affiche « Page not found » ?</span>
                </div>
                <p className="leading-relaxed">
                  Votre application est hébergée sur <strong>Google Cloud Run dans l'environnement de développement sécurisé de Google AI Studio</strong> (l'adresse <code>ais-pre-...run.app</code>).
                </p>
                <p className="leading-relaxed">
                  Cette adresse est <strong>protégée par votre session Google</strong>. Lorsque le robot externe de PWABuilder essaie d'y accéder depuis ses serveurs aux États-Unis, Google bloque son robot et lui renvoie une erreur 404/401. C'est pour cette raison que PWABuilder ne peut pas scanner cette URL de test.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-white block">La solution :</span>
                <p className="text-slate-300">
                  👉 <strong>Vous n'avez pas du tout besoin de PWABuilder !</strong> Scannez simplement le <strong>QR Code (Onglet 1)</strong> avec votre smartphone et appuyez sur <strong>« Installer »</strong> dans Chrome. Votre téléphone se charge de tout créer nativement.
                </p>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleDownloadAndroidProject}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>Télécharger le guide de compilation Android Studio</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            TechDepan · Installation WebAPK Android & iOS
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
