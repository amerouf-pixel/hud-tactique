import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { cyberAudio } from '../../utils/cyberAudio';
import {
  TrendingUp,
  Clock,
  Zap,
  Target,
  ChevronRight,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface DashboardMiniTelemetryChartProps {
  onNavigateToStats?: () => void;
}

export const DashboardMiniTelemetryChart: React.FC<DashboardMiniTelemetryChartProps> = ({
  onNavigateToStats,
}) => {
  const { overallProgress, stats, sessionSeconds, setCurrentTab } = useGame();
  const [activeMetric, setActiveMetric] = useState<'overall' | 'objectives'>('overall');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Current session + baseline hours
  const totalHours = useMemo(() => {
    const sessionHours = sessionSeconds / 3600;
    return Math.round((26.5 + sessionHours) * 10) / 10;
  }, [sessionSeconds]);

  const currentPercent = activeMetric === 'overall'
    ? overallProgress
    : Math.round((stats.objectivesDone / (stats.objectivesTotal || 1)) * 100);

  const totalDone = activeMetric === 'overall'
    ? stats.missionsDone + stats.collectiblesDone + stats.vehiclesUnlocked + stats.objectivesDone
    : stats.objectivesDone;

  const totalItems = activeMetric === 'overall'
    ? stats.missionsTotal + stats.collectiblesTotal + stats.vehiclesTotal + stats.objectivesTotal
    : stats.objectivesTotal;

  // Pace velocity
  const velocity = Math.round((totalDone / Math.max(1, totalHours)) * 10) / 10;
  const hoursLeft = Math.max(1.5, Math.round(((totalItems - totalDone) / Math.max(0.5, velocity)) * 10) / 10);
  const targetHour = Math.round((totalHours + hoursLeft) * 10) / 10;

  // 6 Telemetry points for the sparkline / mini graph
  const points = useMemo(() => {
    return [
      { h: 0, p: 0, label: 'Début (0h)', note: 'Activation' },
      { h: 6, p: Math.round(currentPercent * 0.2), label: '6h de jeu', note: 'Prise en main' },
      { h: 14, p: Math.round(currentPercent * 0.48), label: '14h de jeu', note: 'Région centrale' },
      { h: 21, p: Math.round(currentPercent * 0.78), label: '21h de jeu', note: 'Quêtes majeures' },
      { h: totalHours, p: currentPercent, label: 'En direct', note: `${totalDone}/${totalItems} complétés`, current: true },
      { h: targetHour, p: 100, label: 'Projection 100%', note: `Objectif ~${targetHour}h`, projected: true },
    ];
  }, [currentPercent, totalHours, targetHour, totalDone, totalItems]);

  // SVG Coordinates
  const w = 480;
  const h = 130;
  const padL = 30;
  const padR = 25;
  const padT = 18;
  const padB = 25;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const maxH = Math.max(totalHours + 12, targetHour + 4, 45);

  const getX = (hour: number) => padL + (hour / maxH) * plotW;
  const getY = (pct: number) => padT + plotH - (pct / 100) * plotH;

  const actualPts = points.filter((p) => !p.projected);
  const curP = actualPts[actualPts.length - 1];
  const projP = points.find((p) => p.projected);

  // Bezier curve
  let curveD = `M ${getX(actualPts[0].h)} ${getY(actualPts[0].p)}`;
  for (let i = 1; i < actualPts.length; i++) {
    const prev = actualPts[i - 1];
    const cur = actualPts[i];
    const cpX = getX(prev.h + (cur.h - prev.h) * 0.5);
    curveD += ` C ${cpX} ${getY(prev.p)}, ${cpX} ${getY(cur.p)}, ${getX(cur.h)} ${getY(cur.p)}`;
  }

  // Area under curve
  const areaD = `${curveD} L ${getX(curP.h)} ${getY(0)} L ${getX(actualPts[0].h)} ${getY(0)} Z`;

  // Projection dashed line
  let projD = '';
  if (curP && projP) {
    const sx = getX(curP.h);
    const sy = getY(curP.p);
    const ex = getX(projP.h);
    const ey = getY(projP.p);
    projD = `M ${sx} ${sy} C ${sx + (ex - sx) * 0.5} ${sy}, ${sx + (ex - sx) * 0.5} ${ey}, ${ex} ${ey}`;
  }

  const activePoint = hoverIndex !== null ? points[hoverIndex] : curP;

  return (
    <div className="bg-[#070c18] border border-cyan-950/80 p-4 sm:p-5 relative overflow-hidden group shadow-xl">
      {/* Decorative top cyberpunk accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-hud font-bold text-sm sm:text-base text-white uppercase tracking-wider">
                COURBE DE PROGRESSION RÉELLE VS TEMPS
              </h3>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">
              Corrélation temps de jeu ({totalHours}h) &amp; vélocité de complétion
            </p>
          </div>
        </div>

        {/* Metric Selector & Stats Tab link */}
        <div className="flex items-center gap-2">
          <div className="flex p-0.5 rounded-lg bg-slate-950 border border-slate-800">
            <button
              onClick={() => {
                cyberAudio.playClick();
                setActiveMetric('overall');
              }}
              className={`px-2.5 py-1 text-[11px] font-mono-code rounded transition-all cursor-pointer ${
                activeMetric === 'overall'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Global 100%
            </button>
            <button
              onClick={() => {
                cyberAudio.playClick();
                setActiveMetric('objectives');
              }}
              className={`px-2.5 py-1 text-[11px] font-mono-code rounded transition-all cursor-pointer ${
                activeMetric === 'objectives'
                  ? 'bg-purple-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Trophées
            </button>
          </div>

          <button
            onClick={() => {
              cyberAudio.playClick();
              if (onNavigateToStats) {
                onNavigateToStats();
              } else {
                setCurrentTab('stats');
              }
            }}
            className="flex items-center gap-1 text-[11px] font-hud text-cyan-400 hover:text-cyan-300 px-2 py-1 border border-cyan-900/60 hover:border-cyan-500/60 transition-all cursor-pointer"
          >
            <span>DÉTAILS</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Dynamic Interactive SVG Canvas */}
      <div className="relative mt-2">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="miniAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={activeMetric === 'overall' ? '#06b6d4' : '#a855f7'}
                stopOpacity="0.35"
              />
              <stop
                offset="100%"
                stopColor={activeMetric === 'overall' ? '#06b6d4' : '#a855f7'}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines (0, 50%, 100%) */}
          {[0, 50, 100].map((pct) => (
            <g key={pct}>
              <line
                x1={padL}
                y1={getY(pct)}
                x2={padL + plotW}
                y2={getY(pct)}
                stroke="#1e293b"
                strokeDasharray={pct === 100 ? '4 2' : '2 3'}
                strokeWidth={pct === 100 ? 1 : 0.6}
              />
              <text
                x={padL - 4}
                y={getY(pct) + 3}
                fill="#64748b"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="end"
              >
                {pct}%
              </text>
            </g>
          ))}

          {/* Time ticks on X axis */}
          {[0, 15, 30, 45].filter((h) => h <= maxH).map((hour) => (
            <text
              key={hour}
              x={getX(hour)}
              y={padT + plotH + 14}
              fill="#64748b"
              fontSize="8"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {hour}h
            </text>
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#miniAreaGradient)" />

          {/* Projection dashed path */}
          {projD && (
            <path
              d={projD}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.8"
              strokeDasharray="4 3"
              opacity="0.8"
            />
          )}

          {/* Main progression curve */}
          <path
            d={curveD}
            fill="none"
            stroke={activeMetric === 'overall' ? '#06b6d4' : '#a855f7'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive milestone circles */}
          {points.map((pt, idx) => {
            const cx = getX(pt.h);
            const cy = getY(pt.p);
            const isHover = hoverIndex === idx;

            if (pt.projected) {
              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    cyberAudio.playClick();
                    setHoverIndex(idx);
                  }}
                >
                  <circle cx={cx} cy={cy} r={isHover ? 6 : 4} fill="#f59e0b" stroke="#050811" strokeWidth="2" />
                  <circle cx={cx} cy={cy} r="9" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" />
                </g>
              );
            }

            if (pt.current) {
              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    cyberAudio.playClick();
                    setHoverIndex(idx);
                  }}
                >
                  <circle cx={cx} cy={cy} r="10" fill="#06b6d4" opacity="0.25" className="animate-ping" />
                  <circle cx={cx} cy={cy} r={isHover ? 7 : 5} fill="#ffffff" stroke="#06b6d4" strokeWidth="2.5" />
                </g>
              );
            }

            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={isHover ? 5 : 3.5}
                fill={isHover ? '#ffffff' : activeMetric === 'overall' ? '#06b6d4' : '#a855f7'}
                stroke="#050811"
                strokeWidth="1.5"
                className="cursor-pointer"
                onMouseEnter={() => {
                  cyberAudio.playClick();
                  setHoverIndex(idx);
                }}
              />
            );
          })}
        </svg>

        {/* Dynamic Telemetry floating banner / interactive badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-1 px-2 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] font-mono-code">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Palier ciblé :{' '}
              <strong className="text-white">{activePoint.label}</strong> ({activePoint.p}%)
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="text-cyan-400">{activePoint.note}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>
              Cadence : <strong className="text-emerald-400">~{velocity} obj/h</strong>
            </span>
            <span className="text-slate-500">·</span>
            <span>
              Cible 100% : <strong className="text-amber-400">~{targetHour}h</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
