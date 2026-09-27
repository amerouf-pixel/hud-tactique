export type TabType = 'home' | 'missions' | 'collectibles' | 'vehicles' | 'objectives' | 'notes' | 'stats';

export type MissionType = 'main' | 'side' | 'bounty' | 'activity';
export type MissionStatus = 'available' | 'in_progress' | 'completed';

export interface MissionStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface Mission {
  id: string;
  title: string;
  type: MissionType;
  district: string;
  giver: string;
  description: string;
  rewardXp: number;
  rewardCredits: number;
  status: MissionStatus;
  steps: MissionStep[];
  priority?: boolean;
}

export type CollectibleCategory = 'relic' | 'cache' | 'audio_log' | 'blueprint' | 'easter_egg';

export interface Collectible {
  id: string;
  name: string;
  category: CollectibleCategory;
  district: string;
  hint: string;
  collected: boolean;
  coordinates?: string;
}

export type VehicleCategory = 'sport' | 'muscle' | 'moto' | 'offroad' | 'heavy';

export interface Vehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  manufacturer: string;
  speed: number; // 0-100
  handling: number; // 0-100
  armor: number; // 0-100
  unlocked: boolean;
  location: string;
  isFavorite?: boolean;
  notes?: string;
}

export type ObjectiveTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Objective {
  id: string;
  title: string;
  description: string;
  tier: ObjectiveTier;
  progress: number;
  maxProgress: number;
  completed: boolean;
  category: string;
}

export interface TacticalNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  updatedAt: string;
}

export interface GameProfile {
  id: string;
  name: string;
  universe: string;
  playerTag: string;
  avatarIcon: string;
}
