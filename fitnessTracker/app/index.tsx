import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OverviewScreen from './screens/OverviewScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import WorkoutEditScreen from './screens/WorkoutEditScreen';
import SettingsScreen from './screens/SettingsScreen';
import WorkoutOverviewScreen from './screens/WorkoutOverviewScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Overview" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Overview" component={OverviewScreen} />
      <Stack.Screen name="Workout" component={WorkoutScreen} />
      <Stack.Screen name="WorkoutEdit" component={WorkoutEditScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="WorkoutOverview" component={WorkoutOverviewScreen} />
    </Stack.Navigator>
  );
}
