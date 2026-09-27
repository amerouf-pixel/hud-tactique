import React from 'react';
import { useGame } from '../context/GameContext';
import { cyberAudio } from '../utils/cyberAudio';
import { TabType } from '../types';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Car,
  Trophy,
  FileText,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, stats } = useGame();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Accueil', icon: LayoutDashboard },
    {
      id: 'missions',
      label: 'Missions',
      icon: Compass,
      badge: stats.missionsTotal - stats.missionsDone,
    },
    {
      id: 'collectibles',
      label: 'Collectibles',
      icon: Sparkles,
      badge: stats.collectiblesTotal - stats.collectiblesDone,
    },
    { id: 'vehicles', label: 'Véhicules', icon: Car },
    { id: 'objectives', label: 'Objectifs', icon: Trophy },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop / Tablet top tab bar below header */}
      <nav className="hidden md:block bg-[#0c1322] border-b border-cyan-950/70 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    cyberAudio.playClick();
                    setCurrentTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 glow-cyan'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="font-hud">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono-code ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile sticky bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-cyan-950/80 px-2 py-1.5 safe-area-pb">
        <div className="flex items-center justify-around gap-1 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  cyberAudio.playClick();
                  setCurrentTab(item.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
                  isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110 stroke-[2.2]' : 'stroke-1.5'
                    }`}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 text-[9px] font-mono-code font-bold rounded-full bg-cyan-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 font-hud tracking-tight leading-none ${
                    isActive ? 'font-bold text-cyan-300' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-3 h-0.5 bg-cyan-400 rounded-full glow-cyan" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
