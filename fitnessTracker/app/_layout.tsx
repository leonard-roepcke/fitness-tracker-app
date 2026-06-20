import 'react-native-get-random-values';
import { WeightProvider } from '@/context/WeightContext';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from "../context/ThemeContext";
import { TrackerProvider } from "../context/TrackerContext";
import { WorkoutProvider } from "../context/WorkoutContext";
import { SessionProvider } from "../context/SessionContext";
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout() {
  return (
    <WeightProvider>
      <ThemeProvider>
        <WorkoutProvider>
          <SessionProvider>
          <TrackerProvider>
            <LanguageProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack screenOptions={{headerShown: false}}/>
              </GestureHandlerRootView>
            </SafeAreaProvider>
            </LanguageProvider>
          </TrackerProvider>
          </SessionProvider>
        </WorkoutProvider>
      </ThemeProvider>
    </WeightProvider>
  );
}
