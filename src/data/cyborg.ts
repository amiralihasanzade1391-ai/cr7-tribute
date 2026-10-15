import { JumpComparison, RecoveryPhase, KnuckleballData } from "@/types/cyborg";

export const JUMP_COMPARISONS: JumpComparison[] = [
  { id: "average", name: "Average Human", jumpHeight: 0.5, gForce: 1.5, color: "#6B7280" },
  { id: "athlete", name: "Pro Athlete", jumpHeight: 0.8, gForce: 2.8, color: "#3B82F6" },
  { id: "nba", name: "NBA Player", jumpHeight: 1.1, gForce: 3.5, color: "#8B5CF6" },
  { id: "ronaldo", name: "Cristiano Ronaldo", jumpHeight: 2.56, gForce: 5.0, color: "#FEBE10" },
];

export const KNUCKLEBALL_DATA: KnuckleballData[] = [
  { label: "Ball Speed", value: "105 km/h", detail: "Reached in 0.4 seconds from 40 yards" },
  { label: "Rotation", value: "~0 RPM", detail: "Zero spin eliminates Magnus lift" },
  { label: "Drop Point", value: "Last 0.3s", detail: "Erratic dip fools even world-class keepers" },
  { label: "Margin", value: "15 cm", detail: "Deviation from a standard curveball trajectory" },
];

export const RECOVERY_PHASES: RecoveryPhase[] = [
  { id: "sleep1", time: "22:00", activity: "First Sleep Block", icon: "🌙", description: "5 REM cycles in pitch-dark cryo-chamber at 18°C", color: "#6366F1" },
  { id: "cryo", time: "02:00", activity: "Cryotherapy", icon: "❄️", description: "-160°C for 3 minutes to reduce inflammation", color: "#06B6D4" },
  { id: "sleep2", time: "03:00", activity: "Second Sleep Block", icon: "🌙", description: "Deep sleep phase for muscle protein synthesis", color: "#6366F1" },
  { id: "train1", time: "06:00", activity: "Morning Training", icon: "🏋️", description: "Strength work: 200kg squats, explosive plyometrics", color: "#EF4444" },
  { id: "nutrition", time: "09:00", activity: "Precision Nutrition", icon: "🥗", description: "7 meals daily: 3200 kcal, 7% body fat maintained", color: "#10B981" },
  { id: "pool", time: "12:00", activity: "Hydrotherapy", icon: "🏊", description: "Cold-water pool session for active recovery", color: "#06B6D4" },
  { id: "nap", time: "14:00", activity: "Power Nap", icon: "😴", description: "90-minute polyphasic nap", color: "#6366F1" },
  { id: "train2", time: "17:00", activity: "Evening Training", icon: "⚽", description: "Technical drills: 500 shots, 200 headers", color: "#EF4444" },
];
