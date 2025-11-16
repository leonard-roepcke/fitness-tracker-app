export interface Exercise {
    name: string;
    sets: number;
    last_reps: number[];
    last_weights: number[];

    i_set?: number;
}

export interface Workout {
    id: number;
    name: string;
    exercises: Exercise[];
    createdAt: number;

    i_exercise: Exercise;
}
