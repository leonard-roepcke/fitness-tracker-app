export interface Exercise {
  id: string;                 // spätere Skalierung
  name: string;
  sets: number;
  last_reps: number[];
  notes?: string;

  // Einheitliche interne Repräsentation
  weights?: number[];          // neues Feld, empfohlen
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: number;
  updatedAt?: number;
  isFavorite?: boolean;
}
