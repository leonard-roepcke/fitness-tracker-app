import {View, Text} from 'react-native'
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
  const {workouts} = useWorkouts();
    const { logWorkout } = useTracker();

    // Try react-navigation route params first, otherwise fall back to expo-router search params
  const rawId = route?.params?.workoutId ?? ((params as any).get ? (params as any).get('workoutId') : (params as any).workoutId);
  const workoutId = Number(rawId);
  const workout = workouts?.find(w => w.id === workoutId);
    
  const isString = typeof workout === "string";
  const name = isString ? workout : workout.name;

  const styles = {
    text:{
      color: colors.text,
    },
  }


  const goHome = async () => {
    await logWorkout(workout);
    nav.navigate('WorkoutOverview');
  }

  const delGoHome = () => {
    nav.navigate('WorkoutOverview');
  }
  return(
    <AppContainer heading={`${text.workoutendHeading} ${name}`} scrolable={true}>
      <Text style={styles.text}>
    
      </Text>
    
    <View>
      <CardBox>

              </CardBox>
      <CreateBox onPress={delGoHome} iconName='trash' text={text.remove} variant='accent' />
      <CreateBox onPress={goHome} iconName='home' text={text.safe} variant='accent' />
    </View>
    </AppContainer>
  );
}
