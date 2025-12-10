import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  isWTrackerEnabled: boolean;
  toggleWTracker: () => void;
  isCTrackerEnabled: boolean;
  toggleCTracker: () => void;
  isDailyStreakEnabled: boolean;
  toggleDailyStreak: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  toggleTheme: () => {},
  isWTrackerEnabled: false,
  toggleWTracker: () => {},
  isCTrackerEnabled: false,
  toggleCTracker: () => {},
  isDailyStreakEnabled: false,
  toggleDailyStreak: () => {},

});

export const ThemeProvider = ({ children }: any) => {
  const [isDark, setIsDark] = useState(false);
  const [isWTrackerEnabled, setIsWTrackerEnabled] = useState(false);
  const [isCTrackerEnabled, setIsCTrackerEnabled] = useState(false);
  const [isDailyStreakEnabled, setIsDailyStreakEnabled] = useState(false);
  // Initiales Laden der Werte aus AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("darkMode").then((value) => {
      if (value !== null) {
        setIsDark(value === "true");
      }
    });

    AsyncStorage.getItem("wTracker").then((value) => {
      if (value !== null) {
        setIsWTrackerEnabled(value === "true");
      }
    });

    AsyncStorage.getItem("cTracker").then((value) => {
      if (value !== null) {
        setIsCTrackerEnabled(value === "true");
      }
    });

    AsyncStorage.getItem("DailyStreak").then((value) => {
      if (value !== null) {
        setIsDailyStreakEnabled(value === "true");
      }
    });

  }, []);

  const toggleTheme = async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    await AsyncStorage.setItem("darkMode", String(newValue));
  };

  const toggleWTracker = async () => {
    const newValue = !isWTrackerEnabled;
    setIsWTrackerEnabled(newValue);
    await AsyncStorage.setItem("wTracker", String(newValue));
  };

  const toggleCTracker = async () => {
    const newValue = !isCTrackerEnabled;
    setIsCTrackerEnabled(newValue);
    await AsyncStorage.setItem("cTracker", String(newValue));
  };
  
  const toggleDailyStreak= async () => {
    const newValue = !isCTrackerEnabled;
    setIsDailyStreakEnabled(newValue);
    await AsyncStorage.setItem("DailyStreak", String(newValue));
  };

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, isWTrackerEnabled, toggleWTracker, isCTrackerEnabled, toggleCTracker , isDailyStreakEnabled, toggleDailyStreak}}
    >
      {children}
    </ThemeContext.Provider>
  );
};
