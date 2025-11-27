import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Weights, WeightEntry } from "../app/types/weights";

const WeightContext = createContext(null);

export const WeightProvider = ({ children }: any) => {
    const [weights, setWeights] = useState<Weights>([]);

    useEffect(() => {
        AsyncStorage.getItem("weights").then(data => {
            if (data) setWeights(JSON.parse(data));
        });
    }, []);

    const addWeight = (value: number) => {
        const entry: WeightEntry = {
            id: Date.now(),
            date: Date.now(),
            weight: value,
        };

        const updated = [...weights, entry];
        setWeights(updated);
        AsyncStorage.setItem("weights", JSON.stringify(updated));
    };

    return (
        <WeightContext.Provider value={{ weights, addWeight }}>
            {children}
        </WeightContext.Provider>
    );
};

export const useWeights = () => useContext(WeightContext);
