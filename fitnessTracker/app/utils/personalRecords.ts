import { WorkoutSession } from '../types/session';

export type PRCheckResult = {
  isWeightPR: boolean;
  isVolumePR: boolean;
  isRepsPR: boolean;
};

export const getHistoricalBestForExercise = (
  sessions: WorkoutSession[],
  exerciseId: string,
  excludeSessionId?: string
): { maxWeight: number; maxReps: number; maxSetVolume: number } => {
  let maxWeight = 0;
  let maxReps = 0;
  let maxSetVolume = 0;

  sessions
    .filter(
      (s) =>
        s.status === 'completed' &&
        s.id !== excludeSessionId &&
        s.exercises.some((ex) => ex.exerciseId === exerciseId)
    )
    .forEach((session) => {
      const exercise = session.exercises.find((ex) => ex.exerciseId === exerciseId);
      if (!exercise) return;

      exercise.sets.forEach((set) => {
        if (set.weight > maxWeight) maxWeight = set.weight;
        if (set.reps > maxReps) maxReps = set.reps;
        const vol = set.weight * set.reps;
        if (vol > maxSetVolume) maxSetVolume = vol;
      });
    });

  return { maxWeight, maxReps, maxSetVolume };
};

export const checkSetForPR = (
  sessions: WorkoutSession[],
  exerciseId: string,
  weight: number,
  reps: number,
  excludeSessionId?: string
): PRCheckResult => {
  const { maxWeight, maxReps, maxSetVolume } = getHistoricalBestForExercise(
    sessions,
    exerciseId,
    excludeSessionId
  );

  const setVolume = weight * reps;

  return {
    isWeightPR: weight > 0 && weight > maxWeight,
    isRepsPR: reps > 0 && reps > maxReps && weight <= maxWeight,
    isVolumePR: setVolume > 0 && setVolume > maxSetVolume,
  };
};

export const countSessionPRs = (
  session: WorkoutSession,
  allSessions: WorkoutSession[]
): number => {
  let count = 0;

  session.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (!set.completed && set.reps === 0 && set.weight === 0) return;
      const pr = checkSetForPR(
        allSessions,
        exercise.exerciseId,
        set.weight,
        set.reps,
        session.id
      );
      if (pr.isWeightPR || pr.isVolumePR) count++;
    });
  });

  return count;
};

export const isSetPR = (
  sessions: WorkoutSession[],
  exerciseId: string,
  weight: number,
  reps: number,
  excludeSessionId?: string
): boolean => {
  const pr = checkSetForPR(sessions, exerciseId, weight, reps, excludeSessionId);
  return pr.isWeightPR || pr.isVolumePR;
};
