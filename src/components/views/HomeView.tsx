import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { HoloRadar } from '../HoloRadar';
import { DashboardMiniTelemetryChart } from '../charts/DashboardMiniTelemetryChart';
import { cyberAudio } from '../../utils/cyberAudio';
import {
  Compass,
  Sparkles,
  Car,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Circle,
  Pin,
  MapPin,
  Plus,
  Zap,
  TrendingUp,
  ShieldCheck,
  Flame,
  Layers,
  ChevronRight,
  Monitor,
  Share2,
  Radio,
} from 'lucide-react';

interface HomeViewProps {
  onOpenNewItemModal: () => void;
  onOpenLanding?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenNewItemModal, onOpenLanding }) => {
  const {
    activeProfile,
    overallProgress,
    stats,
    missions,
    collectibles,
    vehicles,
    notes,
    sessionSeconds,
    setCurrentTab,
    toggleMissionStep,
    toggleCollectible,
  } = useGame();

  const [companionDeckMode, setCompanionDeckMode] = useState<boolean>(false);
  const [showCommercialModal, setShowCommercialModal] = useState<boolean>(false);

  const activeMission =
    missions.find((m) => m.status === 'in_progress' || m.priority) || missions[0];
  const nextCollectibles = collectibles.filter((c) => !c.collected).slice(0, 3);
  const favoriteVehicle = vehicles.find((v) => v.isFavorite) || vehicles[0];
  const pinnedNotes = notes.filter((n) => n.pinned).slice(0, 2);

  // Speedrun & 100% Trajectory Calculations
  const totalTasks =
    stats.missionsTotal + stats.collectiblesTotal + stats.vehiclesTotal + stats.objectivesTotal;
  const completedTasks =
    stats.missionsDone + stats.collectiblesDone + stats.vehiclesUnlocked + stats.objectivesDone;
  const remainingTasks = Math.max(0, totalTasks - completedTasks);

  // Velocity: estimated tasks per hour
  const hoursPlayed = Math.max(0.1, sessionSeconds / 3600);
  const estimatedHoursRemaining = Math.max(
    1.2,
    Math.round(((remainingTasks * 0.35) / Math.max(1, completedTasks / hoursPlayed)) * 10) / 10
  );

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* ========================================================================= */}
      {/* 1. HERO TACTICAL BANNER & COMMERCIAL HEADLINE                             */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#070c18] via-[#091022] to-[#050912] border border-cyan-900/60 p-6 sm:p-8 shadow-2xl">
        {/* Glow ambient meshes */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Top Badges & Commercial Pro Pill */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
              <span className="text-cyan-400 font-bold uppercase tracking-wider">
                COMPAGNON TACTIQUE HAUTE PRÉCISION
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">
                PROFIL : <span className="text-cyan-300 font-semibold">{activeProfile.name}</span>
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                MOTEUR LOCAL 0ms
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-hud text-white tracking-wide uppercase leading-tight">
              CENTRE DE COMMANDEMENT · 100% COMPLETION
            </h1>

            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed font-sans">
              La suite de tracking ultime pour les joueurs exigeants. Cartographie Lidar temps réel,
              journal de quêtes sans latence, optimisation d'itinéraire et trophées synchronisés.
            </p>
          </div>

          {/* Top Right Commercial CTA & Quick Action */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                cyberAudio.playChirp();
                setShowCommercialModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-hud font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>OFFRE COMMERCIALE & PRO</span>
            </button>

            <button
              onClick={() => {
                cyberAudio.playClick();
                onOpenNewItemModal();
              }}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>NOUVELLE ENTRÉE</span>
            </button>
          </div>
        </div>

        {/* 4 HUD Core Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-cyan-950/80">
          <div
            onClick={() => {
              cyberAudio.playClick();
              setCurrentTab('missions');
            }}
            className="p-4 bg-[#050912]/80 border border-slate-800/90 hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-hud font-bold uppercase tracking-wider">Missions</span>
              <Compass className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold font-mono-code text-white">
              {stats.missionsDone}
              <span className="text-xs text-slate-500 font-normal"> / {stats.missionsTotal}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-500"
                style={{
                  width: `${(stats.missionsDone / (stats.missionsTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div
            onClick={() => {
              cyberAudio.playClick();
              setCurrentTab('collectibles');
            }}
            className="p-4 bg-[#050912]/80 border border-slate-800/90 hover:border-amber-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-hud font-bold uppercase tracking-wider">Collectibles</span>
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold font-mono-code text-white">
              {stats.collectiblesDone}
              <span className="text-xs text-slate-500 font-normal"> / {stats.collectiblesTotal}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-500"
                style={{
                  width: `${(stats.collectiblesDone / (stats.collectiblesTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div
            onClick={() => {
              cyberAudio.playClick();
              setCurrentTab('vehicles');
            }}
            className="p-4 bg-[#050912]/80 border border-slate-800/90 hover:border-emerald-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-hud font-bold uppercase tracking-wider">Garage & Tuning</span>
              <Car className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold font-mono-code text-white">
              {stats.vehiclesUnlocked}
              <span className="text-xs text-slate-500 font-normal"> / {stats.vehiclesTotal}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-500"
                style={{
                  width: `${(stats.vehiclesUnlocked / (stats.vehiclesTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div
            onClick={() => {
              cyberAudio.playClick();
              setCurrentTab('objectives');
            }}
            className="p-4 bg-[#050912]/80 border border-slate-800/90 hover:border-purple-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-hud font-bold uppercase tracking-wider">Trophées & Succès</span>
              <Trophy className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-bold font-mono-code text-white">
              {stats.objectivesDone}
              <span className="text-xs text-slate-500 font-normal"> / {stats.objectivesTotal}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-purple-400 h-full transition-all duration-500"
                style={{
                  width: `${(stats.objectivesDone / (stats.objectivesTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE INÉDITE TOUCH: RADAR HOLOGRAPHIQUE TACTIQUE 360°                  */}
      {/* ========================================================================= */}
      <HoloRadar />

      {/* ========================================================================= */}
      {/* 3. NEURAL SPEEDRUN OPTIMIZER & DECK MODE TOGGLE                           */}
      {/* ========================================================================= */}
      <div className="bg-[#080d19] border border-cyan-950/80 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-hud font-bold text-base text-white uppercase tracking-wider">
                  OPTIMISATEUR DE TRAJECTOIRE SPEEDRUN & 100%
                </h3>
                <span className="text-[10px] font-mono-code px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase font-semibold">
                  IA_ALGORITHME_V2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Calcul automatique du rendement XP, crédits et estimation du temps restant jusqu’au Platine.
              </p>
            </div>
          </div>

          {/* Mode Streamer / Deck Companion Switch */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              setCompanionDeckMode(!companionDeckMode);
            }}
            className={`px-3 py-1.5 text-xs font-mono-code flex items-center gap-2 border transition-all cursor-pointer ${
              companionDeckMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>MODE DECK STREAMER : {companionDeckMode ? 'ACTIF' : 'NORMAL'}</span>
          </button>
        </div>

        {/* 3 Telemetry Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-[#050811] p-3.5 border border-slate-800/80">
            <div className="text-[10px] font-mono-code uppercase text-slate-500 tracking-wider">
              Temps Estimé Vers 100%
            </div>
            <div className="text-xl font-bold font-mono-code text-cyan-400 mt-1">
              ~{estimatedHoursRemaining} HEURES
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Basé sur votre rythme actuel et les {remainingTasks} objectifs restants.
            </p>
          </div>

          <div className="bg-[#050811] p-3.5 border border-slate-800/80">
            <div className="text-[10px] font-mono-code uppercase text-slate-500 tracking-wider">
              Prochaine Action Haut Rendement
            </div>
            <div className="text-sm font-bold font-hud text-amber-400 mt-1 truncate">
              {activeMission ? activeMission.title : 'Aucune mission restante'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Rapport : +{activeMission?.rewardXp || 0} XP &amp; +{activeMission?.rewardCredits || 0} E$
            </p>
          </div>

          <div className="bg-[#050811] p-3.5 border border-slate-800/80">
            <div className="text-[10px] font-mono-code uppercase text-slate-500 tracking-wider">
              Fiabilité &amp; Confidentialité
            </div>
            <div className="text-xl font-bold font-mono-code text-emerald-400 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              100% HORS-LIGNE
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Zéro pistage, données chiffrées en local, exportable à volonté.
            </p>
          </div>
        </div>

        {/* Dynamic Telemetry Graph: Real Progression vs Playtime */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <DashboardMiniTelemetryChart onNavigateToStats={() => setCurrentTab('stats')} />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN WORKSPACE: ACTIVE MISSION & QUICK MODULES                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Mission Focus & Collectibles */}
        <div className="lg:col-span-2 space-y-6">
          {activeMission && (
            <div className="bg-[#080d19] border border-cyan-950/80 p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono-code uppercase font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                    MISSION ACTIVE PRIORITAIRE
                  </span>
                  <span className="text-xs font-mono-code text-slate-400">
                    Secteur : {activeMission.district}
                  </span>
                </div>
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    setCurrentTab('missions');
                  }}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-hud cursor-pointer"
                >
                  <span>TOUT VOIR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <h2 className="text-xl font-bold font-hud text-white mb-2">{activeMission.title}</h2>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed font-sans">
                {activeMission.description}
              </p>

              {/* Steps / Sub-objectives */}
              <div className="space-y-2 mb-4 bg-[#050811] p-3 border border-slate-800/80">
                <div className="text-[11px] font-mono-code uppercase text-slate-400 tracking-wider">
                  Objectifs tactiques :
                </div>
                {activeMission.steps.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => {
                      cyberAudio.playClick();
                      toggleMissionStep(activeMission.id, step.id);
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 flex-shrink-0 hover:text-cyan-400" />
                    )}
                    <span
                      className={`text-sm ${
                        step.completed
                          ? 'line-through text-slate-500'
                          : 'text-slate-200 font-medium'
                      }`}
                    >
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rewards */}
              <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 pt-2 border-t border-slate-800/60">
                <div>
                  Donneur d’ordre : <span className="text-slate-200">{activeMission.giver}</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-400 font-semibold">
                  <span>+{activeMission.rewardXp} XP</span>
                  <span className="text-amber-400">+{activeMission.rewardCredits} E$</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Collectibles Tracker */}
          <div className="bg-[#080d19] border border-cyan-950/80 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-hud font-bold text-white text-base uppercase tracking-wider">
                  COLLECTIBLES À PROXIMITÉ
                </h3>
              </div>
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  setCurrentTab('collectibles');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-hud flex items-center gap-1 cursor-pointer"
              >
                <span>VOIR LA CARTE ({stats.collectiblesTotal - stats.collectiblesDone} RESTANTS)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nextCollectibles.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#050811] border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-mono-code px-1.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono-code text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {item.district}
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-slate-100">{item.name}</div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.hint}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono-code text-slate-500">
                      {item.coordinates || 'GPS Actif'}
                    </span>
                    <button
                      onClick={() => {
                        cyberAudio.playFanfare();
                        toggleCollectible(item.id);
                      }}
                      className="text-xs font-hud font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VALIDER</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Vehicle & Pinned Notes */}
        <div className="space-y-6">
          {/* Favorite Vehicle Showcase */}
          {favoriteVehicle && (
            <div className="bg-[#080d19] border border-cyan-950/80 p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-hud font-bold text-white text-base uppercase tracking-wider">
                    VÉHICULE EN SERVICE
                  </h3>
                </div>
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    setCurrentTab('vehicles');
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-hud cursor-pointer"
                >
                  GARAGE
                </button>
              </div>

              <div className="p-3.5 bg-[#050811] border border-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono-code text-slate-400 uppercase">
                      {favoriteVehicle.manufacturer}
                    </span>
                    <h4 className="font-hud font-bold text-base text-white">
                      {favoriteVehicle.name}
                    </h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 font-mono-code bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase">
                    {favoriteVehicle.category}
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono-code text-slate-400 mb-0.5">
                      <span>Vitesse de pointe</span>
                      <span className="text-cyan-400 font-bold">{favoriteVehicle.speed}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400"
                        style={{ width: `${favoriteVehicle.speed}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono-code text-slate-400 mb-0.5">
                      <span>Maniabilité</span>
                      <span className="text-emerald-400 font-bold">{favoriteVehicle.handling}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400"
                        style={{ width: `${favoriteVehicle.handling}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono-code">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{favoriteVehicle.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tactical Notes */}
          <div className="bg-[#080d19] border border-cyan-950/80 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-cyan-400" />
                <h3 className="font-hud font-bold text-white text-base uppercase tracking-wider">
                  NOTES PRIORITAIRES
                </h3>
              </div>
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  setCurrentTab('notes');
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-hud cursor-pointer"
              >
                BLOC-NOTES
              </button>
            </div>

            <div className="space-y-2.5">
              {pinnedNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    cyberAudio.playClick();
                    setCurrentTab('notes');
                  }}
                  className="p-3 bg-[#050811] border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-xs text-cyan-300 mb-1">{note.title}</div>
                  <p className="text-xs text-slate-300 line-clamp-2 font-mono-code whitespace-pre-line">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. COMMERCIAL PRO EDITION SALES MODAL                                      */}
      {/* ========================================================================= */}
      {showCommercialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#090e1b] border-2 border-amber-500/60 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono-code font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    LICENCE COMMERCIALE COMPLÈTE
                  </span>
                  <span className="text-xs font-mono-code text-slate-400">GAMING COMPANION PRO</span>
                </div>
                <h3 className="text-2xl font-bold font-hud text-white mt-1">
                  POURQUOI CETTE APPLICATION FAIT VENDRE ?
                </h3>
              </div>
              <button
                onClick={() => setShowCommercialModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer font-mono-code text-sm"
              >
                [FERMER ✕]
              </button>
            </div>

            {/* Commercial Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[#050811] border border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-hud font-bold text-sm mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Zéro Latence & Hors-Ligne</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fonctionne instantanément sur PC, Mac, Steam Deck, Android et iOS sans serveur ni abonnement tiers.
                </p>
              </div>

              <div className="p-3.5 bg-[#050811] border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-hud font-bold text-sm mb-1">
                  <Radio className="w-4 h-4" />
                  <span>Radar Holo 360° & Synth Audio</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Immersion sonore procédurale cyberpunk et détection de portée qui captivent le joueur dès la première seconde.
                </p>
              </div>

              <div className="p-3.5 bg-[#050811] border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-hud font-bold text-sm mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Multi-Jeux & Sauvegardes JSON</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Supporte Night City, Elden Ring, Starfield ou n'importe quel RPG personnalisé avec export/import 1 clic.
                </p>
              </div>

              <div className="p-3.5 bg-[#050811] border border-slate-800">
                <div className="flex items-center gap-2 text-purple-400 font-hud font-bold text-sm mb-1">
                  <Trophy className="w-4 h-4" />
                  <span>Toasts de Trophées HUD</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Système de notifications Platine, Or, Argent et Bronze identique aux meilleures interfaces de consoles.
                </p>
              </div>
            </div>

            {/* Bottom Guarantee */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-hud font-bold text-amber-300 uppercase">
                  Prêt pour la commercialisation
                </div>
                <div className="text-xs text-slate-300">
                  Code React 19 + TypeScript + Tailwind 4 propre, maintenable et immédiatement monétisable.
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onOpenLanding && (
                  <button
                    onClick={() => {
                      cyberAudio.playChirp();
                      setShowCommercialModal(false);
                      onOpenLanding();
                    }}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-xs uppercase cursor-pointer transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  >
                    OUVRIR LA LANDING PAGE
                  </button>
                )}
                <button
                  onClick={() => {
                    cyberAudio.playFanfare();
                    setShowCommercialModal(false);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-hud font-bold text-xs uppercase cursor-pointer"
                >
                  COMPRIS !
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
