import { WeightProvider } from '@/context/WeightContext';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from "../context/ThemeContext";
import { WorkoutProvider } from "../context/WorkoutContext";

export default function RootLayout() {
  return (
    <WeightProvider>
    <ThemeProvider>
    <WorkoutProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{headerShown: false}}/>
      </GestureHandlerRootView>
    </WorkoutProvider>
    </ThemeProvider>
    </WeightProvider>
  );
}
