// project/context/TrackerContext.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { WorkoutLogsByDate } from "../app/types/tracker";

const STORAGE_KEY = "WORKOUT_LOGS_BY_DATE";

// ---------- TYPES FOR CONTEXT ----------
type TrackerContextType = {
  workoutLogs: WorkoutLogsByDate;
  logWorkout: (dateISO: string, workoutId: string, volume: number) => Promise<void>;
  removeLog: (dateISO: string, index?: number) => Promise<void>;
  clearAllLogs: () => Promise<void>;
};

// ---------- DEFAULT VALUE ----------
const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

// ---------- PROVIDER ----------
export const TrackerProvider = ({ children }: { children: ReactNode }) => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogsByDate>({});

  // ------------------------------
  // LOAD FROM ASYNC STORAGE
  // ------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setWorkoutLogs(JSON.parse(json));
        }
      } catch (e) {
        console.error("Failed to load workout logs", e);
      }
    };

    load();
  }, []);

  // ------------------------------
  // SAVE TO STORAGE
  // ------------------------------
  const saveToStorage = async (data: WorkoutLogsByDate) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save workout logs", e);
    }
  };

  // ------------------------------
  // ADD WORKOUT LOG
  // ------------------------------
  const logWorkout = async (dateISO: string, workoutId: string, volume: number) => {
    setWorkoutLogs((prev) => {
      const existing = prev[dateISO] || { workoutIds: [], volumes: [] };

      const updated: WorkoutLogsByDate = {
        ...prev,
        [dateISO]: {
          workoutIds: [...existing.workoutIds, workoutId],
          volumes: [...existing.volumes, volume],
        },
      };

      saveToStorage(updated);
      return updated;
    });
  };

  // ------------------------------
  // REMOVE A LOG (OPTIONAL INDEX)
  // ------------------------------
  const removeLog = async (dateISO: string, index?: number) => {
    setWorkoutLogs((prev) => {
      const day = prev[dateISO];
      if (!day) return prev;

      // If no index given → delete whole day
      if (index === undefined) {
        const updated = { ...prev };
        delete updated[dateISO];
        saveToStorage(updated);
        return updated;
      }

      // Remove specific entry
      const newWorkoutIds = [...day.workoutIds];
      const newVolumes = [...day.volumes];

      newWorkoutIds.splice(index, 1);
      newVolumes.splice(index, 1);

      const updated = {
        ...prev,
        [dateISO]: {
          workoutIds: newWorkoutIds,
          volumes: newVolumes,
        },
      };

      saveToStorage(updated);
      return updated;
    });
  };

  // ------------------------------
  // CLEAR ALL
  // ------------------------------
  const clearAllLogs = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setWorkoutLogs({});
  };

  return (
    <TrackerContext.Provider
      value={{
        workoutLogs,
        logWorkout,
        removeLog,
        clearAllLogs,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

// ---------- HOOK ----------
export const useTracker = () => {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be used inside TrackerProvider");
  return ctx;
};
