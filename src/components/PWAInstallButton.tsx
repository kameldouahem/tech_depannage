import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
        title="Installer l'application sur votre appareil"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Installer PWA</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-200 px-3 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap"
          title="Installer sur iPhone ou iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          <span>Installer (iOS)</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  Installer sur iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 text-xs font-bold">1</span>
                  <span>Touchez le bouton <strong>Partager</strong> en bas de Safari.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 text-xs font-bold">2</span>
                  <span>Faites défiler et touchez <strong>Sur l'écran d'accueil</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 text-xs font-bold">3</span>
                  <span>Touchez <strong>Ajouter</strong> en haut à droite.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-semibold text-white transition"
              >
                J'ai compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
