import {View, Text} from 'react-native'
import { useEffect } from 'react';
import { useTracker } from "@/context/TrackerContext";
import { CreateBox } from '../components/CreateBox';
import { useSearchParams } from 'expo-router/build/hooks';
import { useTheme} from '../hooks/useTheme';
import AppContainer from '../components/ui/AppContainer';
import { useAppContext } from '../hooks/useAppContext';
import { useWorkouts } from '../../context/WorkoutContext';
import CardBox from '@/app/components/CardBox';


export default function WorkoutEndScreen({route, navigation}:any){
  const colors = useTheme();
  const { text , nav } = useAppContext();
  const params = useSearchParams();
  const {workouts, updateWorkout} = useWorkouts();
    const { logWorkout, workoutLogs, getDailyStreak, getWeeklyStreak } = useTracker();

    // Try react-navigation route params first, otherwise fall back to expo-router search params
  const rawId = route?.params?.workoutId ?? ((params as any).get ? (params as any).get('workoutId') : (params as any).workoutId);
  const workoutId = Number(rawId);
  const workout = workouts?.find(w => w.id === workoutId);
    
  const isString = typeof workout === "string";
  const name = isString ? workout : workout.name;

  const { showWorkoutsById } = useTracker();
  const styles = {
    text:{
      color: colors.text,
    },
  }
  useEffect(() => {
    if (!workoutId) return;
    console.log(showWorkoutsById(workoutId));
  }, [workoutLogs]);

  const goHome = async () => {
    await logWorkout(workout);
    nav.navigate('WorkoutOverview');
  }

  const delGoHome = () => {
    nav.navigate('WorkoutOverview');
  }
  return(
    <AppContainer heading={text.workoutendHeading} scrolable={true}>
      <Text style={styles.text}>
        {name}
      </Text>
    
    <View>
      <CardBox>

      </CardBox>
      <CreateBox  onPress={delGoHome} iconName='remove' text={text.remove}/>
      <CreateBox  onPress={goHome} iconName='home' text={text.safe}/>
    </View>
    </AppContainer>
  );
}
