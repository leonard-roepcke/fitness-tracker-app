import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { WorkoutLogsByDate } from "../app/types/workoutLogs";
import { Workout } from "./WorkoutContext";

const STORAGE_KEY_WORKOUTS = "@workout_logs_by_date";
const STORAGE_KEY_CALORIES = "@calory_entries";

// -------------------- TYPES --------------------
export interface CaloryEntry {
  id: number;
  date: number; // timestamp
  calorys: number;
}

type CalorysByDate = {
  [dateISO: string]: CaloryEntry[];
};

export type WorkoutLogMatch = {
  dateISO: string;
  index: number;
  volume: number;
};

type TrackerContextType = {
  // Workouts
  workoutLogs: WorkoutLogsByDate;
  logWorkout: (workout: Workout) => Promise<void>;
  removeLog: (dateISO: string, index?: number) => Promise<void>;
  clearAllLogs: () => Promise<void>;
  getDailyStreak: () => number;
  getWeeklyStreak: () => number;
  showWorkoutsById: (workoutId: string | number) => WorkoutLogMatch[];

  // Calories
  calorys: CalorysByDate;
  addCaloryEntry: (entry: Omit<CaloryEntry, "id">) => Promise<void>;
  updateCaloryEntry: (id: number, calorys: number) => Promise<void>;
  removeCaloryEntry: (id: number) => Promise<void>;
  getCaloriesForDate: (dateISO: string) => CaloryEntry[];
  getTotalCaloriesForDate: (dateISO: string) => number;
  clearAllCalories: () => Promise<void>;
};

// -------------------- CONTEXT --------------------
const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

