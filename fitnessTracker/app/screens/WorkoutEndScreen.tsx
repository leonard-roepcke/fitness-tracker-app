import { useTracker } from '@/context/TrackerContext';
import { useSessions } from '@/context/SessionContext';
import { CreateBox } from '../components/CreateBox';
import { useSearchParams } from 'expo-router/build/hooks';
import { useTheme } from '../hooks/useTheme';
import AppContainer from '../components/ui/AppContainer';
import { useAppContext } from '../hooks/useAppContext';
import { useWorkouts } from '../../context/WorkoutContext';
import CardBox from '@/app/components/CardBox';
import { WorkoutVolumeChart } from '../components/WorkoutVolumeChart';
import { mergeVolumeHistory, sessionsToVolumeHistory } from '../utils/sessionStreak';
import { applySessionToWorkout } from '../utils/syncTemplateFromSession';
import { calcSessionVolume } from '../utils/sessionVolume';
import { countSessionPRs } from '../utils/personalRecords';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WorkoutEndScreen({ route }: any) {
  const colors = useTheme();
  const { text, nav, layouts } = useAppContext();
  const params = useSearchParams();
  const { workouts, updateWorkout } = useWorkouts();
  const { logWorkout, showWorkoutsById, workoutLogs } = useTracker();
  const {
    getSessionById,
    completeSession,
    discardActiveSession,
    getSessionsByWorkoutId,
    sessions,
  } = useSessions();

  const rawSessionId = route?.params?.sessionId ?? ((params as any).get ? (params as any).get('sessionId') : (params as any).sessionId);
  const sessionId = rawSessionId as string;
  const rawWorkoutId = route?.params?.workoutId ?? ((params as any).get ? (params as any).get('workoutId') : (params as any).workoutId);
  const workoutId = Number(rawWorkoutId);

  const session = getSessionById(sessionId);
  const workout = workouts?.find((w) => w.id === workoutId);

  const prCount = useMemo(() => {
    if (!session) return 0;
    return countSessionPRs(session, sessions);
  }, [session, sessions]);

  const summary = useMemo(() => {
    if (!session) return null;

    const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    return {
      totalVolume: calcSessionVolume(session.exercises),
      totalSets,
      exerciseCount: session.exercises.length,
    };
  }, [session]);

  const volumeHistory = useMemo(() => {
    if (!workout) return [];
    const sessionEntries = sessionsToVolumeHistory(
      getSessionsByWorkoutId(workout.id),
      workout.id
    );
    return mergeVolumeHistory(sessionEntries, showWorkoutsById(workout.id));
  }, [workout, workoutLogs, session, getSessionsByWorkoutId, showWorkoutsById]);

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
    prSummary: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.warning,
      textAlign: 'center',
      marginBottom: 12,
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

  if (!session || !workout || !summary) {
    return (
      <AppContainer heading={text.workoutendHeading} isBar={true}>
        <Text style={styles.notFound}>{text.workoutNotFound}</Text>
      </AppContainer>
    );
  }

  const goHome = async () => {
    await completeSession(sessionId);
    const updatedWorkout = applySessionToWorkout(workout, session);
    if (workouts) {
      const updated = workouts.map((w) =>
        w.id === workout.id ? updatedWorkout : w
      );
      updateWorkout(updated);
      await logWorkout(updatedWorkout);
    }
    nav.navigate('WorkoutOverview');
  };

  const delGoHome = () => {
    discardActiveSession(sessionId);
    nav.navigate('WorkoutOverview');
  };

  return (
    <AppContainer heading={`${text.workoutendHeading} ${session.workoutName}`} isBar={true}>
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

        {prCount > 0 && (
          <Text style={styles.prSummary}>
            {prCount} {text.prCountLabel}
          </Text>
        )}

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
