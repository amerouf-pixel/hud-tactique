import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { cyberAudio } from '../utils/cyberAudio';
import {
  Compass,
  Crosshair,
  Volume2,
  VolumeX,
  Sparkles,
  Car,
  MapPin,
  CheckCircle2,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface RadarTarget {
  id: string;
  type: 'mission' | 'collectible' | 'vehicle';
  title: string;
  subtitle: string;
  district: string;
  x: number; // percentage -50 to 50 relative to radar center
  y: number; // percentage -50 to 50 relative to radar center
  distanceMeters: number;
  statusText: string;
  extraInfo?: string;
  isPriority?: boolean;
}

export const HoloRadar: React.FC = () => {
  const {
    missions,
    collectibles,
    vehicles,
    setCurrentTab,
    toggleMissionStep,
    toggleCollectible,
  } = useGame();

  const [activeFilter, setActiveFilter] = useState<'all' | 'missions' | 'collectibles' | 'vehicles'>('all');
  const [selectedTarget, setSelectedTarget] = useState<RadarTarget | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => cyberAudio.getMuted());
  const [radarZoom, setRadarZoom] = useState<'1x' | '2x'>('1x');

  // Generate realistic tactical coordinates on the radar from active game items
  const targets: RadarTarget[] = useMemo(() => {
    const list: RadarTarget[] = [];

    // Missions
    missions.slice(0, 4).forEach((m, idx) => {
      const angles = [45, 140, 230, 310];
      const rad = (angles[idx % angles.length] * Math.PI) / 180;
      const dist = 28 + (idx * 8); // radius %
      list.push({
        id: m.id,
        type: 'mission',
        title: m.title,
        subtitle: m.giver,
        district: m.district,
        x: Math.cos(rad) * dist,
        y: Math.sin(rad) * dist,
        distanceMeters: 280 + idx * 340,
        statusText: m.status === 'in_progress' ? 'EN COURS' : 'DISPONIBLE',
        extraInfo: `+${m.rewardXp} XP · +${m.rewardCredits} E$`,
        isPriority: m.priority,
      });
    });

    // Unfound collectibles
    collectibles
      .filter((c) => !c.collected)
      .slice(0, 5)
      .forEach((c, idx) => {
        const angles = [85, 175, 260, 350, 115];
        const rad = (angles[idx % angles.length] * Math.PI) / 180;
        const dist = 18 + (idx * 6);
        list.push({
          id: c.id,
          type: 'collectible',
          title: c.name,
          subtitle: c.category.toUpperCase(),
          district: c.district,
          x: Math.cos(rad) * dist,
          y: Math.sin(rad) * dist,
          distanceMeters: 140 + idx * 180,
          statusText: 'NON DÉCOUVERT',
          extraInfo: c.hint,
        });
      });

    // Vehicles
    vehicles.slice(0, 3).forEach((v, idx) => {
      const angles = [195, 290, 25];
      const rad = (angles[idx % angles.length] * Math.PI) / 180;
      const dist = 36 + (idx * 4);
      list.push({
        id: v.id,
        type: 'vehicle',
        title: v.name,
        subtitle: v.manufacturer,
        district: v.location,
        x: Math.cos(rad) * dist,
        y: Math.sin(rad) * dist,
        distanceMeters: 450 + idx * 520,
        statusText: v.unlocked ? 'DÉVERROUILLÉ' : 'VERROUILLÉ',
        extraInfo: `Vitesse ${v.speed} · Maniabilité ${v.handling}`,
      });
    });

    return list;
  }, [missions, collectibles, vehicles]);

  const filteredTargets = useMemo(() => {
    if (activeFilter === 'all') return targets;
    if (activeFilter === 'missions') return targets.filter((t) => t.type === 'mission');
    if (activeFilter === 'collectibles') return targets.filter((t) => t.type === 'collectible');
    return targets.filter((t) => t.type === 'vehicle');
  }, [targets, activeFilter]);

  const handleSelectTarget = (target: RadarTarget) => {
    cyberAudio.playTargetAcquired();
    setSelectedTarget(target);
  };

  const handleToggleMute = () => {
    const next = cyberAudio.toggleMute();
    setIsMuted(next);
  };

  const zoomFactor = radarZoom === '2x' ? 1.4 : 1;

  return (
    <div className="relative overflow-hidden bg-[#070b14] border border-cyan-950/90 rounded-2xl p-4 sm:p-6 shadow-2xl">
      {/* Decorative Top HUD Corner Coordinates */}
      <div className="flex items-center justify-between border-b border-cyan-950/70 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-hud font-bold text-base sm:text-lg text-white tracking-wider">
                RADAR HOLOGRAPHIQUE TACTIQUE 360°
              </h2>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono-code bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase font-semibold">
                LIDAR_ACTIF
              </span>
            </div>
            <p className="text-[11px] font-mono-code text-slate-400">
              Balayage télémétrique du secteur · Portée {radarZoom === '2x' ? '500m' : '1500m'}
            </p>
          </div>
        </div>

        {/* HUD Quick Audio & Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              cyberAudio.playClick();
              setRadarZoom((prev) => (prev === '1x' ? '2x' : '1x'));
            }}
            className="px-2.5 py-1 text-[11px] font-mono-code border border-cyan-950 bg-slate-900/80 text-cyan-400 hover:border-cyan-500/50 cursor-pointer transition-colors"
            title="Ajuster la portée du radar"
          >
            ZOOM {radarZoom}
          </button>

          <button
            onClick={handleToggleMute}
            className={`p-1.5 border transition-colors cursor-pointer ${
              isMuted
                ? 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300'
                : 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
            }`}
            title={isMuted ? 'Activer le son Cyberpunk' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Screen on Left/Center + Tactical Target Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Viewport (7 Cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {/* Radar Disc Container */}
          <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full border-2 border-cyan-500/30 bg-[#040810] shadow-[0_0_50px_rgba(6,182,212,0.15)] flex items-center justify-center select-none overflow-hidden">
            {/* Concentric Range Rings */}
            <div className="absolute w-[75%] h-[75%] rounded-full border border-cyan-500/20" />
            <div className="absolute w-[50%] h-[50%] rounded-full border border-cyan-500/25 border-dashed" />
            <div className="absolute w-[25%] h-[25%] rounded-full border border-cyan-500/20" />

            {/* Crosshair Axes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-cyan-500/20" />
              <div className="h-full w-[1px] bg-cyan-500/20 absolute" />
            </div>

            {/* Azimuth Angle Marks */}
            <span className="absolute top-2 text-[9px] font-mono-code text-cyan-400/80 font-bold">N 000°</span>
            <span className="absolute bottom-2 text-[9px] font-mono-code text-cyan-400/60 font-bold">S 180°</span>
            <span className="absolute right-2 text-[9px] font-mono-code text-cyan-400/60 font-bold">E 090°</span>
            <span className="absolute left-2 text-[9px] font-mono-code text-cyan-400/60 font-bold">O 270°</span>

            {/* Rotating Radar Sweep Beam */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none animate-[spin_5s_linear_infinite]"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(6, 182, 212, 0.4) 0deg, rgba(6, 182, 212, 0.08) 45deg, transparent 75deg)',
              }}
            />

            {/* Center Player Beacon */}
            <div className="relative z-10 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_12px_#06b6d4] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-cyan-400 animate-ping opacity-75" />
            </div>

            {/* Interactive Target Blips */}
            {filteredTargets.map((target) => {
              const isSelected = selectedTarget?.id === target.id;
              const posX = target.x * zoomFactor;
              const posY = target.y * zoomFactor;

              // Color configs by type
              let colorClasses = 'bg-cyan-400 text-cyan-300 shadow-[0_0_8px_#06b6d4]';
              if (target.type === 'collectible') {
                colorClasses = 'bg-amber-400 text-amber-300 shadow-[0_0_8px_#fbbf24]';
              } else if (target.type === 'vehicle') {
                colorClasses = 'bg-emerald-400 text-emerald-300 shadow-[0_0_8px_#34d399]';
              }

              return (
                <button
                  key={target.id}
                  onClick={() => handleSelectTarget(target)}
                  aria-label={`Cible : ${target.title}`}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 cursor-pointer group z-20 ${
                    isSelected ? 'scale-150 z-30' : 'hover:scale-125'
                  }`}
                  style={{
                    left: `calc(50% + ${posX}%)`,
                    top: `calc(50% + ${posY}%)`,
                  }}
                >
                  <div className={`w-2.5 h-2.5 rounded-sm ${colorClasses} relative`}>
                    {/* Ring highlight when selected */}
                    {isSelected && (
                      <div className="absolute -inset-1.5 border border-cyan-300 animate-pulse pointer-events-none" />
                    )}
                  </div>

                  {/* Micro label */}
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[8px] font-mono-code text-slate-300 bg-black/80 px-1 py-0.2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700">
                    {target.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter Toolbar beneath radar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
            {(
              [
                { id: 'all', label: 'TOUT SCANNER' },
                { id: 'missions', label: 'MISSIONS' },
                { id: 'collectibles', label: 'SECRETS' },
                { id: 'vehicles', label: 'GARAGE' },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  cyberAudio.playClick();
                  setActiveFilter(filter.id);
                }}
                className={`px-3 py-1 text-[11px] font-mono-code cursor-pointer transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Active Target Telemetry HUD (5 Cols on desktop) */}
        <div className="lg:col-span-5 bg-[#0a101d] border border-cyan-950/80 p-4 sm:p-5 flex flex-col justify-between min-h-[300px] shadow-lg">
          {selectedTarget ? (
            <div className="space-y-4">
              {/* Header Dossier */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest font-bold">
                    SIGNAL LOCALISÉ · {selectedTarget.type.toUpperCase()}
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-slate-400">
                  {selectedTarget.distanceMeters}m
                </span>
              </div>

              {/* Title & Category */}
              <div>
                <span className="text-[11px] font-mono-code text-slate-400 uppercase">
                  {selectedTarget.subtitle}
                </span>
                <h3 className="font-hud font-bold text-lg text-white mt-0.5">
                  {selectedTarget.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{selectedTarget.district}</span>
                </div>
              </div>

              {/* Status and Telemetry Details */}
              <div className="bg-[#050811] p-3 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono-code">
                  <span className="text-slate-500">Statut :</span>
                  <span className="text-cyan-300 font-bold">{selectedTarget.statusText}</span>
                </div>
                {selectedTarget.extraInfo && (
                  <div className="text-xs text-slate-300 font-sans border-t border-slate-800/80 pt-1.5 leading-relaxed">
                    {selectedTarget.extraInfo}
                  </div>
                )}
              </div>

              {/* Quick Tactical Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                {selectedTarget.type === 'mission' && (
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setCurrentTab('missions');
                    }}
                    className="flex-1 px-3 py-2 text-xs font-hud font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <span>ENGAGER LA MISSION</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                {selectedTarget.type === 'collectible' && (
                  <button
                    onClick={() => {
                      cyberAudio.playFanfare();
                      toggleCollectible(selectedTarget.id);
                      setSelectedTarget(null);
                    }}
                    className="flex-1 px-3 py-2 text-xs font-hud font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MARQUER RÉCUPÉRÉ</span>
                  </button>
                )}

                {selectedTarget.type === 'vehicle' && (
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setCurrentTab('vehicles');
                    }}
                    className="flex-1 px-3 py-2 text-xs font-hud font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Car className="w-4 h-4" />
                    <span>OUVRIR LE GARAGE</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto">
              <div className="w-12 h-12 rounded-full border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center text-cyan-400">
                <Crosshair className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-hud font-bold text-white text-sm">
                AUCUNE CIBLE SÉLECTIONNÉE
              </h4>
              <p className="text-xs text-slate-400 max-w-xs font-mono-code leading-relaxed">
                Cliquez sur un marqueur lumineux sur le radar 360° pour verrouiller ses coordonnées et inspecter ses récompenses tactiques.
              </p>
            </div>
          )}

          {/* Bottom Live Feed Telemetry */}
          <div className="border-t border-slate-800/80 pt-3 mt-4 flex items-center justify-between text-[10px] font-mono-code text-slate-500">
            <span>SIGNAUX DÉTECTÉS : {filteredTargets.length}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              FLUX_TEMPS_RÉEL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
