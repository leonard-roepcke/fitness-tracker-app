import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import OverviewScreen from './screens/OverviewScreen';
import SettingsScreen from './screens/SettingsScreen';
import WorkoutEditScreen from './screens/WorkoutEditScreen';
import WorkoutOverviewScreen from './screens/WorkoutOverviewScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import WorkoutEndScreen from './screens/WorkoutEndScreen';
import HealthScreen from './screens/HealthScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Overview" screenOptions={{headerShown: false, animation: "none",animationDuration:0,  gestureEnabled: false, stackPresentation: "push" as const,}}>
      <Stack.Screen name="Overview" component={OverviewScreen} />
      <Stack.Screen name="Workout" component={WorkoutScreen} />
      <Stack.Screen name="WorkoutEdit" component={WorkoutEditScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="WorkoutOverview" component={WorkoutOverviewScreen} />
      <Stack.Screen name="WorkoutEnd" component={WorkoutEndScreen} />
      <Stack.Screen name="Health" component={HealthScreen} />
    </Stack.Navigator>
  );
}
