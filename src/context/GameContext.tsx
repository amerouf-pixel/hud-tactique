import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  TabType,
  Mission,
  Collectible,
  Vehicle,
  Objective,
  TacticalNote,
  GameProfile,
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_MISSIONS,
  INITIAL_COLLECTIBLES,
  INITIAL_VEHICLES,
  INITIAL_OBJECTIVES,
  INITIAL_NOTES,
} from '../data/initialData';

interface GameContextType {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  profiles: GameProfile[];
  activeProfile: GameProfile;
  setActiveProfile: (profile: GameProfile) => void;
  // Missions
  missions: Mission[];
  toggleMissionStatus: (id: string) => void;
  toggleMissionStep: (missionId: string, stepId: string) => void;
  addMission: (mission: Omit<Mission, 'id'>) => void;
  deleteMission: (id: string) => void;
  // Collectibles
  collectibles: Collectible[];
  toggleCollectible: (id: string) => void;
  addCollectible: (item: Omit<Collectible, 'id'>) => void;
  // Vehicles
  vehicles: Vehicle[];
  toggleVehicleUnlocked: (id: string) => void;
  toggleVehicleFavorite: (id: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  // Objectives
  objectives: Objective[];
  toggleObjective: (id: string) => void;
  // Notes
  notes: TacticalNote[];
  addNote: (note: Omit<TacticalNote, 'id' | 'updatedAt'>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  // Stats
  sessionSeconds: number;
  overallProgress: number;
  stats: {
    missionsDone: number;
    missionsTotal: number;
    collectiblesDone: number;
    collectiblesTotal: number;
    vehiclesUnlocked: number;
    vehiclesTotal: number;
    objectivesDone: number;
    objectivesTotal: number;
  };
  // Actions
  resetAllData: () => void;
  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'gaming_companion_data_v1';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [profiles] = useState<GameProfile[]>(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState<GameProfile>(INITIAL_PROFILES[0]);

  // Load from local storage or defaults
  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_missions`);
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });

  const [collectibles, setCollectibles] = useState<Collectible[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_collectibles`);
      return saved ? JSON.parse(saved) : INITIAL_COLLECTIBLES;
    } catch {
      return INITIAL_COLLECTIBLES;
    }
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_vehicles`);
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [objectives, setObjectives] = useState<Objective[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_objectives`);
      return saved ? JSON.parse(saved) : INITIAL_OBJECTIVES;
    } catch {
      return INITIAL_OBJECTIVES;
    }
  });

  const [notes, setNotes] = useState<TacticalNote[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notes`);
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  // Session timer
  const [sessionSeconds, setSessionSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_missions`, JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_collectibles`, JSON.stringify(collectibles));
  }, [collectibles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_vehicles`, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_objectives`, JSON.stringify(objectives));
  }, [objectives]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
  }, [notes]);

  // Mission handlers
  const toggleMissionStatus = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus =
          m.status === 'available'
            ? 'in_progress'
            : m.status === 'in_progress'
            ? 'completed'
            : 'available';
        const updatedSteps =
          nextStatus === 'completed'
            ? m.steps.map((s) => ({ ...s, completed: true }))
            : m.steps;
        return { ...m, status: nextStatus, steps: updatedSteps };
      })
    );
  };

  const toggleMissionStep = (missionId: string, stepId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        const updatedSteps = m.steps.map((s) =>
          s.id === stepId ? { ...s, completed: !s.completed } : s
        );
        const allDone = updatedSteps.length > 0 && updatedSteps.every((s) => s.completed);
        return {
          ...m,
          steps: updatedSteps,
          status: allDone ? 'completed' : m.status === 'available' ? 'in_progress' : m.status,
        };
      })
    );
  };

  const addMission = (newMission: Omit<Mission, 'id'>) => {
    const id = `m_${Date.now()}`;
    setMissions((prev) => [
      {
        ...newMission,
        id,
      },
      ...prev,
    ]);
  };

  const deleteMission = (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
  };

  // Collectibles handlers
  const toggleCollectible = (id: string) => {
    setCollectibles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, collected: !c.collected } : c))
    );
  };

  const addCollectible = (item: Omit<Collectible, 'id'>) => {
    const id = `c_${Date.now()}`;
    setCollectibles((prev) => [{ ...item, id }, ...prev]);
  };

  // Vehicles handlers
  const toggleVehicleUnlocked = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, unlocked: !v.unlocked } : v))
    );
  };

  const toggleVehicleFavorite = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const id = `v_${Date.now()}`;
    setVehicles((prev) => [{ ...vehicle, id }, ...prev]);
  };

  // Objectives handlers
  const toggleObjective = (id: string) => {
    setObjectives((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const nextCompleted = !o.completed;
        return {
          ...o,
          completed: nextCompleted,
          progress: nextCompleted ? o.maxProgress : 0,
        };
      })
    );
  };

  // Notes handlers
  const addNote = (note: Omit<TacticalNote, 'id' | 'updatedAt'>) => {
    const id = `n_${Date.now()}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    setNotes((prev) => [
      {
        ...note,
        id,
        updatedAt: `Aujourd'hui, ${timeStr}`,
      },
      ...prev,
    ]);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Stats calculation
  const stats = useMemo(() => {
    const missionsDone = missions.filter((m) => m.status === 'completed').length;
    const collectiblesDone = collectibles.filter((c) => c.collected).length;
    const vehiclesUnlocked = vehicles.filter((v) => v.unlocked).length;
    const objectivesDone = objectives.filter((o) => o.completed).length;

    return {
      missionsDone,
      missionsTotal: missions.length,
      collectiblesDone,
      collectiblesTotal: collectibles.length,
      vehiclesUnlocked,
      vehiclesTotal: vehicles.length,
      objectivesDone,
      objectivesTotal: objectives.length,
    };
  }, [missions, collectibles, vehicles, objectives]);

  const overallProgress = useMemo(() => {
    const totalItems =
      stats.missionsTotal +
      stats.collectiblesTotal +
      stats.vehiclesTotal +
      stats.objectivesTotal;
    if (totalItems === 0) return 0;

    const totalDone =
      stats.missionsDone +
      stats.collectiblesDone +
      stats.vehiclesUnlocked +
      stats.objectivesDone;

    return Math.round((totalDone / totalItems) * 100);
  }, [stats]);

  const resetAllData = () => {
    setMissions(INITIAL_MISSIONS);
    setCollectibles(INITIAL_COLLECTIBLES);
    setVehicles(INITIAL_VEHICLES);
    setObjectives(INITIAL_OBJECTIVES);
    setNotes(INITIAL_NOTES);
  };

  const exportBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      profile: activeProfile,
      missions,
      collectibles,
      vehicles,
      objectives,
      notes,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gaming-companion-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.missions && parsed.collectibles) {
        if (parsed.missions) setMissions(parsed.missions);
        if (parsed.collectibles) setCollectibles(parsed.collectibles);
        if (parsed.vehicles) setVehicles(parsed.vehicles);
        if (parsed.objectives) setObjectives(parsed.objectives);
        if (parsed.notes) setNotes(parsed.notes);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <GameContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        profiles,
        activeProfile,
        setActiveProfile,
        missions,
        toggleMissionStatus,
        toggleMissionStep,
        addMission,
        deleteMission,
        collectibles,
        toggleCollectible,
        addCollectible,
        vehicles,
        toggleVehicleUnlocked,
        toggleVehicleFavorite,
        addVehicle,
        objectives,
        toggleObjective,
        notes,
        addNote,
        deleteNote,
        togglePinNote,
        sessionSeconds,
        overallProgress,
        stats,
        resetAllData,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
