export interface Exercise {
  name: string;
  sets: number;
  last_reps: number[];
  last_weight?: number[];
  trackWeight?: boolean;
  trackReps?: boolean;
  notes?: string;
}

export interface Workout {
  id: number;
  name: string;
  exercises: Exercise[];
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
  isFavorite?: boolean;
}
