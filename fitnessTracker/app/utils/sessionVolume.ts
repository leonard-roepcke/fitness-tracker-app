import { SessionExercise, WorkoutSession } from '../types/session';

export const calcSessionVolume = (exercises: SessionExercise[]): number => {
  let total = 0;
  exercises.forEach((ex) => {
    ex.sets.forEach((set) => {
      if (set.completed || set.reps > 0 || set.weight > 0) {
        total += set.weight * set.reps;
      }
    });
  });
  return total;
};

export const calcSessionVolumeFromSession = (session: WorkoutSession): number =>
  calcSessionVolume(session.exercises);
