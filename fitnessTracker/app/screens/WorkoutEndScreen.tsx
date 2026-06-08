import { useTracker } from '@/context/TrackerContext';
import { CreateBox } from '../components/CreateBox';
import { useSearchParams } from 'expo-router/build/hooks';
import { useTheme } from '../hooks/useTheme';
import AppContainer from '../components/ui/AppContainer';
import { useAppContext } from '../hooks/useAppContext';
import { useWorkouts } from '../../context/WorkoutContext';
import CardBox from '@/app/components/CardBox';
import { WorkoutVolumeChart } from '../components/WorkoutVolumeChart';
import { calcTotalVolume, getWorkoutVolumeHistory } from '../utils/workoutVolume';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WorkoutEndScreen({ route }: any) {
  const colors = useTheme();
  const { text, nav, layouts } = useAppContext();
  const params = useSearchParams();
  const { workouts } = useWorkouts();
  const { logWorkout, showWorkoutsById, workoutLogs } = useTracker();

  const rawId = route?.params?.workoutId ?? ((params as any).get ? (params as any).get('workoutId') : (params as any).workoutId);
  const workoutId = Number(rawId);
  const workout = workouts?.find((w) => w.id === workoutId);

  const summary = useMemo(() => {
    if (!workout) return null;

    return {
      totalVolume: calcTotalVolume(workout),
      totalSets: workout.exercises.reduce((sum, ex) => sum + ex.sets, 0),
      exerciseCount: workout.exercises.length,
    };
  }, [workout]);

  const volumeHistory = useMemo(() => {
    if (!workout) return [];
    return getWorkoutVolumeHistory(showWorkoutsById(workout.id));
  }, [workout, workoutLogs]);

  const styles = StyleSheet.create({
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },
    statBlock: {
      minWidth: '28%',
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primaryDark,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 16,
    },
    actions: {
      gap: layouts.marginVertical,
    },
    notFound: {
      color: colors.text,
      textAlign: 'center',
      marginTop: 24,
    },
  });

  if (!workout || !summary) {
    return (
      <AppContainer heading={text.workoutendHeading} isBar={true}>
        <Text style={styles.notFound}>{text.workoutNotFound}</Text>
      </AppContainer>
    );
  }

  const goHome = async () => {
    await logWorkout(workout);
    nav.navigate('WorkoutOverview');
  };

  const delGoHome = () => {
    nav.navigate('WorkoutOverview');
  };

  return (
    <AppContainer heading={`${text.workoutendHeading} ${workout.name}`} isBar={true}>
      <CardBox size={2.2}>
        <View style={styles.summaryGrid}>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>{text.workoutEndVolume}</Text>
            <Text style={styles.statValue}>{summary.totalVolume.toLocaleString()} kg</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>{text.workoutEndExercises}</Text>
            <Text style={styles.statValue}>{summary.exerciseCount}</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>{text.sets}</Text>
            <Text style={styles.statValue}>{summary.totalSets}</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <WorkoutVolumeChart
          entries={volumeHistory}
          highlightVolume={summary.totalVolume}
        />
      </CardBox>

      <View style={styles.actions}>
        <CreateBox onPress={delGoHome} iconName="trash" text={text.remove} variant="accent" />
        <CreateBox onPress={goHome} iconName="home" text={text.safe} variant="accent" />
      </View>
    </AppContainer>
  );
}
