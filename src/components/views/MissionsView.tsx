import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { MissionType, MissionStatus } from '../../types';
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  Search,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface MissionsViewProps {
  onOpenNewItemModal: () => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ onOpenNewItemModal }) => {
  const { missions, toggleMissionStatus, toggleMissionStep, deleteMission } = useGame();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);

  const filteredMissions = missions.filter((m) => {
    // Filter by type or status
    if (filterType === 'in_progress' && m.status !== 'in_progress') return false;
    if (filterType === 'completed' && m.status !== 'completed') return false;
    if (filterType === 'available' && m.status !== 'available') return false;
    if (['main', 'side', 'bounty', 'activity'].includes(filterType) && m.type !== filterType) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDistrict = m.district.toLowerCase().includes(q);
      const matchGiver = m.giver.toLowerCase().includes(q);
      return matchTitle || matchDistrict || matchGiver;
    }
    return true;
  });

  const getStatusBadge = (status: MissionStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono-code bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Terminée
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono-code bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 animate-pulse">
            <Clock className="w-3 h-3" />
            En cours
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono-code bg-slate-800 text-slate-300 border border-slate-700">
            <Circle className="w-3 h-3" />
            Disponible
          </span>
        );
    }
  };

  const getTypeBadge = (type: MissionType) => {
    switch (type) {
      case 'main':
        return <span className="text-[10px] font-mono-code text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">PRINCIPALE</span>;
      case 'side':
        return <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">SECONDAIRE</span>;
      case 'bounty':
        return <span className="text-[10px] font-mono-code text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">CONTRAT / PRIME</span>;
      case 'activity':
        return <span className="text-[10px] font-mono-code text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">ACTIVITÉ</span>;
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold font-hud text-white">JOURNAL DES MISSIONS</h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Suivi des quêtes principales, contrats de primes et opérations spéciales.
          </p>
        </div>

        <button
          onClick={onOpenNewItemModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NOUVELLE MISSION</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, quartier ou contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0c1322] border border-cyan-950 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'in_progress', label: 'En cours' },
            { id: 'main', label: 'Principales' },
            { id: 'side', label: 'Secondaires' },
            { id: 'bounty', label: 'Primes' },
            { id: 'completed', label: 'Terminées' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilterType(chip.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code whitespace-nowrap cursor-pointer transition-colors ${
                filterType === chip.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mission Cards List */}
      <div className="space-y-4">
        {filteredMissions.length === 0 ? (
          <div className="p-8 text-center bg-[#0c1322] border border-slate-800 rounded-2xl">
            <Compass className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <div className="text-slate-300 font-semibold">Aucune mission ne correspond à vos critères.</div>
            <div className="text-xs text-slate-500 mt-1">
              Modifiez votre recherche ou ajoutez une nouvelle quête.
            </div>
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const isExpanded = expandedMissionId === mission.id;
            const completedStepsCount = mission.steps.filter((s) => s.completed).length;

            return (
              <div
                key={mission.id}
                className="bg-[#0c1322] border border-cyan-950/80 hover:border-cyan-800/60 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                <div className="p-4 sm:p-5">
                  {/* Top tags row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(mission.type)}
                      <span className="text-xs text-slate-400 font-mono-code flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {mission.district}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMissionStatus(mission.id)}
                        className="cursor-pointer"
                        title="Cliquer pour changer de statut"
                      >
                        {getStatusBadge(mission.status)}
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-bold font-hud text-white">{mission.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Donneur d’ordre : <span className="text-slate-300">{mission.giver}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => setExpandedMissionId(isExpanded ? null : mission.id)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">{mission.description}</p>

                  {/* Step progress summary */}
                  {mission.steps.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 mb-1.5">
                        <span>Objectifs complétés</span>
                        <span className="text-cyan-400 font-semibold">
                          {completedStepsCount} / {mission.steps.length}
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full transition-all duration-300"
                          style={{
                            width: `${(completedStepsCount / mission.steps.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Expanded Checklist */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-mono-code uppercase text-slate-400">
                        Liste détaillée des étapes :
                      </div>
                      {mission.steps.map((step) => (
                        <div
                          key={step.id}
                          onClick={() => toggleMissionStep(mission.id, step.id)}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-cyan-500/40 cursor-pointer transition-colors"
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm ${
                              step.completed
                                ? 'line-through text-slate-500'
                                : 'text-slate-200'
                            }`}
                          >
                            {step.text}
                          </span>
                        </div>
                      ))}

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => deleteMission(mission.id)}
                          className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-mono-code cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer la mission</span>
                        </button>

                        <button
                          onClick={() => toggleMissionStatus(mission.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono-code text-cyan-300 cursor-pointer"
                        >
                          Changer d'état (Disponible → En cours → Validée)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Rewards Footer */}
                  <div className="mt-3 pt-2.5 flex items-center justify-between text-xs font-mono-code text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400">+{mission.rewardXp} XP</span>
                      <span className="text-amber-400">+{mission.rewardCredits} E$</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
