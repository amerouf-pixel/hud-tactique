import React, { useEffect, useState } from 'react';
import { ObjectiveTier } from '../types';
import { Trophy, Award, Medal, Sparkles, X } from 'lucide-react';

export interface AchievementToastProps {
  id?: string;
  title: string;
  tier: ObjectiveTier | 'platinum' | 'gold' | 'silver' | 'bronze';
  description?: string;
  onClose: () => void;
  duration?: number;
}

interface TierConfig {
  label: string;
  borderColor: string;
  bgColor: string;
  glowClass: string;
  badgeBg: string;
  badgeText: string;
  accentText: string;
  progressColor: string;
  icon: React.ReactNode;
}

const TIER_CONFIGS: Record<ObjectiveTier, TierConfig> = {
  platinum: {
    label: 'SUCCÈS PLATINE DÉVERROUILLÉ',
    borderColor: 'border-l-cyan-400 border-cyan-500/40',
    bgColor: 'bg-[#06101e]/95',
    glowClass: 'shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50',
    badgeText: 'text-cyan-400',
    accentText: 'text-cyan-300',
    progressColor: 'bg-cyan-400',
    icon: <Award className="w-5 h-5 text-cyan-300 animate-pulse" />,
  },
  gold: {
    label: 'SUCCÈS OR DÉVERROUILLÉ',
    borderColor: 'border-l-amber-400 border-amber-500/40',
    bgColor: 'bg-[#140e04]/95',
    glowClass: 'shadow-[0_0_25px_rgba(251,191,36,0.35)]',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
    badgeText: 'text-amber-400',
    accentText: 'text-amber-300',
    progressColor: 'bg-amber-400',
    icon: <Trophy className="w-5 h-5 text-amber-400" />,
  },
  silver: {
    label: 'SUCCÈS ARGENT DÉVERROUILLÉ',
    borderColor: 'border-l-slate-300 border-slate-400/40',
    bgColor: 'bg-[#0f141f]/95',
    glowClass: 'shadow-[0_0_25px_rgba(203,213,225,0.25)]',
    badgeBg: 'bg-slate-400/20 text-slate-200 border-slate-300/50',
    badgeText: 'text-slate-300',
    accentText: 'text-slate-200',
    progressColor: 'bg-slate-300',
    icon: <Medal className="w-5 h-5 text-slate-200" />,
  },
  bronze: {
    label: 'SUCCÈS BRONZE DÉVERROUILLÉ',
    borderColor: 'border-l-orange-500 border-orange-600/40',
    bgColor: 'bg-[#150a04]/95',
    glowClass: 'shadow-[0_0_25px_rgba(234,88,12,0.3)]',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    badgeText: 'text-orange-400',
    accentText: 'text-orange-300',
    progressColor: 'bg-orange-500',
    icon: <Medal className="w-5 h-5 text-orange-400" />,
  },
};

export const AchievementToast: React.FC<AchievementToastProps> = ({
  title,
  tier,
  description,
  onClose,
  duration = 4500,
}) => {
  const [progress, setProgress] = useState(100);
  const normalizedTier: ObjectiveTier =
    (tier?.toLowerCase() as ObjectiveTier) in TIER_CONFIGS
      ? (tier.toLowerCase() as ObjectiveTier)
      : 'bronze';

  const config = TIER_CONFIGS[normalizedTier];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      role="alert"
      className={`relative w-full max-w-sm sm:max-w-md pointer-events-auto border-l-4 ${config.borderColor} ${config.bgColor} ${config.glowClass} border-t border-r border-b backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right-8 fade-in-50`}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
      }}
    >
      {/* Corner Cyber Cut Accent Decoration */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current pointer-events-none opacity-60" />

      {/* Internal Content */}
      <div className="p-3.5 sm:p-4">
        {/* Top Meta Line: Status Header & Close Button */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-mono-code font-bold uppercase tracking-widest px-1.5 py-0.5 border ${config.badgeBg}`}
            >
              {config.label}
            </span>
            <span className="flex items-center gap-1 text-[9px] font-mono-code text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
              SYSTEM_SYNC
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Fermer la notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Achievement Details */}
        <div className="flex items-start gap-3">
          {/* Glowing Icon Frame */}
          <div className="flex-shrink-0 p-2.5 bg-black/60 border border-slate-800 flex items-center justify-center">
            {config.icon}
          </div>

          {/* Title and Description */}
          <div className="flex-1 min-w-0">
            <h4
              className={`font-hud font-bold text-sm sm:text-base leading-tight tracking-wide truncate ${config.accentText}`}
            >
              {title}
            </h4>
            <p className="text-xs text-slate-300 font-sans mt-0.5 line-clamp-2">
              {description || 'Objectif complété avec succès. Données tactiques synchronisées.'}
            </p>
          </div>
        </div>
      </div>

      {/* Auto-Dismiss Elapsed Timer Progress Bar */}
      <div className="w-full h-1 bg-black/50 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ease-linear ${config.progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
