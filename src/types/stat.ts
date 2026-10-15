export interface CareerStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon: string;
  color?: string;
  description: string;
}

export interface MilestoneGoal {
  id: string;
  opponent: string;
  minute: string;
  competition: string;
  date: string;
  description: string;
  isIconic: boolean;
  youtubeId?: string;
  goalType: "rightFoot" | "leftFoot" | "header" | "freeKick" | "penalty" | "other";
}

export interface GoalBreakdownItem {
  id: string;
  label: string;
  percentage: number;
  count: number;
  color: string;
  barGradient: string;
  icon: string;
  iconicGoals: MilestoneGoal[];
}

export interface MilestoneRingTick {
  milestone: number;
  year: string;
  opponent: string;
  angle: number; // in degrees for circular positioning
}
