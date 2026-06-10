export interface SessionSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface SessionExercise {
  exerciseId: string;
  name: string;
  trackWeight: boolean;
  trackReps: boolean;
  sets: SessionSet[];
  notes?: string;
}

export type SessionStatus = 'in_progress' | 'completed' | 'aborted';

export interface WorkoutSession {
  id: string;
  workoutId: number;
  workoutName: string;
  startedAt: number;
  completedAt: number | null;
  exercises: SessionExercise[];
  totalVolume: number;
  notes?: string;
  status: SessionStatus;
}

export type LastPerformance = {
  reps: number;
  weight: number;
  dateISO: string;
} | null;
