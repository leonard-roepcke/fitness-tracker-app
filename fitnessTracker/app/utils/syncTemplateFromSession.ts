import { Workout } from '../types/workout';
import { WorkoutSession } from '../types/session';

export const applySessionToWorkout = (
  workout: Workout,
  session: WorkoutSession
): Workout => {
  const exercises = workout.exercises.map((ex) => {
    const sessionEx = session.exercises.find((s) => s.exerciseId === ex.id);
    if (!sessionEx) return ex;

    return {
      ...ex,
      last_reps: sessionEx.sets.map((s) => s.reps),
      last_weight: sessionEx.sets.map((s) => s.weight),
    };
  });

  return {
    ...workout,
    exercises,
    notes: session.notes ?? workout.notes,
    updatedAt: Date.now(),
  };
};
