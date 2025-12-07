import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
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

type TrackerContextType = {
  // Workouts
  workoutLogs: WorkoutLogsByDate;
  logWorkout: (workout: Workout) => Promise<void>;
  removeLog: (dateISO: string, index?: number) => Promise<void>;
  clearAllLogs: () => Promise<void>;
  getDailyStreak: () => number;
  getWeeklyStreak: () => number;
  
  // Calories
  calorys: CalorysByDate;
  addCaloryEntry: (entry: Omit<CaloryEntry, 'id'>) => Promise<void>;
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

  // --- Load Data from AsyncStorage ---
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load workouts
        const workoutJson = await AsyncStorage.getItem(STORAGE_KEY_WORKOUTS);
        if (workoutJson) setWorkoutLogs(JSON.parse(workoutJson));

        // Load calories
        const caloriesJson = await AsyncStorage.getItem(STORAGE_KEY_CALORIES);
        if (caloriesJson) setCalorys(JSON.parse(caloriesJson));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  // --- Save Workouts to AsyncStorage ---
  const saveWorkouts = async (logs: WorkoutLogsByDate) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_WORKOUTS, JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to save workout logs", e);
    }
  };

  // --- Save Calories to AsyncStorage ---
  const saveCalories = async (calories: CalorysByDate) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_CALORIES, JSON.stringify(calories));
    } catch (e) {
      console.error("Failed to save calories", e);
    }
  };

  // ==================== WORKOUT FUNCTIONS ====================

  const logWorkout = async (workout: Workout) => {
    const today = new Date().toISOString().split("T")[0];

    let totalVolume = 0;
    workout.exercises.forEach(ex => {
      if (ex.last_weight && ex.last_reps) {
        ex.last_weight.forEach((w, i) => {
          const r = ex.last_reps![i] ?? 0;
          totalVolume += w * r;
        });
      }
    });

    const updatedLogs = { ...workoutLogs };
    if (!updatedLogs[today]) {
      updatedLogs[today] = { workoutIds: [], volumes: [] };
    }

    updatedLogs[today].workoutIds.push(workout.id.toString());
    updatedLogs[today].volumes.push(totalVolume);

    setWorkoutLogs(updatedLogs);
    await saveWorkouts(updatedLogs);
  };

  const removeLog = async (dateISO: string, index?: number) => {
    setWorkoutLogs(prev => {
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
    const dates = Object.keys(workoutLogs).sort((a, b) => (a > b ? 1 : -1));
    let streak = 0;
    let current = new Date();
    for (let i = dates.length - 1; i >= 0; i--) {
      const logDate = new Date(dates[i]);
      const diff = Math.floor((current.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === streak) {
        streak++;
      } else if (diff > streak) {
        break;
      }
    }
    return streak;
  };

  const getWeeklyStreak = (): number => {
    const weeks: Set<string> = new Set();
    Object.keys(workoutLogs).forEach(dateISO => {
      const d = new Date(dateISO);
      const year = d.getFullYear();
      const week = Math.ceil(
        ((d.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24) + 1) / 7
      );
      weeks.add(`${year}-${week}`);
    });

    const sortedWeeks = Array.from(weeks).sort();
    let streak = 0;
    let currentWeek = Math.ceil(
      ((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24) + 1) / 7
    );
    for (let i = sortedWeeks.length - 1; i >= 0; i--) {
      const [year, weekStr] = sortedWeeks[i].split("-");
      const weekNum = parseInt(weekStr, 10);
      if (weekNum === currentWeek - streak) streak++;
      else break;
    }
    return streak;
  };

  // ==================== CALORIE FUNCTIONS ====================

  const addCaloryEntry = async (entry: Omit<CaloryEntry, 'id'>) => {
    const dateISO = new Date(entry.date).toISOString().split("T")[0];
    const newId = Date.now(); // Einfache ID-Generierung
    
    const newEntry: CaloryEntry = {
      ...entry,
      id: newId,
    };

    const updatedCalories = { ...calorys };
    if (!updatedCalories[dateISO]) {
      updatedCalories[dateISO] = [];
    }
    updatedCalories[dateISO].push(newEntry);

    setCalorys(updatedCalories);
    await saveCalories(updatedCalories);
  };

  const updateCaloryEntry = async (id: number, newCalories: number) => {
    const updatedCalories = { ...calorys };
    let found = false;

    for (const dateISO in updatedCalories) {
      const entries = updatedCalories[dateISO];
      const index = entries.findIndex(e => e.id === id);
      if (index !== -1) {
        updatedCalories[dateISO][index].calorys = newCalories;
        found = true;
        break;
      }
    }

    if (found) {
      setCalorys(updatedCalories);
      await saveCalories(updatedCalories);
    }
  };

  const removeCaloryEntry = async (id: number) => {
    const updatedCalories = { ...calorys };

    for (const dateISO in updatedCalories) {
      const entries = updatedCalories[dateISO];
      const filtered = entries.filter(e => e.id !== id);
      
      if (filtered.length !== entries.length) {
        if (filtered.length === 0) {
          delete updatedCalories[dateISO];
        } else {
          updatedCalories[dateISO] = filtered;
        }
        break;
      }
    }

    setCalorys(updatedCalories);
    await saveCalories(updatedCalories);
  };

  const getCaloriesForDate = (dateISO: string): CaloryEntry[] => {
    return calorys[dateISO] || [];
  };

  const getTotalCaloriesForDate = (dateISO: string): number => {
    const entries = calorys[dateISO] || [];
    return entries.reduce((sum, entry) => sum + entry.calorys, 0);
  };

  const clearAllCalories = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY_CALORIES);
    setCalorys({});
  };

  return (
    <TrackerContext.Provider
      value={{
        // Workouts
        workoutLogs,
        logWorkout,
        removeLog,
        clearAllLogs,
        getDailyStreak,
        getWeeklyStreak,
        // Calories
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

// --- HOOK ---
export const useTracker = () => {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be used inside TrackerProvider");
  return ctx;
};