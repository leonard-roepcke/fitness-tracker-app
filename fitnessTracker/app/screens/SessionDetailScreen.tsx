import { useSessions } from '@/context/SessionContext';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CreateBox } from '../components/CreateBox';
import AppContainer from '../components/ui/AppContainer';
import { useAppContext } from '../hooks/useAppContext';
import { useLanguage } from '../hooks/useLanguage';
import { formatSessionDate, formatSessionDuration, formatSessionTime } from '../utils/sessionHistory';

export default function SessionDetailScreen({ route }: any) {
  const { colors, layouts, text, nav } = useAppContext();
  const { language } = useLanguage();
  const params = useSearchParams();
  const { getSessionById, deleteSession } = useSessions();
  const [deleting, setDeleting] = useState(false);

  const rawSessionId =
    route?.params?.sessionId ??
    ((params as any).get ? (params as any).get('sessionId') : (params as any).sessionId);
  const sessionId = rawSessionId as string;

  const session = useMemo(
    () => getSessionById(sessionId),
    [getSessionById, sessionId]
  );

  const styles = StyleSheet.create({
    scrollContent: { paddingBottom: 100 },
    meta: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    exerciseCard: {
      backgroundColor: colors.card,
      borderRadius: layouts.borderRadiusLarge,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 10,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primaryDark,
      marginBottom: 8,
    },
    setRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    setLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    setValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    notes: {
      marginTop: 12,
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    notFound: {
      color: colors.text,
      textAlign: 'center',
      marginTop: 24,
    },
    actions: {
      marginTop: 16,
      gap: 8,
    },
  });

  if (!session) {
    return (
      <AppContainer backbutton={true} heading={text.sessionDetailHeading} isBar={true}>
        <Text style={styles.notFound}>{text.sessionNotFound}</Text>
      </AppContainer>
    );
  }

  const dateISO = new Date(session.completedAt ?? session.startedAt)
    .toISOString()
    .split('T')[0];
  const duration = formatSessionDuration(session.startedAt, session.completedAt);

  const handleDelete = () => {
    Alert.alert(text.sessionDeleteTitle, text.sessionDeleteMessage, [
      { text: text.workoutAbortCancel, style: 'cancel' },
      {
        text: text.remove,
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          await deleteSession(sessionId);
          nav.navigate('History');
        },
      },
    ]);
  };

  return (
    <AppContainer backbutton={true} heading={session.workoutName} isBar={true}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.meta}>
          {formatSessionDate(dateISO, language)}
          {' · '}
          {formatSessionTime(session.completedAt ?? session.startedAt, language)}
          {' · '}
          {session.totalVolume.toLocaleString()} kg
          {' · '}
          {duration} {text.historyMinutes}
        </Text>

        {session.exercises.map((exercise) => (
          <View key={exercise.exerciseId} style={styles.exerciseCard}>
            <TouchableOpacity
              onPress={() =>
                nav.navigate('ExerciseHistory', { exerciseId: exercise.exerciseId, exerciseName: exercise.name })
              }
            >
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </TouchableOpacity>
            {exercise.sets.map((set, index) => (
              <View key={index} style={styles.setRow}>
                <Text style={styles.setLabel}>
                  {text.set} {index + 1}
                </Text>
                <Text style={styles.setValue}>
                  {set.weight} kg × {set.reps}
                </Text>
              </View>
            ))}
            {exercise.notes ? (
              <Text style={styles.notes}>{exercise.notes}</Text>
            ) : null}
          </View>
        ))}

        {session.notes ? (
          <Text style={styles.notes}>{session.notes}</Text>
        ) : null}

        <View style={styles.actions}>
          <CreateBox
            onPress={handleDelete}
            iconName="trash"
            text={text.sessionDelete}
            variant="accent"
          />
        </View>
      </ScrollView>
    </AppContainer>
  );
}
