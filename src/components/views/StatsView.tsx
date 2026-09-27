import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ProgressTimelineChart } from '../charts/ProgressTimelineChart';
import {
  BarChart3,
  Award,
  Download,
  Upload,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const StatsView: React.FC = () => {
  const {
    overallProgress,
    stats,
    sessionSeconds,
    exportBackup,
    importBackup,
    resetAllData,
  } = useGame();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const formatHours = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m ${seconds % 60}s`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = importBackup(text);
      if (success) {
        setImportStatus('Sauvegarde importée avec succès !');
      } else {
        setImportStatus('Erreur : fichier de sauvegarde non valide.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-bold font-hud text-white">STATISTIQUES & SAUVEGARDE</h1>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Analyse globale de complétion 100%, temps de jeu et gestion des données locales.
        </p>
      </div>

      {/* Global 100% Completion Ring / Card */}
      <div className="bg-[#0c1322] border border-cyan-950/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Big Progress Badge */}
            <div className="relative w-28 h-28 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-950 to-slate-900 border-2 border-cyan-500/50 glow-cyan">
              <div className="text-center">
                <div className="text-3xl font-extrabold font-hud text-cyan-300">
                  {overallProgress}%
                </div>
                <div className="text-[10px] font-mono-code uppercase text-slate-400">100% GOAL</div>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono-code text-cyan-400 uppercase tracking-widest">
                Rapport de Progression Totale
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-hud text-white mt-1">
                {overallProgress === 100
                  ? 'FÉLICITATIONS ! COMPLÉTION 100% ATTEINTE !'
                  : overallProgress >= 50
                  ? 'EN BONNE VOIE POUR LE 100%'
                  : 'DÉBUT DE L’AVENTURE'}
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono-code text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> Session active : {formatHours(sessionSeconds)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs font-hud mb-1.5">
              <span className="text-slate-300">Missions terminées</span>
              <span className="text-cyan-400 font-mono-code font-bold">
                {stats.missionsDone} / {stats.missionsTotal} (
                {Math.round((stats.missionsDone / (stats.missionsTotal || 1)) * 100)}%)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{
                  width: `${(stats.missionsDone / (stats.missionsTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs font-hud mb-1.5">
              <span className="text-slate-300">Collectibles découverts</span>
              <span className="text-amber-400 font-mono-code font-bold">
                {stats.collectiblesDone} / {stats.collectiblesTotal} (
                {Math.round((stats.collectiblesDone / (stats.collectiblesTotal || 1)) * 100)}%)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{
                  width: `${(stats.collectiblesDone / (stats.collectiblesTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs font-hud mb-1.5">
              <span className="text-slate-300">Véhicules acquis</span>
              <span className="text-emerald-400 font-mono-code font-bold">
                {stats.vehiclesUnlocked} / {stats.vehiclesTotal} (
                {Math.round((stats.vehiclesUnlocked / (stats.vehiclesTotal || 1)) * 100)}%)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{
                  width: `${(stats.vehiclesUnlocked / (stats.vehiclesTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs font-hud mb-1.5">
              <span className="text-slate-300">Objectifs & Succès</span>
              <span className="text-purple-400 font-mono-code font-bold">
                {stats.objectivesDone} / {stats.objectivesTotal} (
                {Math.round((stats.objectivesDone / (stats.objectivesTotal || 1)) * 100)}%)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-400 rounded-full"
                style={{
                  width: `${(stats.objectivesDone / (stats.objectivesTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Cyberpunk Progress vs Time Chart */}
      <ProgressTimelineChart
        title="TÉLÉMÉTRIE DYNAMIQUE · PROGRESSION DES OBJECTIFS VS TEMPS DE JEU"
        subtitle="Courbe réelle d'acquisition des trophées, rythme de progression et projection algorithmique vers le 100%"
        showFilters={true}
      />

      {/* Backup and Data Management */}
      <div className="bg-[#0c1322] border border-cyan-950/80 rounded-2xl p-6 shadow-xl">
        <h3 className="font-hud font-bold text-lg text-white mb-2">
          GESTION DES DONNÉES & SAUVEGARDE
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Exportez vos données au format JSON pour les transférer sur un autre appareil ou téléphone Android, ou réinitialisez aux valeurs de démonstration.
        </p>

        {importStatus && (
          <div className="p-3 mb-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportBackup}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono-code text-cyan-300 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>EXPORTER EN JSON</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono-code text-emerald-300 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>IMPORTER UN FICHIER JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/50 text-xs font-mono-code text-rose-300 cursor-pointer transition-colors ml-auto"
          >
            <RefreshCw className="w-4 h-4 text-rose-400" />
            <span>RÉINITIALISER LES DONNÉES</span>
          </button>
        </div>

        {/* Confirmation Modal / Alert */}
        {showResetConfirm && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div className="text-xs text-rose-200">
                Êtes-vous sûr de vouloir réinitialiser toutes les données à zéro ? Cette action est irréversible.
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer"
              >
                Confirmer
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
