import { WorkoutLogMatch } from '@/context/TrackerContext';
import { Workout } from '@/context/WorkoutContext';

export type VolumeHistoryEntry = {
  dateISO: string;
  volume: number;
  index: number;
};

export const sortWorkoutLogMatches = (matches: WorkoutLogMatch[]) =>
  [...matches].sort(
    (a, b) => a.dateISO.localeCompare(b.dateISO) || a.index - b.index
  );

export const calcTotalVolume = (workout: Workout) => {
  let total = 0;
  workout.exercises.forEach((ex) => {
    if (ex.last_weight && ex.last_reps) {
      ex.last_weight.forEach((w, i) => {
        total += w * (ex.last_reps[i] ?? 0);
      });
    }
  });
  return total;
};

export const getWorkoutVolumeHistory = (
  matches: WorkoutLogMatch[],
  maxBars = 8
): VolumeHistoryEntry[] => {
  return sortWorkoutLogMatches(matches)
    .slice(-maxBars)
    .map((match) => ({
      dateISO: match.dateISO,
      volume: match.volume,
      index: match.index,
    }));
};

export const formatVolumeDate = (dateISO: string, locale: string) => {
  const localeTag = locale === 'german' ? 'de-DE' : 'en-GB';
  return new Date(dateISO).toLocaleDateString(localeTag, {
    day: '2-digit',
    month: '2-digit',
  });
};
