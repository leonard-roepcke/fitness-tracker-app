import { Stack } from 'expo-router';
import { WorkoutProvider } from "../context/WorkoutContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from "../context/ThemeContext";
import { WeightProvider } from '@/context/WeightContext';

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
