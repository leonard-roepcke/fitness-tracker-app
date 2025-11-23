export interface Exercise {
  name: string;
  sets: number;
  last_reps: number[];
  // Historical code used both `last_weights` and `last_weight` (typo).
  // Accept both to remain compatible with existing usage.
  last_weights?: number[];
  last_weight?: number[];
}

export interface Workout {
  id: number;
  name: string;
  exercises: Exercise[];
  // Some places set `createdAt`, others omit it when creating new items.
  createdAt?: number;
}

