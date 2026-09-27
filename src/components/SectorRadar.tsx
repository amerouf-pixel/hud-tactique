import React, { useState } from 'react';
import { Radar, Crosshair, Volume2, VolumeX, Sparkles, Navigation, ShieldAlert, ArrowRight } from 'lucide-react';
import { playSonarBeep, playCyberBlip } from '../utils/audioFx';
import { useGame } from '../context/GameContext';

interface RadarTarget {
  id: string;
  name: string;
  type: 'mission' | 'collectible' | 'cache';
  distance: number; // in meters
  angle: number; // in degrees 0-360
  reward?: string;
  district: string;
}

export const SectorRadar: React.FC = () => {
  const { missions, collectibles, setCurrentTab } = useGame();
  const [isScanning, setIsScanning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<RadarTarget | null>(null);

  // Active radar targets dynamically constructed from real missions and collectibles
  const activeMission = missions.find((m) => m.status === 'in_progress' || m.priority) || missions[0];
  const pendingCollectibles = collectibles.filter((c) => !c.collected);

  const targets: RadarTarget[] = [
    {
      id: activeMission ? activeMission.id : 'm-1',
      name: activeMission ? activeMission.title : 'Contrat Prioritaire',
      type: 'mission',
      distance: 140,
      angle: 45,
      reward: activeMission ? `+${activeMission.rewardCredits} E$` : '+1200 E$',
      district: activeMission ? activeMission.district : 'Centre-Ville',
    },
    {
      id: pendingCollectibles[0] ? pendingCollectibles[0].id : 'c-1',
      name: pendingCollectibles[0] ? pendingCollectibles[0].name : 'Datashard Cryptée',
      type: 'collectible',
      distance: 65,
      angle: 210,
      reward: 'Donnée classifiée',
      district: pendingCollectibles[0] ? pendingCollectibles[0].district : 'Heywood',
    },
    {
      id: pendingCollectibles[1] ? pendingCollectibles[1].id : 'c-2',
      name: pendingCollectibles[1] ? pendingCollectibles[1].name : 'Module Cyberware Militaire',
      type: 'cache',
      distance: 195,
      angle: 315,
      reward: 'Upgrade Rémunérateur',
      district: pendingCollectibles[1] ? pendingCollectibles[1].district : 'Kabuki',
    },
  ];

  const handleScan = () => {
    setIsScanning(true);
    if (soundEnabled) {
      playSonarBeep();
    }
    setTimeout(() => {
      setIsScanning(false);
      setSelectedTarget(targets[0]);
    }, 1200);
  };

  const getTargetPosition = (distance: number, angle: number) => {
    // Normalise distance to radius % (max radius = 250m => 42% from center)
    const normalizedRadius = Math.min((distance / 250) * 40, 42);
    const rad = (angle - 90) * (Math.PI / 180);
    const x = 50 + normalizedRadius * Math.cos(rad);
    const y = 50 + normalizedRadius * Math.sin(rad);
    return { x, y };
  };

  return (
    <div className="bg-[#0b1220] border border-cyan-900/60 p-5 shadow-2xl relative overflow-hidden">
      {/* HUD Header */}
      <div className="flex items-center justify-between gap-4 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Radar className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-hud font-bold text-sm sm:text-base text-white tracking-wider">
                RADAR SONAR TACTIQUE DU SECTEUR
              </h3>
              <span className="hidden sm:inline-block text-[9px] font-mono-code text-cyan-400 bg-cyan-950 px-1.5 py-0.5 border border-cyan-800 uppercase">
                DIRECT LINK 60Hz
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-0.5">
              Détection des points d'intérêt, caches et menaces à 360°
            </p>
          </div>
        </div>

        {/* Audio Toggle & Scan Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Désactiver le sonar audio' : 'Activer le sonar audio'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
              isScanning
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 animate-pulse'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
            }`}
          >
            <Crosshair className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'BALAYAGE EN COURS...' : 'LANCER SCAN'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Radar Canvas on Left, Detected Signals List on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Radar Circular Display */}
        <div className="md:col-span-6 lg:col-span-5 flex justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-cyan-500/30 bg-[#070b14] overflow-hidden flex items-center justify-center shadow-[inset_0_0_40px_rgba(6,182,212,0.15)]">
            {/* Range Concentric Rings */}
            <div className="absolute inset-4 rounded-full border border-cyan-500/15 pointer-events-none" />
            <div className="absolute inset-14 rounded-full border border-cyan-500/20 pointer-events-none" />
            <div className="absolute inset-24 rounded-full border border-cyan-500/25 pointer-events-none" />

            {/* Cardinal Markers */}
            <span className="absolute top-2 font-mono-code text-[10px] text-cyan-400 font-bold">N</span>
            <span className="absolute bottom-2 font-mono-code text-[10px] text-slate-600">S</span>
            <span className="absolute right-2.5 font-mono-code text-[10px] text-slate-600">E</span>
            <span className="absolute left-2.5 font-mono-code text-[10px] text-slate-600">W</span>

            {/* Crosshair Lines */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/20 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-500/20 pointer-events-none" />

            {/* Rotating Radar Beam Sweep */}
            <div
              className={`absolute inset-0 pointer-events-none ${
                isScanning ? 'animate-spin' : 'animate-spin-slow'
              }`}
              style={{
                background: 'conic-gradient(from 0deg, transparent 270deg, rgba(6, 182, 212, 0.4) 360deg)',
              }}
            />

            {/* Target Blips */}
            {targets.map((tgt) => {
              const pos = getTargetPosition(tgt.distance, tgt.angle);
              const isSelected = selectedTarget?.id === tgt.id;

              return (
                <button
                  key={tgt.id}
                  onClick={() => {
                    playCyberBlip();
                    setSelectedTarget(tgt);
                  }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  title={`${tgt.name} (${tgt.distance}m)`}
                >
                  <div
                    className={`w-3 h-3 flex items-center justify-center transition-all ${
                      tgt.type === 'mission'
                        ? 'text-rose-400 bg-rose-500/20 border border-rose-500'
                        : tgt.type === 'collectible'
                        ? 'text-amber-400 bg-amber-500/20 border border-amber-500'
                        : 'text-cyan-400 bg-cyan-500/20 border border-cyan-500'
                    } ${isSelected ? 'scale-125 ring-2 ring-cyan-300 ring-offset-1 ring-offset-black' : ''}`}
                    style={{ transform: 'rotate(45deg)' }}
                  />
                  {/* Ping Animation Wave */}
                  <span
                    className={`absolute -inset-1 rounded-full animate-ping pointer-events-none ${
                      tgt.type === 'mission' ? 'bg-rose-500/40' : 'bg-amber-500/40'
                    }`}
                  />
                </button>
              );
            })}

            {/* Center Player Dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-20 border border-black" />
          </div>
        </div>

        {/* Target Details & Action Panel */}
        <div className="md:col-span-6 lg:col-span-7 space-y-3">
          <div className="text-[11px] font-mono-code uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Cibles Tactiques Détectées ({targets.length})</span>
            <span className="text-cyan-400">Rayon actif : 250m</span>
          </div>

          <div className="space-y-2">
            {targets.map((tgt) => {
              const isSelected = selectedTarget?.id === tgt.id;

              return (
                <div
                  key={tgt.id}
                  onClick={() => {
                    playCyberBlip();
                    setSelectedTarget(tgt);
                  }}
                  className={`p-2.5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 flex-shrink-0 flex items-center justify-center border ${
                        tgt.type === 'mission'
                          ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                          : tgt.type === 'collectible'
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                          : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                      }`}
                    >
                      {tgt.type === 'mission' ? (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      ) : tgt.type === 'collectible' ? (
                        <Sparkles className="w-3.5 h-3.5" />
                      ) : (
                        <Navigation className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-hud font-bold text-white truncate">
                          {tgt.name}
                        </span>
                        <span className="text-[10px] font-mono-code text-cyan-400">
                          {tgt.distance}m
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono-code truncate">
                        {tgt.district} · {tgt.reward}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tgt.type === 'mission') {
                        setCurrentTab('missions');
                      } else {
                        setCurrentTab('collectibles');
                      }
                    }}
                    className="p-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors flex-shrink-0"
                    title="Naviguer vers cette cible"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {selectedTarget && (
            <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 text-xs text-slate-300 font-mono-code flex items-center justify-between gap-2">
              <span className="truncate">
                Balise verrouillée : <strong className="text-white">{selectedTarget.name}</strong> ({selectedTarget.distance}m)
              </span>
              <button
                onClick={() => {
                  if (selectedTarget.type === 'mission') setCurrentTab('missions');
                  else setCurrentTab('collectibles');
                }}
                className="text-[11px] text-cyan-300 font-bold hover:underline flex-shrink-0"
              >
                Engager la cible →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
