import React, { useState } from 'react';
import { cyberAudio } from '../utils/cyberAudio';
import { CheckoutTerminal } from './CheckoutTerminal';
import {
  Zap,
  Shield,
  Gauge,
  Sparkles,
  Trophy,
  Check,
  Flame,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Cpu,
  Lock,
  Unlock,
  Radio,
  Eye,
  Crosshair,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  // Interactive tuning slider state: 0 to 100%
  const [tuningLevel, setTuningLevel] = useState<number>(35);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => cyberAudio.getMuted());
  const [activeCheckout, setActiveCheckout] = useState<{
    planName: string;
    price: string;
    duration: string;
    redirectUrl?: string;
  } | null>(null);

  // Vehicle dynamic stats based on slider
  const baseSpeed = 58;
  const maxBonusSpeed = 42;
  const currentSpeed = Math.min(100, Math.round(baseSpeed + (maxBonusSpeed * tuningLevel) / 100));

  const baseArmor = 40;
  const maxBonusArmor = 55;
  const currentArmor = Math.min(100, Math.round(baseArmor + (maxBonusArmor * tuningLevel) / 100));

  const isMaxTuning = tuningLevel >= 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setTuningLevel(val);

    if (val === 100) {
      cyberAudio.playFanfare();
    } else if (val % 15 === 0) {
      cyberAudio.playClick();
    }
  };

  const handlePlanSelect = (plan: string) => {
    cyberAudio.playChirp();
    if (plan === 'Street Kid') {
      if (onEnterApp) onEnterApp();
    } else if (plan === 'Edgerunner') {
      setActiveCheckout({
        planName: 'LICENCE EDGERUNNER',
        price: '4.99',
        duration: 'ACCÈS MENSUEL (30 JOURS)',
      });
    } else {
      setActiveCheckout({
        planName: 'LICENCE CORPO ACCESS (FONDATUR)',
        price: '29.00',
        duration: 'LIAISON PERMANENTE (À VIE)',
      });
    }
  };

  const toggleSound = () => {
    const muted = cyberAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP COMMERCIAL NAV CONTRACT                                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#090d16]/95 backdrop-blur-md border-b border-cyan-950/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Crosshair className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-hud font-bold text-lg tracking-wider text-white">
              GAMING COMPANION
            </span>
            <span className="text-[10px] font-mono-code text-cyan-400 block -mt-0.5 tracking-widest uppercase">
              SUITE LOGICIELLE TACTIQUE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="p-2 border border-slate-800 bg-[#070b14] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
            title={isAudioMuted ? 'Activer le son Cyberpunk' : 'Couper le son'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {onEnterApp && (
            <button
              onClick={() => {
                cyberAudio.playClick();
                onEnterApp();
              }}
              className="px-4 py-2 text-xs font-hud font-bold uppercase tracking-wider bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>ACCÉDER À L'APPLICATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION "LIVE TUNING" (LE HOOK INTERACTIF)                        */}
      {/* ========================================================================= */}
      <section className="relative px-4 sm:px-8 lg:px-12 pt-10 pb-16 max-w-7xl mx-auto w-full">
        {/* Hologram background atmosphere */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Aggressive Hook & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono-code text-cyan-400 tracking-widest uppercase">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-ping" />
              <span>TERMINAL TACTIQUE MILITAIRE · ACCÈS DÉBRIDÉ</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-hud font-bold text-white tracking-wide uppercase leading-[1.1]">
              Prenez le contrôle total de vos statistiques.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                Ne laissez plus aucun trophée au hasard.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-xl">
              Fini les allers-retours fastidieux sur les wikis et les cartes interactives lentes.
              Gaming Companion synchronise vos quêtes, vos collectibles cachés, votre garage et
              vos succès avec un temps de réponse instantané de 0ms et une cartographie radar 360°.
            </p>

            {/* Key benefits list with zero-pill discipline */}
            <div className="space-y-2 pt-2 border-t border-cyan-950/80 text-xs sm:text-sm font-mono-code text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Radar Lidar holographique 360° avec calcul de distance métrique</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Système de Trophées consoles & popups HUD instantanés</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>100% Hors-Ligne & Chiffrement local (Vos sauvegardes vous appartiennent)</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => {
                  cyberAudio.playTargetAcquired();
                  setActiveCheckout({
                    planName: 'LICENCE CORPO ACCESS (FONDATUR)',
                    price: '29.00',
                    duration: 'LIAISON PERMANENTE (À VIE)',
                  });
                }}
                className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>OBTENIR MON ACCÈS COMPLET</span>
              </button>

              {onEnterApp && (
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    onEnterApp();
                  }}
                  className="px-5 py-3.5 bg-[#0b1120] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-hud font-bold tracking-wider uppercase transition-colors cursor-pointer text-center"
                >
                  TESTER LA DÉMO LIVE
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono-code text-slate-400 pt-1">
              <span>★ 4.9/5 sur 2 400+ avis</span>
              <span>·</span>
              <span>Licence permanente sans abonnement caché</span>
            </div>
          </div>

          {/* Right Column: Interactive "Live Tuning" Hook Card */}
          <div className="lg:col-span-6">
            <div
              className={`relative bg-[#070c18] border-2 transition-all duration-300 p-5 sm:p-7 shadow-2xl ${
                isMaxTuning
                  ? 'border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.6)] animate-pulse'
                  : 'border-cyan-900/60 shadow-[0_0_20px_rgba(0,0,0,0.8)]'
              }`}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
              }}
            >
              {/* Corner tech accent */}
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-cyan-950/80 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-widest">
                    MODULE GARAGE ACTIF // EXPÉRIMENTATION
                  </span>
                  <h3 className="font-hud font-bold text-lg text-white mt-0.5">
                    QUADRA TURBO-R V-TECH
                  </h3>
                </div>
                <span className="text-xs font-mono-code px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 uppercase font-bold">
                  SPORT_CLASS
                </span>
              </div>

              {/* Dynamic Vehicle Telemetry Specs */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono-code mb-1">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      Vitesse Max (Overclocking)
                    </span>
                    <span className="text-cyan-400 font-bold text-sm">{currentSpeed} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-150 shadow-[0_0_10px_#06b6d4]"
                      style={{ width: `${currentSpeed}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-mono-code mb-1">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      Blindage Céramique Renforcé
                    </span>
                    <span className="text-emerald-400 font-bold text-sm">{currentArmor} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-150 shadow-[0_0_10px_#34d399]"
                      style={{ width: `${currentArmor}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* The Interactive Slider */}
              <div className="bg-[#050811] p-4 border border-slate-800/90 space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="tuning-slider"
                    className="text-xs font-hud font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span>Installer la mise à niveau légendaire</span>
                  </label>
                  <span className="text-xs font-mono-code text-white font-bold">
                    {tuningLevel}%
                  </span>
                </div>

                <input
                  id="tuning-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={tuningLevel}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-slate-800 accent-cyan-400 cursor-pointer appearance-none outline-none"
                />

                <div className="flex justify-between text-[10px] font-mono-code text-slate-500">
                  <span>Moteur de série</span>
                  <span className="text-cyan-400">Glissez vers 100% pour déverrouiller</span>
                  <span>Puissance maximale</span>
                </div>
              </div>

              {/* Trigger / Buy CTA based on slider state */}
              {isMaxTuning ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      cyberAudio.playTargetAcquired();
                      setActiveCheckout({
                        planName: 'LICENCE CORPO ACCESS (OVERCLOCK 100%)',
                        price: '29.00',
                        duration: 'LIAISON PERMANENTE (À VIE)',
                      });
                    }}
                    className="w-full py-4 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 font-hud font-bold text-base tracking-widest uppercase shadow-[0_0_35px_rgba(6,182,212,0.9)] flex items-center justify-center gap-2 transition-all cursor-pointer animate-pulse"
                  >
                    <Unlock className="w-5 h-5 fill-current" />
                    <span>DÉBLOQUER L'ACCÈS COMPLET MAINTENANT</span>
                  </button>
                  <p className="text-center text-[10px] font-mono-code text-cyan-300 uppercase tracking-widest">
                    OVERCLOCK RÉUSSI · OFFRE DE LANCEMENT DÉVERROUILLÉE
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-[#03060c] border border-dashed border-slate-800 flex items-center justify-between text-xs font-mono-code text-slate-400">
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    Accès complet verrouillé à {tuningLevel}%
                  </span>
                  <span className="text-cyan-400">Poussez la jauge à 100% →</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PREUVE SOCIALE "SHADOW NETWORK" (MARQUEE TERMINAL EN DIRECT)           */}
      {/* ========================================================================= */}
      <div className="bg-[#050912] border-y border-cyan-950/80 py-3 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee gap-8 text-xs font-mono-code text-cyan-400/90">
          <span>SYS.LOG: Agent_V vient d'atteindre les 100% //</span>
          <span className="text-amber-400 font-bold">1 402 Netrunners synchronisés aujourd'hui //</span>
          <span>Upload des coordonnées terminé //</span>
          <span className="text-emerald-400">Fixer_Dakota: 'Gain de 40 heures sur mon run 100%' //</span>
          <span>Serveurs 0ms opérationnels //</span>
          <span className="text-cyan-300">Succès Platine débloqué: 'Légende de Night City' //</span>
          <span>Téléchargement PWA natif Android &amp; PC validé //</span>
          <span>Chiffrement AES-256 local actif //</span>
          <span>SYS.LOG: Agent_V vient d'atteindre les 100% //</span>
          <span className="text-amber-400 font-bold">1 402 Netrunners synchronisés aujourd'hui //</span>
          <span>Upload des coordonnées terminé //</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TARIFICATION "BLACK MARKET" AVEC RARETÉ (PRICING)                       */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs font-mono-code text-cyan-400 uppercase tracking-widest font-bold">
            TARIFS DU MARCHÉ NOIR · INVESTISSEMENT UNIQUE
          </div>
          <h2 className="text-3xl sm:text-4xl font-hud font-bold text-white uppercase tracking-wide">
            CHOISISSEZ VOTRE NIVEAU D'ACCRÉDITATION
          </h2>
          <p className="text-sm text-slate-400 font-sans">
            Aucun abonnement piège. Un paiement direct pour un terminal tactique indestructible.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Street Kid */}
          <div className="bg-[#070b14] border border-slate-800 p-6 flex flex-col justify-between transition-all hover:border-slate-700">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono-code text-slate-500 uppercase tracking-widest">
                  NIVEAU 1
                </span>
                <h3 className="font-hud font-bold text-xl text-white mt-0.5">STREET KID</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Pour tester l'interface sur les premières missions et découvrir l'ergonomie.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-bold font-mono-code text-white">0 €</span>
                <span className="text-xs font-mono-code text-slate-500 ml-2">Accès gratuit</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-xs text-slate-300 font-mono-code">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-500" />
                  <span>Jusqu'à 5 missions enregistrées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-500" />
                  <span>10 collectibles de base</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bloc-notes tactique standard</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 line-through">
                  <span>Radar Holo 360° désactivé</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 line-through">
                  <span>Toasts de succès consoles</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handlePlanSelect('Street Kid');
                if (onEnterApp) onEnterApp();
              }}
              className="mt-8 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-hud text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              COMMENCER GRATUITEMENT
            </button>
          </div>

          {/* Card 2: Edgerunner */}
          <div className="bg-[#090f1e] border border-cyan-900/60 p-6 flex flex-col justify-between transition-all hover:border-cyan-500/50">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest">
                  NIVEAU 2 · MENSUEL
                </span>
                <h3 className="font-hud font-bold text-xl text-white mt-0.5">EDGERUNNER</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Accès complet flexible pour les joueurs qui terminent un jeu en 1 à 2 mois.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-bold font-mono-code text-cyan-300">4,99 €</span>
                <span className="text-xs font-mono-code text-slate-400 ml-1">/ mois</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300 font-mono-code">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Missions illimitées &amp; filtres</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tous les collectibles &amp; GPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Garage complet &amp; tuning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Alertes HUD Platine / Or</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Radar Holographique 360°</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePlanSelect('Edgerunner')}
              className="mt-8 w-full py-2.5 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/50 font-hud text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              SOUSCRIRE (4,99 €)
            </button>
          </div>

          {/* Card 3: Corpo Access (Le Choix Recommandé avec Rareté & Glow Intense) */}
          <div
            className="relative bg-[#061122] border-2 border-cyan-400 p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.7)]"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
            }}
          >
            {/* Top Badge */}
            <div className="absolute top-0 right-0 bg-cyan-400 text-slate-950 text-[9px] font-mono-code font-bold px-2 py-0.5 uppercase tracking-widest">
              OFFRE FONDATUR LIMITÉE
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono-code text-amber-400 uppercase tracking-widest font-bold">
                  NIVEAU ÉLITE · LE CHOIX RECOMMANDÉ
                </span>
                <h3 className="font-hud font-bold text-2xl text-white mt-0.5">
                  CORPO ACCESS (À VIE)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Licence définitive pour tous vos jeux actuels et futurs. Zéro récurrence.
                </p>
              </div>

              {/* Price comparison */}
              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono-code text-cyan-300">29 €</span>
                <span className="text-sm font-mono-code text-slate-500 line-through">79 €</span>
                <span className="text-xs font-mono-code text-emerald-400 uppercase font-bold">
                  (-63%)
                </span>
              </div>

              {/* Rareté & Déclencheur d'urgence */}
              <div className="bg-[#140808] border border-rose-600/50 p-3 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono-code uppercase font-bold">
                  <span className="text-rose-400 animate-pulse flex items-center gap-1">
                    <Flame className="w-3 h-3 text-rose-500" />
                    Plus que 4 licences fondateurs disponibles
                  </span>
                  <span className="text-rose-300">88% VENDUES</span>
                </div>
                <div className="w-full bg-slate-950 h-2 overflow-hidden border border-rose-950">
                  <div className="h-full bg-rose-500 w-[88%] shadow-[0_0_10px_#f43f5e]" />
                </div>
              </div>

              {/* Full Features */}
              <div className="space-y-2.5 pt-2 text-xs text-slate-200 font-mono-code">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 font-bold" />
                  <span className="font-semibold text-white">Accès à vie sans abonnement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Tous les univers de jeu (Cyberpunk, Elden Ring, GTA VI...)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Radar Holo 360° &amp; Moteur Audio Cyberpunk</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Sauvegardes chiffrées &amp; Export JSON illimité</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Mode Deck Streamer pour 2ème écran</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Mises à jour majeures futures incluses</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePlanSelect('Corpo Access')}
              className="mt-8 w-full py-4 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-hud font-bold text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all cursor-pointer"
            >
              RÉSERVER MA LICENCE À VIE (29 €)
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ARASAKA / CYBERPUNK CHECKOUT TERMINAL MODAL                            */}
      {/* ========================================================================= */}
      {activeCheckout && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md">
          <CheckoutTerminal
            planName={activeCheckout.planName}
            price={activeCheckout.price}
            duration={activeCheckout.duration}
            redirectUrl={activeCheckout.redirectUrl}
            onClose={() => setActiveCheckout(null)}
            onSuccess={() => {
              setActiveCheckout(null);
              if (onEnterApp) onEnterApp();
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MINIMAL COMMERCIAL FOOTER                                             */}
      {/* ========================================================================= */}
      <footer className="border-t border-cyan-950/80 bg-[#070b14] py-8 px-4 sm:px-8 mt-auto text-center text-xs font-mono-code text-slate-500 space-y-2">
        <p>© 2026 GAMING COMPANION · TOUS DROITS RÉSERVÉS · ACCÈS TACTIQUE MILITAIRE</p>
        <p className="text-[11px] text-slate-600">
          Chiffrement local · Zéro collecte de données personnelles · Compatible PC, Mac, Steam Deck, Android &amp; iOS
        </p>
      </footer>
    </div>
  );
};
