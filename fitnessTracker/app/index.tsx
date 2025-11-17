import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OverviewScreen from './screens/OverviewScreen';
import WorkoutScreen from './screens/WorkoutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Overview">
      <Stack.Screen name="Overview" component={OverviewScreen} />
      <Stack.Screen name="Workout" component={WorkoutScreen} />
    </Stack.Navigator>
  );
}
