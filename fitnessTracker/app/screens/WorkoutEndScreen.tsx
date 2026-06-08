import { Exercise, Workout } from '../types/workout';
import { useTracker } from '@/context/TrackerContext';
import { CreateBox } from '../components/CreateBox';
import { useSearchParams } from 'expo-router/build/hooks';
import { useTheme } from '../hooks/useTheme';
import AppContainer from '../components/ui/AppContainer';
import { useAppContext } from '../hooks/useAppContext';
import { useWorkouts } from '../../context/WorkoutContext';
import CardBox from '@/app/components/CardBox';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const calcTotalVolume = (workout: Workout) => {
  let total = 0;
  workout.exercises.forEach((ex) => {
    if (ex.last_weight && ex.last_reps) {
      ex.last_weight.forEach((w, i) => {
        total += w * (ex.last_reps[i] ?? 0);
      });
    }
  });
  return total;
};

const formatSetLine = (exercise: Exercise, setIndex: number, text: { trackWeight: string; trackReps: string }) => {
  const trackWeight = exercise.trackWeight !== false;
  const trackReps = exercise.trackReps !== false;
  const weight = exercise.last_weight?.[setIndex] ?? 0;
  const reps = exercise.last_reps?.[setIndex] ?? 0;

  if (trackWeight && trackReps) return `${weight} kg × ${reps}`;
  if (trackReps) return `${reps} ${text.trackReps}`;
  if (trackWeight) return `${weight} kg`;
  return `${setIndex + 1}`;
};

export default function WorkoutEndScreen({ route }: any) {
  const colors = useTheme();
  const { text, nav, layouts } = useAppContext();
  const params = useSearchParams();
  const { workouts } = useWorkouts();
  const { logWorkout } = useTracker();

  const rawId = route?.params?.workoutId ?? ((params as any).get ? (params as any).get('workoutId') : (params as any).workoutId);
  const workoutId = Number(rawId);
  const workout = workouts?.find((w) => w.id === workoutId);

  const summary = useMemo(() => {
    if (!workout) return null;

    const totalVolume = calcTotalVolume(workout);
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);

    return { totalVolume, totalSets };
  }, [workout]);

  const styles = StyleSheet.create({
    cardScroll: {
      flex: 1,
    },
    summaryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    statBlock: {
      minWidth: '40%',
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
    exerciseBlock: {
      marginBottom: 14,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    setLine: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
      paddingLeft: 8,
    },
    notesBlock: {
      marginTop: 4,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    notesLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    notesText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
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

  const cardSize = Math.min(3.5, 1.4 + workout.exercises.length * 0.35);

  return (
    <AppContainer heading={`${text.workoutendHeading} ${workout.name}`} isBar={true}>
      <CardBox size={cardSize}>
        <ScrollView style={styles.cardScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>{text.workoutEndVolume}</Text>
              <Text style={styles.statValue}>{summary.totalVolume.toLocaleString()} kg</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>{text.workoutEndExercises}</Text>
              <Text style={styles.statValue}>
                {workout.exercises.length} · {summary.totalSets} {summary.totalSets === 1 ? text.set : text.sets}
              </Text>
            </View>
          </View>

          {workout.exercises.map((exercise, exIndex) => (
            <View key={exIndex} style={styles.exerciseBlock}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                <Text key={setIndex} style={styles.setLine}>
                  {text.set} {setIndex + 1}: {formatSetLine(exercise, setIndex, text)}
                </Text>
              ))}
            </View>
          ))}

          {workout.notes?.trim() ? (
            <View style={styles.notesBlock}>
              <Text style={styles.notesLabel}>{text.workoutEndNotes}</Text>
              <Text style={styles.notesText}>{workout.notes}</Text>
            </View>
          ) : null}
        </ScrollView>
      </CardBox>

      <View style={styles.actions}>
        <CreateBox onPress={delGoHome} iconName="trash" text={text.remove} variant="accent" />
        <CreateBox onPress={goHome} iconName="home" text={text.safe} variant="accent" />
      </View>
    </AppContainer>
  );
}
