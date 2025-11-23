import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout } from "../types/workout";

type WorkoutContextType = {
  workouts: Workout[]; 
  setWorkouts: (w: Workout[]) => void;
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Load once
  useEffect(() => {
    const load = async () => {
      const json = await AsyncStorage.getItem("workouts");
      if (json) setWorkouts(JSON.parse(json));
    };
    load();
  }, []);

  // Save on change
  useEffect(() => {
    AsyncStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  return (
    <WorkoutContext.Provider value={{ workouts, setWorkouts }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkouts must be inside WorkoutProvider");
  return ctx;
}
