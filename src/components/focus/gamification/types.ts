
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export interface GamificationData {
  id: string;
  points_earned: number;
  streak_count: number;
  level: number;
  achievements: Achievement[];
  daily_challenges: Challenge[];
}

export interface RawGamificationData {
  id: string;
  points_earned: number | null;
  streak_count: number | null;
  level: number | null;
  achievements: any;
  daily_challenges: any;
}
