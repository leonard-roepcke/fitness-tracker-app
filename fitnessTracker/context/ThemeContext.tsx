import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  isWTrackerEnabled: boolean;
  toggleWTracker: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  toggleTheme: () => {},
  isWTrackerEnabled: false,
  toggleWTracker: () => {},
});

export const ThemeProvider = ({ children }: any) => {
  const [isDark, setIsDark] = useState(false);
  const [isWTrackerEnabled, setIsWTrackerEnabled] = useState(false);

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

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, isWTrackerEnabled, toggleWTracker }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
