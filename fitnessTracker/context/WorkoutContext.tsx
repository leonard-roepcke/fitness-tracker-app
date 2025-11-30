import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Workout } from "../types/workout";

type WorkoutContextType = {
    workouts: Workout[] | null;
    addWorkout: (workout: Workout) => void;
    updateWorkout: (workouts: Workout[]) => void;
    deleteWorkout: (id: number) => void;
    toggleFavorite: (id: number) => void;
};

const WorkoutContext = createContext<WorkoutContextType>({
    workouts: null,
    addWorkout: () => {},
    updateWorkout: () => {},
    deleteWorkout: () => {},
    toggleFavorite: () => {},
});

export const WorkoutProvider = ({ children }: any) => {
    const [workouts, setWorkouts] = useState<Workout[] | null>(null);

    // ---------- Laden ----------
    useEffect(() => {
        (async () => {
            try {
                const data = await AsyncStorage.getItem("workouts");
                if (data) setWorkouts(JSON.parse(data));
                else setWorkouts([]);
            } catch (err) {
                setWorkouts([]);
            }
        })();
    }, []);

    // ---------- Speichern ----------
    const save = async (ws: Workout[]) => {
        setWorkouts(ws);
        await AsyncStorage.setItem("workouts", JSON.stringify(ws));
    };

    // ---------- Workout hinzufügen ----------
    const addWorkout = (workout: Workout) => {
        if (!workouts) return;
        const updated = [...workouts, workout];
        save(updated);
    };

    // ---------- Liste komplett ersetzen ----------
    const updateWorkout = (ws: Workout[]) => {
        save(ws);
    };

    // ---------- Workout löschen ----------
    const deleteWorkout = (id: number) => {
        if (!workouts) return;
        const updated = workouts.filter(w => w.id !== id);
        save(updated);
    };

    // ---------- Favoriten togglen ----------
    const toggleFavorite = (id: number) => {
        if (!workouts) return;

        const updated = workouts.map(w =>
            w.id === id ? { ...w, isFavorite: !w.isFavorite } : w
        );

        save(updated);
    };

    return (
        <WorkoutContext.Provider
            value={{
                workouts,
                addWorkout,
                updateWorkout,
                deleteWorkout,
                toggleFavorite,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
};

// ---------- Export Hook ----------
export const useWorkouts = () => useContext(WorkoutContext);
