import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OverviewScreen from './screens/OverviewScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import WorkoutEditScreen from './screens/WorkoutEditScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Overview" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Overview" component={OverviewScreen} />
      <Stack.Screen name="Workout" component={WorkoutScreen} />
      <Stack.Screen name="WorkoutEdit" component={WorkoutEditScreen} />
    </Stack.Navigator>
  );
}
