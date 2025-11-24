import { Stack } from 'expo-router';
import { WorkoutProvider } from "../context/WorkoutContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <WorkoutProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{headerShown: false}}/>
      </GestureHandlerRootView>
    </WorkoutProvider>
  );
}
