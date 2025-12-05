import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { WorkoutLogsByDate } from "../app/types/tracker";
import { Workout } from "./WorkoutContext"; // Typ aus deinem WorkoutContext

const STORAGE_KEY = "@workout_logs_by_date";

// -------------------- TYPES --------------------
type TrackerContextType = {
  workoutLogs: WorkoutLogsByDate;
  logWorkout: (workout: Workout) => Promise<void>;
  removeLog: (dateISO: string, index?: number) => Promise<void>;
  clearAllLogs: () => Promise<void>;
  getDailyStreak: () => number;
  getWeeklyStreak: () => number;
};

// -------------------- CONTEXT --------------------
const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

// -------------------- PROVIDER --------------------
export const TrackerProvider = ({ children }: { children: ReactNode }) => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogsByDate>({});

  // --- Load Logs from AsyncStorage ---
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setWorkoutLogs(JSON.parse(json));
      } catch (e) {
        console.error("Failed to load workout logs", e);
      }
    };
    loadLogs();
  }, []);

  // --- Save Logs to AsyncStorage ---
  const saveLogs = async (logs: WorkoutLogsByDate) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to save workout logs", e);
    }
  };

  // --- Log a Workout ---
  const logWorkout = async (workout: Workout) => {
    const today = new Date().toISOString().split("T")[0];

    // Berechne Gesamtvolumen des Workouts
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
    await saveLogs(updatedLogs);
  };

  // --- Remove a log (optionally by index) ---
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

      saveLogs(updated);
      return updated;
    });
  };

  // --- Clear all logs ---
  const clearAllLogs = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setWorkoutLogs({});
  };

  // --- Daily Streak (consecutive days with workouts) ---
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

  // --- Weekly Streak (consecutive weeks with >=1 workout) ---
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

    // Zähle aufeinanderfolgende Wochen
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

  return (
    <TrackerContext.Provider
      value={{
        workoutLogs,
        logWorkout,
        removeLog,
        clearAllLogs,
        getDailyStreak,
        getWeeklyStreak,
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
