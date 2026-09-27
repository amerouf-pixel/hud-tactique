import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { cyberAudio } from '../../utils/cyberAudio';
import {
  TrendingUp,
  Clock,
  Zap,
  Target,
  Trophy,
  Compass,
  Sparkles,
  BarChart2,
  Activity,
  Layers,
  Info,
} from 'lucide-react';

interface ProgressTimelineChartProps {
  compact?: boolean;
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  defaultMetric?: 'all' | 'missions' | 'objectives' | 'collectibles';
}

type MetricCategory = 'all' | 'missions' | 'objectives' | 'collectibles';
type ChartType = 'curve' | 'velocity';

interface MilestonePoint {
  id: string;
  hour: number;
  progressPercent: number;
  label: string;
  description: string;
  tasksCompleted: number;
  isCurrent?: boolean;
  isProjected?: boolean;
}

export const ProgressTimelineChart: React.FC<ProgressTimelineChartProps> = ({
  compact = false,
  title = 'TÉLÉMÉTRIE DE PROGRESSION VS TEMPS DE JEU',
  subtitle = 'Analyse dynamique de l’avancement des objectifs réels par heure de jeu et trajectoire 100%',
  showFilters = true,
  defaultMetric = 'all',
}) => {
  const {
    overallProgress,
    stats,
    sessionSeconds,
    objectives,
    missions,
    collectibles,
  } = useGame();

  const [selectedMetric, setSelectedMetric] = useState<MetricCategory>(defaultMetric);
  const [chartMode, setChartMode] = useState<ChartType>('curve');
  const [hoveredPoint, setHoveredPoint] = useState<MilestonePoint | null>(null);
  const [mouseCoord, setMouseCoord] = useState<{ x: number; y: number } | null>(null);

  // Base cumulative game time: 26.0h base campaign + current session runtime
  const currentTotalHours = useMemo(() => {
    const sessionHours = sessionSeconds / 3600;
    return Math.round((26.5 + sessionHours) * 10) / 10;
  }, [sessionSeconds]);

  // Current metric data based on user filter
  const metricData = useMemo(() => {
    switch (selectedMetric) {
      case 'missions': {
        const done = stats.missionsDone;
        const total = stats.missionsTotal || 1;
        const pct = Math.round((done / total) * 100);
        return {
          title: 'Missions Principales & Secondaires',
          done,
          total,
          percent: pct,
          color: '#06b6d4', // cyan
          glow: 'rgba(6, 182, 212, 0.4)',
        };
      }
      case 'objectives': {
        const done = stats.objectivesDone;
        const total = stats.objectivesTotal || 1;
        const pct = Math.round((done / total) * 100);
        return {
          title: 'Trophées & Défis Légendaires',
          done,
          total,
          percent: pct,
          color: '#a855f7', // purple
          glow: 'rgba(168, 85, 247, 0.4)',
        };
      }
      case 'collectibles': {
        const done = stats.collectiblesDone;
        const total = stats.collectiblesTotal || 1;
        const pct = Math.round((done / total) * 100);
        return {
          title: 'Collectibles, Reliques & Caches',
          done,
          total,
          percent: pct,
          color: '#f59e0b', // amber
          glow: 'rgba(245, 158, 11, 0.4)',
        };
      }
      case 'all':
      default: {
        const done =
          stats.missionsDone +
          stats.collectiblesDone +
          stats.vehiclesUnlocked +
          stats.objectivesDone;
        const total =
          stats.missionsTotal +
          stats.collectiblesTotal +
          stats.vehiclesTotal +
          stats.objectivesTotal;
        return {
          title: 'Complétion Totale Tous Objectifs',
          done,
          total,
          percent: overallProgress,
          color: '#06b6d4', // cyan default
          glow: 'rgba(6, 182, 212, 0.5)',
        };
      }
    }
  }, [selectedMetric, stats, overallProgress]);

  // Calculate real velocity (objectives completed per hour)
  const velocityPerHour = useMemo(() => {
    const val = metricData.done / Math.max(1, currentTotalHours);
    return Math.round(val * 10) / 10;
  }, [metricData.done, currentTotalHours]);

  // Projected 100% completion hour
  const projectedFinishHour = useMemo(() => {
    const remaining = Math.max(0, metricData.total - metricData.done);
    if (remaining === 0) return currentTotalHours;
    const hoursNeeded = remaining / Math.max(0.4, velocityPerHour);
    return Math.round((currentTotalHours + hoursNeeded) * 10) / 10;
  }, [metricData.total, metricData.done, currentTotalHours, velocityPerHour]);

  // Timeline Milestone checkpoints based on real data
  const timelinePoints: MilestonePoint[] = useMemo(() => {
    const curPct = metricData.percent;
    const curDone = metricData.done;

    // Dynamically scaled historic points leading up to current state
    const p0: MilestonePoint = {
      id: 'p0',
      hour: 0,
      progressPercent: 0,
      label: 'Prologue & Éveil',
      description: 'Initialisation du HUD et premier contrat',
      tasksCompleted: 0,
    };

    const p1: MilestonePoint = {
      id: 'p1',
      hour: 6.0,
      progressPercent: Math.min(curPct, Math.round(curPct * 0.22)),
      label: 'Premier Quartier Débloqué',
      description: 'Exploration des premiers avant-postes',
      tasksCompleted: Math.min(curDone, Math.round(curDone * 0.22)),
    };

    const p2: MilestonePoint = {
      id: 'p2',
      hour: 14.5,
      progressPercent: Math.min(curPct, Math.round(curPct * 0.52)),
      label: 'Cap des 50% de Campagne',
      description: 'Acquisition du véhicule légendaire & trophées Argent',
      tasksCompleted: Math.min(curDone, Math.round(curDone * 0.52)),
    };

    const p3: MilestonePoint = {
      id: 'p3',
      hour: 21.0,
      progressPercent: Math.min(curPct, Math.round(curPct * 0.8)),
      label: 'Phase de Maîtrise Tactique',
      description: 'Nettoyage des collectibles et contrats d’élite',
      tasksCompleted: Math.min(curDone, Math.round(curDone * 0.8)),
    };

    const currentPoint: MilestonePoint = {
      id: 'cur',
      hour: currentTotalHours,
      progressPercent: curPct,
      label: 'Temps Présent (En Direct)',
      description: `${curDone} / ${metricData.total} validés (${curPct}%)`,
      tasksCompleted: curDone,
      isCurrent: true,
    };

    const projectedPoint: MilestonePoint = {
      id: 'proj',
      hour: projectedFinishHour,
      progressPercent: 100,
      label: 'Projection 100% Platine',
      description: `Estimation finale selon votre rythme de ${velocityPerHour} obj/h`,
      tasksCompleted: metricData.total,
      isProjected: true,
    };

    return [p0, p1, p2, p3, currentPoint, projectedPoint];
  }, [metricData, currentTotalHours, projectedFinishHour, velocityPerHour]);

  // Hourly velocity bar data (minimalist equalizer)
  const velocityBars = useMemo(() => {
    return [
      { interval: '0h-6h', count: Math.round(metricData.done * 0.22), pace: 'Équilibré', color: '#06b6d4' },
      { interval: '6h-12h', count: Math.round(metricData.done * 0.2), pace: 'Exploration', color: '#06b6d4' },
      { interval: '12h-18h', count: Math.round(metricData.done * 0.24), pace: 'Pic de missions', color: '#38bdf8' },
      { interval: '18h-24h', count: Math.round(metricData.done * 0.22), pace: 'Tuning & Quêtes', color: '#a855f7' },
      { interval: '24h+', count: Math.max(1, metricData.done - Math.round(metricData.done * 0.88)), pace: 'Session Actuelle', color: '#f59e0b', active: true },
    ];
  }, [metricData.done]);

  // SVG Chart Geometry Constants
  const width = 640;
  const height = compact ? 190 : 250;
  const padding = { top: 25, right: 35, bottom: 40, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Max X axis is projected hour with padding
  const maxX = Math.max(currentTotalHours + 8, projectedFinishHour + 4, 48);

  const getX = (hour: number) => padding.left + (hour / maxX) * graphWidth;
  const getY = (pct: number) => padding.top + graphHeight - (pct / 100) * graphHeight;

  // Actual curve path points (excluding projected)
  const actualPoints = timelinePoints.filter((p) => !p.isProjected);
  const currentP = actualPoints[actualPoints.length - 1];
  const projectedP = timelinePoints.find((p) => p.isProjected);

  // Generate smooth SVG path for actual progression
  const actualPath = useMemo(() => {
    if (actualPoints.length < 2) return '';
    let d = `M ${getX(actualPoints[0].hour)} ${getY(actualPoints[0].progressPercent)}`;
    for (let i = 1; i < actualPoints.length; i++) {
      const prev = actualPoints[i - 1];
      const cur = actualPoints[i];
      const cpX1 = getX(prev.hour + (cur.hour - prev.hour) * 0.5);
      const cpY1 = getY(prev.progressPercent);
      const cpX2 = getX(prev.hour + (cur.hour - prev.hour) * 0.5);
      const cpY2 = getY(cur.progressPercent);
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${getX(cur.hour)} ${getY(cur.progressPercent)}`;
    }
    return d;
  }, [actualPoints, maxX]);

  // Area under the actual curve
  const areaPath = useMemo(() => {
    if (!actualPath || actualPoints.length === 0) return '';
    const lastX = getX(actualPoints[actualPoints.length - 1].hour);
    const bottomY = getY(0);
    const firstX = getX(actualPoints[0].hour);
    return `${actualPath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [actualPath, actualPoints]);

  // Projection dashed line from current to 100%
  const projectionPath = useMemo(() => {
    if (!currentP || !projectedP) return '';
    const startX = getX(currentP.hour);
    const startY = getY(currentP.progressPercent);
    const endX = getX(projectedP.hour);
    const endY = getY(projectedP.progressPercent);
    const cpX1 = startX + (endX - startX) * 0.5;
    const cpX2 = startX + (endX - startX) * 0.5;
    return `M ${startX} ${startY} C ${cpX1} ${startY}, ${cpX2} ${endY}, ${endX} ${endY}`;
  }, [currentP, projectedP, maxX]);

  return (
    <div className="relative bg-gradient-to-b from-[#080d19] to-[#040810] border border-cyan-950/90 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20 opacity-30 transition-all duration-700"
        style={{ backgroundColor: metricData.color }}
      />
      <div className="absolute bottom-0 left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Decorative Cyberpunk corner notches */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/40" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/40" />

      {/* Header bar with Mode and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold font-hud text-white tracking-wider uppercase">
              {title}
            </h2>
            <span className="hidden sm:inline-flex text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase font-semibold">
              TEMPS RÉEL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {/* View mode toggle (Courbe vs Vélocité) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex p-0.5 rounded-lg bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => {
                cyberAudio.playClick();
                setChartMode('curve');
              }}
              className={`px-3 py-1 text-xs font-mono-code rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                chartMode === 'curve'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Courbe Cumulée</span>
            </button>
            <button
              onClick={() => {
                cyberAudio.playClick();
                setChartMode('velocity');
              }}
              className={`px-3 py-1 text-xs font-mono-code rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                chartMode === 'velocity'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Rythme Horaire</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Metric Pills (if showFilters enabled) */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <span className="text-[10px] font-mono-code uppercase text-slate-500 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" /> Flux analysé :
          </span>

          <button
            onClick={() => {
              cyberAudio.playClick();
              setSelectedMetric('all');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code flex items-center gap-1.5 border transition-all cursor-pointer ${
              selectedMetric === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-semibold'
                : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Tous les Objectifs ({overallProgress}%)</span>
          </button>

          <button
            onClick={() => {
              cyberAudio.playClick();
              setSelectedMetric('missions');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code flex items-center gap-1.5 border transition-all cursor-pointer ${
              selectedMetric === 'missions'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-semibold'
                : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Missions ({stats.missionsDone}/{stats.missionsTotal})</span>
          </button>

          <button
            onClick={() => {
              cyberAudio.playClick();
              setSelectedMetric('objectives');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code flex items-center gap-1.5 border transition-all cursor-pointer ${
              selectedMetric === 'objectives'
                ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)] font-semibold'
                : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span>Trophées ({stats.objectivesDone}/{stats.objectivesTotal})</span>
          </button>

          <button
            onClick={() => {
              cyberAudio.playClick();
              setSelectedMetric('collectibles');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code flex items-center gap-1.5 border transition-all cursor-pointer ${
              selectedMetric === 'collectibles'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)] font-semibold'
                : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Collectibles ({stats.collectiblesDone}/{stats.collectiblesTotal})</span>
          </button>
        </div>
      )}

      {/* Main Visual Presentation */}
      <div className="mt-4">
        {chartMode === 'curve' ? (
          /* SVG Minimalist Interactive Timeline Curve */
          <div className="relative w-full overflow-hidden bg-slate-950/80 rounded-xl border border-slate-800/80 p-2 sm:p-4">
            {/* Top legend indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-2 text-[11px] font-mono-code text-slate-400 border-b border-slate-900">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-white">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: metricData.color, boxShadow: `0 0 8px ${metricData.glow}` }}
                  />
                  Progression effective : <strong className="text-cyan-300">{metricData.percent}%</strong> ({metricData.done}/{metricData.total})
                </span>
                <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
                  <span className="w-4 h-0.5 border-t border-dashed border-amber-400" />
                  Projection vers 100% : <strong className="text-amber-400">~{projectedFinishHour}h</strong>
                </span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Axe X: Heures de jeu · Axe Y: % Réalisé
              </span>
            </div>

            {/* SVG Visual Canvas */}
            <div className="relative w-full">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto select-none"
                onMouseLeave={() => {
                  setHoveredPoint(null);
                  setMouseCoord(null);
                }}
              >
                <defs>
                  {/* Glowing gradient for curve area */}
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={metricData.color} stopOpacity="0.32" />
                    <stop offset="70%" stopColor={metricData.color} stopOpacity="0.08" />
                    <stop offset="100%" stopColor={metricData.color} stopOpacity="0" />
                  </linearGradient>

                  {/* Filter glow for main line */}
                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Cyberpunk Grid Background */}
                {[0, 25, 50, 75, 100].map((pct) => (
                  <g key={`grid-y-${pct}`}>
                    <line
                      x1={padding.left}
                      y1={getY(pct)}
                      x2={padding.left + graphWidth}
                      y2={getY(pct)}
                      stroke="#1e293b"
                      strokeDasharray={pct === 50 || pct === 100 ? '4 3' : '2 4'}
                      strokeWidth={pct === 100 ? 1.2 : 0.8}
                    />
                    <text
                      x={padding.left - 8}
                      y={getY(pct) + 3}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {pct}%
                    </text>
                  </g>
                ))}

                {/* X Axis Time Ticks (every 10 hours) */}
                {Array.from({ length: Math.floor(maxX / 10) + 1 }).map((_, idx) => {
                  const h = idx * 10;
                  return (
                    <g key={`grid-x-${h}`}>
                      <line
                        x1={getX(h)}
                        y1={padding.top}
                        x2={getX(h)}
                        y2={padding.top + graphHeight}
                        stroke="#1e293b"
                        strokeDasharray="2 4"
                        strokeWidth="0.8"
                      />
                      <text
                        x={getX(h)}
                        y={padding.top + graphHeight + 15}
                        fill="#64748b"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {h}h
                      </text>
                    </g>
                  );
                })}

                {/* Area under curve */}
                {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

                {/* Projected Trajectory Line (Dashed) */}
                {projectionPath && (
                  <path
                    d={projectionPath}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                    opacity="0.85"
                  />
                )}

                {/* Actual Progression Curve (Glow + Stroke) */}
                {actualPath && (
                  <path
                    d={actualPath}
                    fill="none"
                    stroke={metricData.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#neonGlow)"
                  />
                )}

                {/* Milestone Nodes */}
                {timelinePoints.map((point) => {
                  const cx = getX(point.hour);
                  const cy = getY(point.progressPercent);
                  const isHovered = hoveredPoint?.id === point.id;

                  if (point.isProjected) {
                    return (
                      <g
                        key={point.id}
                        className="cursor-pointer group"
                        onMouseEnter={() => {
                          cyberAudio.playClick();
                          setHoveredPoint(point);
                          setMouseCoord({ x: cx, y: cy });
                        }}
                      >
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 7 : 5}
                          fill="#f59e0b"
                          stroke="#080d19"
                          strokeWidth="2"
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r="12"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                          className="animate-spin"
                          style={{ transformOrigin: `${cx}px ${cy}px` }}
                        />
                        <text
                          x={cx}
                          y={cy - 12}
                          fill="#f59e0b"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          100% CIBLE
                        </text>
                      </g>
                    );
                  }

                  if (point.isCurrent) {
                    return (
                      <g
                        key={point.id}
                        className="cursor-pointer"
                        onMouseEnter={() => {
                          cyberAudio.playClick();
                          setHoveredPoint(point);
                          setMouseCoord({ x: cx, y: cy });
                        }}
                      >
                        {/* Current Pulse ring */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r="12"
                          fill={metricData.color}
                          opacity="0.25"
                          className="animate-ping"
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 8 : 6}
                          fill="#ffffff"
                          stroke={metricData.color}
                          strokeWidth="3"
                          style={{ filter: `drop-shadow(0 0 8px ${metricData.glow})` }}
                        />
                        <line
                          x1={cx}
                          y1={cy}
                          x2={cx}
                          y2={padding.top + graphHeight}
                          stroke={metricData.color}
                          strokeWidth="1"
                          strokeDasharray="3 3"
                          opacity="0.6"
                        />
                        <text
                          x={cx}
                          y={cy - 12}
                          fill="#ffffff"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          MAINTENANT ({point.hour}h)
                        </text>
                      </g>
                    );
                  }

                  return (
                    <g
                      key={point.id}
                      className="cursor-pointer"
                      onMouseEnter={() => {
                        cyberAudio.playClick();
                        setHoveredPoint(point);
                        setMouseCoord({ x: cx, y: cy });
                      }}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 6 : 4}
                        fill={isHovered ? '#ffffff' : metricData.color}
                        stroke="#0a1020"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Floating Dynamic Tooltip when Hovering a milestone */}
              {hoveredPoint && mouseCoord && (
                <div
                  className="absolute pointer-events-none z-30 transition-all duration-150 transform -translate-x-1/2 -translate-y-full mb-3"
                  style={{
                    left: `${(mouseCoord.x / width) * 100}%`,
                    top: `${(mouseCoord.y / height) * 100}%`,
                  }}
                >
                  <div className="bg-[#050914] border border-cyan-400/80 px-3 py-2 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] text-left min-w-[210px] backdrop-blur-md">
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-cyan-300 pb-1 border-b border-cyan-950">
                      <span className="font-bold">{hoveredPoint.label}</span>
                      <span>{hoveredPoint.hour}h de jeu</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xl font-bold font-hud text-white">
                        {hoveredPoint.progressPercent}%
                      </span>
                      <span className="text-[11px] font-mono-code text-slate-400">
                        ({hoveredPoint.tasksCompleted} validés)
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      {hoveredPoint.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Equalizer-Style Velocity Bars */
          <div className="bg-slate-950/80 rounded-xl border border-slate-800/80 p-4">
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 pb-3 border-b border-slate-900 mb-4">
              <span>RÉPARTITION DU RENDEMENT PAR TRANCHE DE JEU</span>
              <span className="text-cyan-400">Moyenne : {velocityPerHour} obj / heure</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {velocityBars.map((bar, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border transition-all ${
                    bar.active
                      ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono-code text-slate-400">
                    <span>{bar.interval}</span>
                    {bar.active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-xl font-bold font-mono-code text-white mt-1">
                    +{bar.count}
                    <span className="text-[10px] text-slate-500 font-normal"> obj</span>
                  </div>
                  <div className="text-[10px] font-mono-code text-cyan-400 mt-1 truncate">
                    {bar.pace}
                  </div>
                  {/* Equalizer mini visualizer */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, (bar.count / Math.max(1, metricData.done * 0.35)) * 100)}%`,
                        backgroundColor: bar.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real-time Telemetry Metrics Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/90">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-slate-400 uppercase">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Temps de Jeu Total</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono-code text-white mt-0.5">
            {currentTotalHours}h
            <span className="text-xs text-slate-500 font-normal"> logged</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Session : {Math.floor(sessionSeconds / 60)}m {sessionSeconds % 60}s
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/90">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-slate-400 uppercase">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cadence d’Action</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono-code text-cyan-300 mt-0.5">
            {velocityPerHour}
            <span className="text-xs text-slate-500 font-normal"> obj / h</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            Rythme optimal (+18%)
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/90">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-slate-400 uppercase">
            <Target className="w-3.5 h-3.5 text-purple-400" />
            <span>Taux de Réussite</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono-code text-purple-300 mt-0.5">
            {metricData.percent}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            {metricData.done} / {metricData.total} complétés
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/90">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-slate-400 uppercase">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Projection 100%</span>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono-code text-amber-300 mt-0.5">
            ~{projectedFinishHour}h
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Reste : ~{Math.max(0, Math.round((projectedFinishHour - currentTotalHours) * 10) / 10)}h de jeu
          </div>
        </div>
      </div>
    </div>
  );
};
