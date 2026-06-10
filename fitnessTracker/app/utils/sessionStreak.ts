import { WorkoutSession } from '../types/session';
import { WorkoutLogMatch } from '@/context/TrackerContext';
import { VolumeHistoryEntry } from './workoutVolume';

export const sessionsToVolumeHistory = (
  sessions: WorkoutSession[],
  workoutId: number,
  maxBars = 14
): VolumeHistoryEntry[] => {
  return sessions
    .filter((s) => s.workoutId === workoutId && s.status === 'completed')
    .sort((a, b) => (a.completedAt ?? 0) - (b.completedAt ?? 0))
    .slice(-maxBars)
    .map((s, index) => ({
      dateISO: new Date(s.completedAt ?? s.startedAt).toISOString().split('T')[0],
      volume: s.totalVolume,
      index,
    }));
};

export const mergeVolumeHistory = (
  sessionEntries: VolumeHistoryEntry[],
  legacyMatches: WorkoutLogMatch[]
): VolumeHistoryEntry[] => {
  const legacyEntries: VolumeHistoryEntry[] = legacyMatches.map((m) => ({
    dateISO: m.dateISO,
    volume: m.volume,
    index: m.index,
  }));

  const combined = [...legacyEntries, ...sessionEntries];
  const seen = new Set<string>();
  const unique = combined.filter((e) => {
    const key = `${e.dateISO}-${e.volume}-${e.index}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO) || a.index - b.index)
    .slice(-14);
};

export const getSessionDates = (sessions: WorkoutSession[]): string[] => {
  const dates = new Set<string>();
  sessions
    .filter((s) => s.status === 'completed')
    .forEach((s) => {
      const dateISO = new Date(s.completedAt ?? s.startedAt)
        .toISOString()
        .split('T')[0];
      dates.add(dateISO);
    });
  return Array.from(dates).sort();
};

export const getDailyStreakFromSessions = (sessions: WorkoutSession[]): number => {
  const dates = getSessionDates(sessions).sort().reverse();
  if (dates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - streak);
    const expectedISO = expected.toISOString().split('T')[0];

    if (dates.includes(expectedISO)) {
      streak++;
    } else if (i === 0 && streak === 0) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayISO = yesterday.toISOString().split('T')[0];
      if (dates.includes(yesterdayISO)) {
        streak = 1;
        continue;
      }
      break;
    } else {
      break;
    }
  }
  return streak;
};

export const getWeeklyStreakFromSessions = (sessions: WorkoutSession[]): number => {
  const weekKeys = new Set<string>();
  sessions
    .filter((s) => s.status === 'completed')
    .forEach((s) => {
      const d = new Date(s.completedAt ?? s.startedAt);
      const year = d.getFullYear();
      const week = getWeekNumber(d);
      weekKeys.add(`${year}-${week}`);
    });

  const sorted = Array.from(weekKeys).sort();
  if (sorted.length === 0) return 0;

  let streak = 0;
  const now = new Date();
  const currentWeek = getWeekNumber(now);
  const currentYear = now.getFullYear();

  for (let i = sorted.length - 1; i >= 0; i--) {
    const [yearStr, weekStr] = sorted[i].split('-');
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);

    const expectedWeek = currentWeek - streak;
    const expectedYear = currentYear;

    if (year === expectedYear && week === expectedWeek) {
      streak++;
    } else if (streak === 0 && year === expectedYear && week === expectedWeek - 1) {
      streak = 1;
    } else {
      break;
    }
  }
  return streak;
};

const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};