// -------------------- PROVIDER --------------------
export const TrackerProvider = ({ children }: { children: ReactNode }) => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogsByDate>({});
  const [calorys, setCalorys] = useState<CalorysByDate>({});

  // -------------------- LOAD DATA --------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const workoutJson = await AsyncStorage.getItem(STORAGE_KEY_WORKOUTS);
        if (workoutJson) setWorkoutLogs(JSON.parse(workoutJson));

        const caloriesJson = await AsyncStorage.getItem(STORAGE_KEY_CALORIES);
        if (caloriesJson) setCalorys(JSON.parse(caloriesJson));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  const saveWorkouts = async (logs: WorkoutLogsByDate) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_WORKOUTS,
        JSON.stringify(logs)
      );
    } catch (e) {
      console.error("Failed to save workout logs", e);
    }
  };

  const saveCalories = async (calories: CalorysByDate) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_CALORIES,
        JSON.stringify(calories)
      );
    } catch (e) {
      console.error("Failed to save calories", e);
    }
  };

  // ==================== WORKOUT FUNCTIONS ====================

  const showWorkoutsById = (
    workoutId: string | number
  ): WorkoutLogMatch[] => {
    const id = workoutId.toString();
    const result: WorkoutLogMatch[] = [];

    Object.entries(workoutLogs).forEach(([dateISO, day]) => {
      day.workoutIds.forEach((storedId, index) => {
        if (storedId === id) {
          result.push({
            dateISO,
            index,
            volume: day.volumes[index] ?? 0,
          });
        }
      });
    });

    return result;
  };

  const logWorkout = async (workout: Workout) => {
    const today = new Date().toISOString().split("T")[0];

    let totalVolume = 0;
    workout.exercises.forEach((ex) => {
      if (ex.last_weight && ex.last_reps) {
        ex.last_weight.forEach((w, i) => {
          const r = ex.last_reps![i] ?? 0;
          totalVolume += w * r;
        });
      }
    });

    const updatedLogs: WorkoutLogsByDate = {
      ...workoutLogs,
    };

    if (!updatedLogs[today]) {
      updatedLogs[today] = { workoutIds: [], volumes: [] };
    }

    updatedLogs[today].workoutIds.push(workout.id.toString());
    updatedLogs[today].volumes.push(totalVolume);

    setWorkoutLogs(updatedLogs);
    await saveWorkouts(updatedLogs);
  };

  const removeLog = async (dateISO: string, index?: number) => {
    setWorkoutLogs((prev) => {
      const day = prev[dateISO];
      if (!day) return prev;

      const updated = { ...prev };

      if (index === undefined) {
        delete updated[dateISO];
      } else {
        updated[dateISO] = {
          workoutIds: day.workoutIds.filter((_, i) => i !== index),
          volumes: day.volumes.filter((_, i) => i !== index),
        };

        if (updated[dateISO].workoutIds.length === 0) {
          delete updated[dateISO];
        }
      }

      saveWorkouts(updated);
      return updated;
    });
  };

  const clearAllLogs = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY_WORKOUTS);
    setWorkoutLogs({});
  };

  const getDailyStreak = (): number => {
    const dates = Object.keys(workoutLogs).sort();
    let streak = 0;
    const today = new Date();

    for (let i = dates.length - 1; i >= 0; i--) {
      const d = new Date(dates[i]);
      const diff = Math.floor(
        (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diff === streak) streak++;
      else break;
    }
    return streak;
  };

  const getWeeklyStreak = (): number => {
    const weeks = new Set<string>();

    Object.keys(workoutLogs).forEach((dateISO) => {
      const d = new Date(dateISO);
      const year = d.getFullYear();
      const week = Math.ceil(
        ((d.getTime() - new Date(year, 0, 1).getTime()) /
          (1000 * 60 * 60 * 24) +
          1) /
          7
      );
      weeks.add(`${year}-${week}`);
    });

    const sorted = Array.from(weeks).sort();
    let streak = 0;

    const now = new Date();
    const currentWeek = Math.ceil(
      ((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) /
        (1000 * 60 * 60 * 24) +
        1) /
        7
    );

    for (let i = sorted.length - 1; i >= 0; i--) {
      const [, weekStr] = sorted[i].split("-");
      if (parseInt(weekStr, 10) === currentWeek - streak) streak++;
      else break;
    }

    return streak;
  };

  // ==================== CALORIE FUNCTIONS ====================

  const addCaloryEntry = async (entry: Omit<CaloryEntry, "id">) => {
    const dateISO = new Date(entry.date).toISOString().split("T")[0];
    const newEntry: CaloryEntry = { ...entry, id: Date.now() };

    const updated = { ...calorys };
    if (!updated[dateISO]) updated[dateISO] = [];
    updated[dateISO].push(newEntry);

    setCalorys(updated);
    await saveCalories(updated);
  };

  const updateCaloryEntry = async (id: number, newCalories: number) => {
    const updated = { ...calorys };

    for (const dateISO in updated) {
      const idx = updated[dateISO].findIndex((e) => e.id === id);
      if (idx !== -1) {
        updated[dateISO][idx].calorys = newCalories;
        setCalorys(updated);
        await saveCalories(updated);
        return;
      }
    }
  };

  const removeCaloryEntry = async (id: number) => {
    const updated = { ...calorys };

    for (const dateISO in updated) {
      const filtered = updated[dateISO].filter((e) => e.id !== id);
      if (filtered.length !== updated[dateISO].length) {
        if (filtered.length === 0) delete updated[dateISO];
        else updated[dateISO] = filtered;
        break;
      }
    }

    setCalorys(updated);
    await saveCalories(updated);
  };

  const getCaloriesForDate = (dateISO: string): CaloryEntry[] =>
    calorys[dateISO] || [];

  const getTotalCaloriesForDate = (dateISO: string): number =>
    (calorys[dateISO] || []).reduce(
      (sum, entry) => sum + entry.calorys,
      0
    );

  const clearAllCalories = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY_CALORIES);
    setCalorys({});
  };

  return (
    <TrackerContext.Provider
      value={{
        workoutLogs,
        logWorkout,
        removeLog,
        clearAllLogs,
        getDailyStreak,
        getWeeklyStreak,
        showWorkoutsById,
        calorys,
        addCaloryEntry,
        updateCaloryEntry,
        removeCaloryEntry,
        getCaloriesForDate,
        getTotalCaloriesForDate,
        clearAllCalories,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

// -------------------- HOOK --------------------
export const useTracker = () => {
  const ctx = useContext(TrackerContext);
  if (!ctx) {
    throw new Error("useTracker must be used inside TrackerProvider");
  }
  return ctx;
};
