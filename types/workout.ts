export interface Exercise {
    name: string;
    reps: number;
    sets: number;
}

export interface Workout {
    id: number;
    name: string;
    exercises: Exercise[];
    createdAt: number;
}
