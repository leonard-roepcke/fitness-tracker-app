export type WorkoutLogsByDate = {
  [dateISO: string]: {
    workoutIds: string[];
    volumes: number[];
  };
};
