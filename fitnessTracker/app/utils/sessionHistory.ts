import { WorkoutSession } from '../types/session';

export type GroupedSessions = {
  dateISO: string;
  sessions: WorkoutSession[];
};

export const groupSessionsByDate = (
  sessions: WorkoutSession[]
): GroupedSessions[] => {
  const groups: Record<string, WorkoutSession[]> = {};

  sessions
    .filter((s) => s.status === 'completed' || s.status === 'aborted')
    .sort((a, b) => (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt))
    .forEach((session) => {
      const dateISO = new Date(session.completedAt ?? session.startedAt)
        .toISOString()
        .split('T')[0];
      if (!groups[dateISO]) groups[dateISO] = [];
      groups[dateISO].push(session);
    });

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateISO, sessionList]) => ({ dateISO, sessions: sessionList }));
};

export const formatSessionTime = (timestamp: number, locale: string): string => {
  const localeTag = locale === 'german' ? 'de-DE' : 'en-GB';
  return new Date(timestamp).toLocaleTimeString(localeTag, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatSessionDate = (dateISO: string, locale: string): string => {
  const localeTag = locale === 'german' ? 'de-DE' : 'en-GB';
  return new Date(dateISO).toLocaleDateString(localeTag, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const formatSessionDuration = (
  startedAt: number,
  completedAt: number | null
): number => {
  if (!completedAt) return 0;
  return Math.max(1, Math.round((completedAt - startedAt) / 60000));
};
