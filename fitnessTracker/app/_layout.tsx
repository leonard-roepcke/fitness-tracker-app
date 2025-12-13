import { WeightProvider } from '@/context/WeightContext';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from "../context/ThemeContext";
import { TrackerProvider } from "../context/TrackerContext";
import { WorkoutProvider } from "../context/WorkoutContext";
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout() {
  return (
    <WeightProvider>
      <ThemeProvider>
        <WorkoutProvider>
          <TrackerProvider>
            <LanguageProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack screenOptions={{headerShown: false}}/>
            </GestureHandlerRootView>
            </LanguageProvider>
          </TrackerProvider>
        </WorkoutProvider>
      </ThemeProvider>
    </WeightProvider>
  );
}
