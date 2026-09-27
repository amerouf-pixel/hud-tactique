import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useToast } from '../../context/ToastContext';
import { ObjectiveTier } from '../../types';
import {
  Trophy,
  Award,
  CheckCircle2,
  Circle,
  Flame,
  Medal,
  Radio,
} from 'lucide-react';

export const ObjectivesView: React.FC = () => {
  const { objectives, toggleObjective, stats } = useGame();
  const { triggerAchievement } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const filteredObjectives = objectives.filter((o) => {
    if (selectedTier !== 'all' && o.tier !== selectedTier) return false;
    return true;
  });

  const getTierIcon = (tier: ObjectiveTier) => {
    switch (tier) {
      case 'platinum':
        return <Award className="w-5 h-5 text-cyan-300" />;
      case 'gold':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'silver':
        return <Medal className="w-5 h-5 text-slate-300" />;
      case 'bronze':
        return <Medal className="w-5 h-5 text-orange-500" />;
    }
  };

  const getTierBadge = (tier: ObjectiveTier) => {
    switch (tier) {
      case 'platinum':
        return (
          <span className="text-[10px] font-mono-code px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
            TROPHÉE PLATINE
          </span>
        );
      case 'gold':
        return (
          <span className="text-[10px] font-mono-code px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold uppercase tracking-wider">
            TROPHÉE OR
          </span>
        );
      case 'silver':
        return (
          <span className="text-[10px] font-mono-code px-2 py-0.5 bg-slate-300/10 text-slate-200 border border-slate-400/30 font-bold uppercase tracking-wider">
            TROPHÉE ARGENT
          </span>
        );
      case 'bronze':
        return (
          <span className="text-[10px] font-mono-code px-2 py-0.5 bg-orange-950/40 text-orange-400 border border-orange-600/40 font-bold uppercase tracking-wider">
            TROPHÉE BRONZE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold font-hud text-white">OBJECTIFS & TROPHÉES</h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Défis de maître, succès Steam / PlayStation / Xbox et trophée Platine avec alertes HUD en direct.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'platinum', label: 'Platine' },
            { id: 'gold', label: 'Or' },
            { id: 'silver', label: 'Argent' },
            { id: 'bronze', label: 'Bronze' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedTier(chip.id)}
              className={`px-3 py-1.5 text-xs font-mono-code whitespace-nowrap cursor-pointer transition-colors ${
                selectedTier === chip.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-[#0c1322] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress banner & Quick Toast Test Controls */}
      <div className="bg-[#0c1322] border border-cyan-950/80 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 glow-cyan flex-shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-widest">
              Progression Succès Débloqués
            </div>
            <div className="text-xl font-bold font-hud text-white">
              {stats.objectivesDone} / {stats.objectivesTotal} Débloqués (
              {Math.round((stats.objectivesDone / (stats.objectivesTotal || 1)) * 100)}%)
            </div>
          </div>
        </div>

        {/* HUD Test Triggers Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          <span className="text-[10px] font-mono-code text-slate-500 flex items-center gap-1 uppercase tracking-wider mr-1">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            Test HUD Toast:
          </span>
          <button
            onClick={() =>
              triggerAchievement(
                'Légende Absolue de Night City',
                'platinum',
                'Trophée ultime débloqué. Vous dominez l’intégralité de la métropole.'
              )
            }
            className="px-2 py-1 text-[10px] font-mono-code bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-pointer transition-all hover:shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            title="Tester un Toast Platine"
          >
            Platine
          </button>
          <button
            onClick={() =>
              triggerAchievement(
                'Roi du Marché Noir',
                'gold',
                'Tous les coffres blindés de la zone industrielle ont été fracturés.'
              )
            }
            className="px-2 py-1 text-[10px] font-mono-code bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-pointer transition-all hover:shadow-[0_0_12px_rgba(245,158,11,0.4)]"
            title="Tester un Toast Or"
          >
            Or
          </button>
          <button
            onClick={() =>
              triggerAchievement(
                'Pilote d’Élite',
                'silver',
                'Atteignez la vitesse maximale sur l’autoroute sans collision.'
              )
            }
            className="px-2 py-1 text-[10px] font-mono-code bg-slate-400/10 hover:bg-slate-400/20 text-slate-200 border border-slate-400/40 cursor-pointer transition-all hover:shadow-[0_0_12px_rgba(203,213,225,0.3)]"
            title="Tester un Toast Argent"
          >
            Argent
          </button>
          <button
            onClick={() =>
              triggerAchievement(
                'Premier Contrat Honoré',
                'bronze',
                'Votre premier contrat de mercenaire est validé avec succès.'
              )
            }
            className="px-2 py-1 text-[10px] font-mono-code bg-orange-950/30 hover:bg-orange-950/50 text-orange-400 border border-orange-600/40 cursor-pointer transition-all hover:shadow-[0_0_12px_rgba(234,88,12,0.3)]"
            title="Tester un Toast Bronze"
          >
            Bronze
          </button>
        </div>
      </div>

      {/* Objectives list */}
      <div className="space-y-3">
        {filteredObjectives.map((obj) => (
          <div
            key={obj.id}
            onClick={() => toggleObjective(obj.id)}
            className={`p-4 border transition-all cursor-pointer flex items-center justify-between gap-4 ${
              obj.completed
                ? 'bg-slate-950/60 border-slate-800/80 opacity-75'
                : 'bg-[#0c1322] border-slate-800/80 hover:border-cyan-500/50 hover:bg-[#0e1628] shadow-md'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="mt-1 p-2 bg-slate-900 border border-slate-800 flex-shrink-0">
                {getTierIcon(obj.tier)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {getTierBadge(obj.tier)}
                  <span className="text-xs font-mono-code text-slate-500">• {obj.category}</span>
                </div>
                <h3
                  className={`font-hud font-bold text-base truncate ${
                    obj.completed ? 'line-through text-slate-500' : 'text-white'
                  }`}
                >
                  {obj.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{obj.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono-code text-slate-400">
                  {obj.progress} / {obj.maxProgress}
                </span>
              </div>
              <div>
                {obj.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-600 hover:text-cyan-400 transition-colors" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
