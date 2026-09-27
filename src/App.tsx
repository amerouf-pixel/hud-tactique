import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ToastProvider } from './context/ToastContext';
import { CyberBackground } from './components/CyberBackground';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/views/HomeView';
import { MissionsView } from './components/views/MissionsView';
import { CollectiblesView } from './components/views/CollectiblesView';
import { VehiclesView } from './components/views/VehiclesView';
import { ObjectivesView } from './components/views/ObjectivesView';
import { NotesView } from './components/views/NotesView';
import { StatsView } from './components/views/StatsView';
import { ModalNewItem } from './components/ModalNewItem';
import { LandingPage } from './components/LandingPage';
import { useAchievementWatcher } from './hooks/useAchievementWatcher';

const AppContent: React.FC = () => {
  const { currentTab, objectives } = useGame();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLandingMode, setIsLandingMode] = useState(false);

  // Automatically listen for objective completion and dispatch achievement toasts
  useAchievementWatcher(objectives);

  if (isLandingMode) {
    return <LandingPage onEnterApp={() => setIsLandingMode(false)} />;
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            onOpenNewItemModal={() => setIsModalOpen(true)}
            onOpenLanding={() => setIsLandingMode(true)}
          />
        );
      case 'missions':
        return <MissionsView onOpenNewItemModal={() => setIsModalOpen(true)} />;
      case 'collectibles':
        return <CollectiblesView onOpenNewItemModal={() => setIsModalOpen(true)} />;
      case 'vehicles':
        return <VehiclesView onOpenNewItemModal={() => setIsModalOpen(true)} />;
      case 'objectives':
        return <ObjectivesView />;
      case 'notes':
        return <NotesView onOpenNewItemModal={() => setIsModalOpen(true)} />;
      case 'stats':
        return <StatsView />;
      default:
        return <HomeView onOpenNewItemModal={() => setIsModalOpen(true)} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Tactical Multi-Layer Background (Grid, CRT, Grain, Vignette) */}
      <CyberBackground />

      {/* Tactical Top Bar */}
      <Header onOpenLanding={() => setIsLandingMode(true)} />

      {/* Main Tab Navigation */}
      <BottomNav />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveView()}
      </main>

      {/* Add New Entry Modal */}
      <ModalNewItem isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </GameProvider>
  );
}
