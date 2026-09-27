import React, { useState } from 'react';
import { 
  Download, 
  Laptop, 
  Terminal, 
  Check, 
  Copy, 
  X, 
  FolderDown, 
  HardDrive, 
  ArrowRight, 
  PlayCircle,
  HelpCircle
} from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

interface ModalSaveDesktopProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalSaveDesktop: React.FC<ModalSaveDesktopProps> = ({ isOpen, onClose }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    cyberAudio.playClick();
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      num: '01',
      title: 'Exporter le projet depuis AI Studio',
      desc: "Dans l'interface de Google AI Studio (tout en haut à droite de l'écran), cliquez sur le bouton d'export ou l'icône de téléchargement (ou menu 'Export / Download ZIP'). Le fichier ZIP du projet complet sera téléchargé sur votre machine.",
      badge: 'Action dans le navigateur',
    },
    {
      num: '02',
      title: 'Placer et décompresser sur votre Bureau',
      desc: "Allez dans votre dossier 'Téléchargements', glissez le fichier ZIP sur votre Bureau (Desktop), puis faites un Clic Droit > 'Extraire tout...' (ou double-clic sur Mac).",
      badge: 'Sur votre Bureau',
    },
    {
      num: '03',
      title: 'Installer les dépendances',
      desc: "Ouvrez le dossier décompressé sur votre bureau dans un terminal (PowerShell, Invite de commandes ou Terminal Mac/Linux) et lancez l'installation :",
      code: 'npm install',
      badge: 'Terminal / CLI',
    },
    {
      num: '04',
      title: 'Démarrer le projet en local',
      desc: "Lancez le serveur local ultra-rapide Vite avec la commande suivante :",
      code: 'npm run dev',
      badge: 'Lancement Local',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0b101b] border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.25)] p-6 md:p-8 relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Corner HUD markers */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <HardDrive className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold font-hud uppercase tracking-wider text-white flex items-center gap-2">
                Enregistrer sur votre Bureau
              </h2>
              <p className="text-xs text-cyan-400/80 font-mono-code">
                PROTOCOLE DE CLONAGE & EXPORT LOCAL
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with scroll if needed */}
        <div className="my-5 overflow-y-auto pr-1 space-y-4 text-sm font-sans flex-1">
          {/* Quick Notice Banner */}
          <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-none flex items-start gap-3 text-xs text-cyan-200">
            <FolderDown className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider font-hud">Emplacement Bureau (Desktop) :</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                Ce projet est hébergé en ligne dans l'environnement Google AI Studio. Pour le garder sur votre bureau et pouvoir continuer à le modifier hors-ligne ou sur votre machine, suivez ces 4 étapes simples :
              </p>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((s, idx) => (
              <div 
                key={s.num}
                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors p-4 relative group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-hud font-bold text-cyan-400 px-1.5 py-0.5 bg-cyan-950/80 border border-cyan-800/80">
                      ÉTAPE {s.num}
                    </span>
                    <h3 className="font-bold text-white text-sm">{s.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-500 border border-slate-800 px-2 py-0.5">
                    {s.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pl-1">
                  {s.desc}
                </p>

                {s.code && (
                  <div className="mt-2.5 flex items-center justify-between bg-black/60 border border-cyan-900/50 p-2.5 rounded-none font-mono-code text-xs text-cyan-300">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      <span>{s.code}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(s.code!, idx)}
                      className="flex items-center gap-1 px-2 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 text-[11px] cursor-pointer transition-all active:scale-95"
                    >
                      {copiedStep === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Prerequisite Box */}
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Prérequis : Avoir installé <strong>Node.js</strong> (gratuit sur nodejs.org).</span>
            </div>
            <a 
              href="https://nodejs.org" 
              target="_blank" 
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline font-mono-code text-[11px] shrink-0"
            >
              nodejs.org ↗
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 font-mono-code flex items-center gap-1.5">
            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accès local après lancement : <strong className="text-cyan-300">http://localhost:3000</strong></span>
          </div>

          <button
            onClick={() => {
              cyberAudio.playChirp();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-hud font-bold text-xs uppercase tracking-wider cursor-pointer border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <span>J'ai compris</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
