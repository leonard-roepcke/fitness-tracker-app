import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout } from "../app/types/workout";

type WorkoutContextType = {
  workouts: Workout[] | null;
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[] | null>>;
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: any) {
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const json = await AsyncStorage.getItem("workouts");
      if (json) {
        setWorkouts(JSON.parse(json));
      } else {
        setWorkouts([
          {
            id: 0,
            name: "Push",
            exercises: [
              { name: "Bench Press", sets: 3, last_reps: [10,4,0], last_weight: [20,18,0] }
            ],
            createdAt: Date.now(),
          },
        ]);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (workouts !== null) {
      AsyncStorage.setItem("workouts", JSON.stringify(workouts));
    }
  }, [workouts]);

  return (
    <WorkoutContext.Provider value={{ workouts, setWorkouts }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkouts must be used inside WorkoutProvider");
  return [ctx.workouts, ctx.setWorkouts] as const;
}
