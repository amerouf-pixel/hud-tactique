import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { cyberAudio } from '../utils/cyberAudio';
import { Gamepad2, Zap, Flame, Clock, Award, ChevronDown, CheckCircle2, Volume2, VolumeX, HardDrive } from 'lucide-react';
import { ModalSaveDesktop } from './ModalSaveDesktop';

interface HeaderProps {
  onOpenLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLanding }) => {
  const { activeProfile, profiles, setActiveProfile, sessionSeconds, overallProgress } = useGame();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => cyberAudio.getMuted());
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleToggleSound = () => {
    const muted = cyberAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  // Format session time HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProfileIcon = (icon: string) => {
    switch (icon) {
      case 'Zap':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-rose-400" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-cyan-950/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: App Logo & Game Selector */}
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/40 flex items-center justify-center glow-cyan">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-hud font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                GAMING COMPANION
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono-code bg-cyan-950/80 text-cyan-400 border border-cyan-800 rounded">
                MVP v1.0
              </span>
              {typeof window !== 'undefined' && localStorage.getItem('cyber_license') && (
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono-code bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 rounded animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span>CORPO VIP</span>
                </span>
              )}
            </div>

            {/* Game Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer group"
              >
                {getProfileIcon(activeProfile.avatarIcon)}
                <span className="font-medium truncate max-w-[130px] sm:max-w-[180px]">
                  {activeProfile.name}
                </span>
                <span className="text-slate-600">• {activeProfile.universe}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-[#0d1424] border border-cyan-900/60 rounded-xl shadow-2xl p-2 z-50 divide-y divide-slate-800/60">
                    <div className="px-2 py-1 text-[11px] font-mono-code uppercase tracking-wider text-slate-400">
                      Changer d'univers de jeu
                    </div>
                    <div className="pt-1.5 space-y-1">
                      {profiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActiveProfile(p);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                            activeProfile.id === p.id
                              ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-700/40'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {getProfileIcon(p.avatarIcon)}
                            <div>
                              <div className="font-semibold">{p.name}</div>
                              <div className="text-[10px] text-slate-400">{p.universe}</div>
                            </div>
                          </div>
                          {activeProfile.id === p.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Session Clock, Audio Toggle & Overall Progress */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Save to Desktop Button */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              setIsSaveModalOpen(true);
            }}
            className="px-2.5 py-1.5 text-[11px] font-hud font-bold uppercase tracking-wider bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            title="Enregistrer le projet sur votre Bureau"
          >
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">SUR LE BUREAU</span>
          </button>

          {/* Landing Page Showcase Button */}
          {onOpenLanding && (
            <button
              onClick={() => {
                cyberAudio.playChirp();
                onOpenLanding();
              }}
              className="px-2.5 py-1.5 text-[11px] font-hud font-bold uppercase tracking-wider bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              title="Afficher la page de vente et tarifs"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="hidden md:inline">PAGE DE VENTE</span>
            </button>
          )}

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 border transition-colors cursor-pointer ${
              isAudioMuted
                ? 'border-slate-800 bg-slate-900/80 text-slate-500 hover:text-slate-300'
                : 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
            }`}
            title={isAudioMuted ? 'Activer le son Cyberpunk' : 'Couper le son Cyberpunk'}
            aria-label="Toggle Cyberpunk Sound"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Session Duration */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono-code">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>SESSION {formatTime(sessionSeconds)}</span>
          </div>

          {/* Overall 100% Progress Ring / Bar */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-cyan-950 px-3 py-1.5 rounded-xl">
            <Award className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono-code text-slate-400 leading-none">
                Progression
              </div>
              <div className="font-hud font-bold text-sm text-cyan-300 leading-none mt-0.5">
                {overallProgress}%
              </div>
            </div>
            <div className="w-12 h-2 bg-slate-800 rounded-full overflow-hidden ml-1 hidden xs:block">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Guide Enregistrer sur le Bureau */}
      <ModalSaveDesktop
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </header>
  );
};
