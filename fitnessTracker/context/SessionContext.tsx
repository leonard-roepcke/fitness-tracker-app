import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  LastPerformance,
  SessionExercise,
  SessionSet,
  WorkoutSession,
} from '../app/types/session';
import { Workout } from '../app/types/workout';
import {
  calcSessionVolume,
  calcSessionVolumeFromSession,
} from '../app/utils/sessionVolume';

const STORAGE_KEY = '@workout_sessions';

type SessionContextType = {
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  isLoaded: boolean;
  startSession: (workout: Workout) => WorkoutSession;
  updateSessionSet: (
    sessionId: string,
    exerciseId: string,
    setIndex: number,
    data: Partial<SessionSet>
  ) => void;
  updateSessionNotes: (sessionId: string, notes: string) => void;
  completeSession: (sessionId: string) => Promise<WorkoutSession | null>;
  abortSession: (sessionId: string, savePartial?: boolean) => Promise<void>;
  getSessions: () => WorkoutSession[];
  getSessionsByDate: (dateISO: string) => WorkoutSession[];
  getSessionsByWorkoutId: (workoutId: number) => WorkoutSession[];
  getCompletedSessions: () => WorkoutSession[];
  getExerciseHistory: (exerciseId: string) => WorkoutSession[];
  getLastPerformance: (
    workoutId: number,
    exerciseId: string,
    setIndex: number
  ) => LastPerformance;
  deleteSession: (id: string) => Promise<void>;
  clearAllSessions: () => Promise<void>;
  getSessionById: (id: string) => WorkoutSession | undefined;
  discardActiveSession: (sessionId: string) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const buildSessionFromWorkout = (workout: Workout): WorkoutSession => {
  const exercises: SessionExercise[] = workout.exercises.map((ex) => {
    const sets: SessionSet[] = Array.from({ length: ex.sets }, (_, i) => ({
      reps: ex.last_reps?.[i] ?? 0,
      weight: ex.last_weight?.[i] ?? 0,
      completed: false,
    }));

    return {
      exerciseId: ex.id ?? uuidv4(),
      name: ex.name,
      trackWeight: ex.trackWeight !== false,
      trackReps: ex.trackReps !== false,
      sets,
      notes: ex.notes,
    };
  });

  return {
    id: uuidv4(),
    workoutId: workout.id,
    workoutName: workout.name,
    startedAt: Date.now(),
    completedAt: null,
    exercises,
    totalVolume: 0,
    notes: workout.notes,
    status: 'in_progress',
  };
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          setSessions(JSON.parse(data));
        }
      } catch (e) {
        console.error('Failed to load sessions', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const persistSessions = async (updated: WorkoutSession[]) => {
    setSessions(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const startSession = useCallback((workout: Workout): WorkoutSession => {
    const session = buildSessionFromWorkout(workout);
    setActiveSession(session);
    return session;
  }, []);

  const updateSessionInState = useCallback(
    (sessionId: string, updater: (s: WorkoutSession) => WorkoutSession) => {
      setActiveSession((prev) => {
        if (!prev || prev.id !== sessionId) return prev;
        const updated = updater(prev);
        updated.totalVolume = calcSessionVolumeFromSession(updated);
        return updated;
      });
    },
    []
  );

  const updateSessionSet = useCallback(
    (
      sessionId: string,
      exerciseId: string,
      setIndex: number,
      data: Partial<SessionSet>
    ) => {
      updateSessionInState(sessionId, (session) => ({
        ...session,
        exercises: session.exercises.map((ex) => {
          if (ex.exerciseId !== exerciseId) return ex;
          const sets = ex.sets.map((set, i) =>
            i === setIndex ? { ...set, ...data } : set
          );
          return { ...ex, sets };
        }),
      }));
    },
    [updateSessionInState]
  );

  const updateSessionNotes = useCallback(
    (sessionId: string, notes: string) => {
      updateSessionInState(sessionId, (session) => ({ ...session, notes }));
    },
    [updateSessionInState]
  );

  const completeSession = useCallback(
    async (sessionId: string): Promise<WorkoutSession | null> => {
      const fromActive = activeSession?.id === sessionId ? activeSession : null;
      const fromStore = sessions.find((s) => s.id === sessionId);
      const source = fromActive ?? fromStore ?? null;
      if (!source) return null;

      const completed: WorkoutSession = {
        ...source,
        status: 'completed',
        completedAt: Date.now(),
        totalVolume: calcSessionVolume(source.exercises),
      };

      if (fromActive) {
        setActiveSession(null);
      }

      const withoutDuplicate = sessions.filter((s) => s.id !== sessionId);
      await persistSessions([...withoutDuplicate, completed]);
      return completed;
    },
    [sessions, activeSession]
  );

  const abortSession = useCallback(
    async (sessionId: string, savePartial = false) => {
      const fromActive = activeSession?.id === sessionId ? activeSession : null;
      if (!fromActive) return;

      if (savePartial) {
        const aborted: WorkoutSession = {
          ...fromActive,
          status: 'aborted',
          completedAt: Date.now(),
          totalVolume: calcSessionVolume(fromActive.exercises),
        };
        await persistSessions([
          ...sessions.filter((s) => s.id !== sessionId),
          aborted,
        ]);
      }

      setActiveSession(null);
    },
    [sessions, activeSession]
  );

  const discardActiveSession = useCallback((sessionId: string) => {
    setActiveSession((prev) => (prev?.id === sessionId ? null : prev));
  }, []);

  const getSessions = useCallback(() => sessions, [sessions]);

  const getCompletedSessions = useCallback(
    () =>
      sessions
        .filter((s) => s.status === 'completed')
        .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0)),
    [sessions]
  );

  const getSessionsByDate = useCallback(
    (dateISO: string) =>
      sessions.filter((s) => {
        const ts = s.completedAt ?? s.startedAt;
        return new Date(ts).toISOString().split('T')[0] === dateISO;
      }),
    [sessions]
  );

  const getSessionsByWorkoutId = useCallback(
    (workoutId: number) =>
      sessions
        .filter((s) => s.workoutId === workoutId && s.status === 'completed')
        .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0)),
    [sessions]
  );

  const getExerciseHistory = useCallback(
    (exerciseId: string) =>
      sessions
        .filter(
          (s) =>
            s.status === 'completed' &&
            s.exercises.some((ex) => ex.exerciseId === exerciseId)
        )
        .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0)),
    [sessions]
  );

  const getLastPerformance = useCallback(
    (workoutId: number, exerciseId: string, setIndex: number): LastPerformance => {
      const pastSessions = sessions
        .filter(
          (s) =>
            s.workoutId === workoutId &&
            s.status === 'completed' &&
            s.exercises.some((ex) => ex.exerciseId === exerciseId)
        )
        .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

      for (const session of pastSessions) {
        const exercise = session.exercises.find((ex) => ex.exerciseId === exerciseId);
        const set = exercise?.sets[setIndex];
        if (set && set.completed) {
          const dateISO = new Date(session.completedAt ?? session.startedAt)
            .toISOString()
            .split('T')[0];
          return { reps: set.reps, weight: set.weight, dateISO };
        }
      }
      return null;
    },
    [sessions]
  );

  const deleteSession = useCallback(
    async (id: string) => {
      await persistSessions(sessions.filter((s) => s.id !== id));
      setActiveSession((prev) => (prev?.id === id ? null : prev));
    },
    [sessions]
  );

  const clearAllSessions = useCallback(async () => {
    setSessions([]);
    setActiveSession(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const getSessionById = useCallback(
    (id: string) => {
      if (activeSession?.id === id) return activeSession;
      return sessions.find((s) => s.id === id);
    },
    [activeSession, sessions]
  );

  return (
    <SessionContext.Provider
      value={{
        sessions,
        activeSession,
        isLoaded,
        startSession,
        updateSessionSet,
        updateSessionNotes,
        completeSession,
        abortSession,
        getSessions,
        getSessionsByDate,
        getSessionsByWorkoutId,
        getCompletedSessions,
        getExerciseHistory,
        getLastPerformance,
        deleteSession,
        clearAllSessions,
        getSessionById,
        discardActiveSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSessions must be used inside SessionProvider');
  }
  return ctx;
};
