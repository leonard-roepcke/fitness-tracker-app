import { ColorPaletteId } from "@/app/constants/ColorPalettes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

const REST_TIMER_MIN = 30;
const REST_TIMER_MAX = 300;
const REST_TIMER_STEP = 30;

const snapRestTimerDuration = (seconds: number) => {
  const clamped = Math.max(REST_TIMER_MIN, Math.min(REST_TIMER_MAX, seconds));
  return Math.round(clamped / REST_TIMER_STEP) * REST_TIMER_STEP;
};

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  colorPalette: ColorPaletteId;
  setColorPalette: (palette: ColorPaletteId) => void;
  isWTrackerEnabled: boolean;
  toggleWTracker: () => void;
  isCTrackerEnabled: boolean;
  toggleCTracker: () => void;
  isDailyStreakEnabled: boolean;
  setDailyStreakEnabled: (enabled: boolean) => void;
  isRestTimerEnabled: boolean;
  toggleRestTimer: () => void;
  restTimerDuration: number;
  setRestTimerDuration: (seconds: number) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  toggleTheme: () => {},
  colorPalette: 'blue',
  setColorPalette: () => {},
  isWTrackerEnabled: true,
  toggleWTracker: () => {},
  isCTrackerEnabled: true,
  toggleCTracker: () => {},
  isDailyStreakEnabled: false,
  setDailyStreakEnabled: () => {},
  isRestTimerEnabled: true,
  toggleRestTimer: () => {},
  restTimerDuration: 60,
  setRestTimerDuration: () => {},
});

export const ThemeProvider = ({ children }: any) => {
  const [isDark, setIsDark] = useState(false);
  const [colorPalette, setColorPaletteState] = useState<ColorPaletteId>('blue');
  const [isWTrackerEnabled, setIsWTrackerEnabled] = useState(true);
  const [isCTrackerEnabled, setIsCTrackerEnabled] = useState(true);
  const [isDailyStreakEnabled, setIsDailyStreakEnabled] = useState(false);
  const [isRestTimerEnabled, setIsRestTimerEnabled] = useState(true);
  const [restTimerDuration, setRestTimerDurationState] = useState(60);

  useEffect(() => {
    AsyncStorage.getItem("darkMode").then((value) => {
      if (value !== null) setIsDark(value === "true");
    });

    AsyncStorage.getItem("colorPalette").then((value) => {
      if (value === 'blue' || value === 'teal' || value === 'purple' || value === 'orange') {
        setColorPaletteState(value);
      }
    });

    AsyncStorage.getItem("wTracker").then((value) => {
      if (value !== null) setIsWTrackerEnabled(value === "true");
    });

    AsyncStorage.getItem("cTracker").then((value) => {
      if (value !== null) setIsCTrackerEnabled(value === "true");
    });

    AsyncStorage.getItem("DailyStreak").then((value) => {
      if (value !== null) setIsDailyStreakEnabled(value === "true");
    });

    AsyncStorage.getItem("restTimer").then((value) => {
      if (value !== null) setIsRestTimerEnabled(value === "true");
    });

    AsyncStorage.getItem("restTimerDuration").then((value) => {
      if (value !== null) {
        const parsed = parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
          setRestTimerDurationState(snapRestTimerDuration(parsed));
        }
      }
    });
  }, []);

  const toggleTheme = async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    await AsyncStorage.setItem("darkMode", String(newValue));
  };

  const setColorPalette = async (palette: ColorPaletteId) => {
    setColorPaletteState(palette);
    await AsyncStorage.setItem("colorPalette", palette);
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

  const setDailyStreakEnabled = async (enabled: boolean) => {
    setIsDailyStreakEnabled(enabled);
    await AsyncStorage.setItem("DailyStreak", String(enabled));
  };

  const toggleRestTimer = async () => {
    const newValue = !isRestTimerEnabled;
    setIsRestTimerEnabled(newValue);
    await AsyncStorage.setItem("restTimer", String(newValue));
  };

  const setRestTimerDuration = async (seconds: number) => {
    const snapped = snapRestTimerDuration(seconds);
    setRestTimerDurationState(snapped);
    await AsyncStorage.setItem("restTimerDuration", String(snapped));
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        colorPalette,
        setColorPalette,
        isWTrackerEnabled,
        toggleWTracker,
        isCTrackerEnabled,
        toggleCTracker,
        isDailyStreakEnabled,
        setDailyStreakEnabled,
        isRestTimerEnabled,
        toggleRestTimer,
        restTimerDuration,
        setRestTimerDuration,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
