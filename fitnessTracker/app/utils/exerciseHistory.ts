import { WorkoutSession } from '../types/session';

export type ExerciseTimelineEntry = {
  sessionId: string;
  dateISO: string;
  workoutName: string;
  sets: { reps: number; weight: number; setIndex: number }[];
  maxWeight: number;
  totalVolume: number;
};

export const buildExerciseTimeline = (
  sessions: WorkoutSession[],
  exerciseId: string
): ExerciseTimelineEntry[] => {
  return sessions
    .filter(
      (s) =>
        (s.status === 'completed' || s.status === 'aborted') &&
        s.exercises.some((ex) => ex.exerciseId === exerciseId)
    )
    .sort((a, b) => (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt))
    .map((session) => {
      const exercise = session.exercises.find((ex) => ex.exerciseId === exerciseId)!;
      const sets = exercise.sets
        .map((set, setIndex) => ({
          reps: set.reps,
          weight: set.weight,
          setIndex,
        }))
        .filter((s) => s.reps > 0 || s.weight > 0);

      const maxWeight = Math.max(0, ...sets.map((s) => s.weight));
      const totalVolume = sets.reduce((sum, s) => sum + s.reps * s.weight, 0);

      return {
        sessionId: session.id,
        dateISO: new Date(session.completedAt ?? session.startedAt)
          .toISOString()
          .split('T')[0],
        workoutName: session.workoutName,
        sets,
        maxWeight,
        totalVolume,
      };
    });
};

export const getBestSet = (
  sessions: WorkoutSession[],
  exerciseId: string
): { weight: number; reps: number } | null => {
  let best: { weight: number; reps: number } | null = null;

  sessions.forEach((session) => {
    const exercise = session.exercises.find((ex) => ex.exerciseId === exerciseId);
    if (!exercise) return;

    exercise.sets.forEach((set) => {
      if (!best || set.weight > best.weight || (set.weight === best.weight && set.reps > best.reps)) {
        best = { weight: set.weight, reps: set.reps };
      }
    });
  });

  return best;
};

export const getMaxWeightTimeline = (
  timeline: ExerciseTimelineEntry[]
): { dateISO: string; maxWeight: number }[] => {
  return [...timeline]
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
    .map((entry) => ({ dateISO: entry.dateISO, maxWeight: entry.maxWeight }));
};
