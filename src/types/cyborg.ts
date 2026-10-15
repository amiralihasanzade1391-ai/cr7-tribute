export interface JumpComparison {
  id: string;
  name: string;
  jumpHeight: number;
  gForce: number;
  color: string;
}

export interface RecoveryPhase {
  id: string;
  time: string;
  activity: string;
  icon: string;
  description: string;
  color: string;
}

export interface KnuckleballData {
  label: string;
  value: string;
  detail: string;
}
