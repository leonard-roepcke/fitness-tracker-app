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
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';


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

  const screenWidth = Dimensions.get("window").width;

const chartData = {
  labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  datasets: [
    {
      data: [1, 0, 1, 1, 0, 1, 1] // 1 = Workout, 0 = kein Workout
    }
  ]
};

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
    <AppContainer heading={`${text.workoutendHeading} ${name}`} scrolable={true}>
      <Text style={styles.text}>
    
      </Text>
    
    <View>
      <CardBox>
<LineChart
    data={chartData}
    width={screenWidth - 60}
    height={180}
    yAxisInterval={1}
    chartConfig={{
      backgroundColor: colors.background,
      backgroundGradientFrom: colors.background,
      backgroundGradientTo: colors.background,
      decimalPlaces: 0,
      color: () => colors.text,
      labelColor: () => colors.text,
      propsForDots: {
        r: "4"
      }
    }}
    bezier
  />
      </CardBox>
      <CreateBox  onPress={delGoHome} iconName='trash' text={text.remove}/>
      <CreateBox  onPress={goHome} iconName='home' text={text.safe}/>
    </View>
    </AppContainer>
  );
}
