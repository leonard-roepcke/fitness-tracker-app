import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import { useWorkouts } from '../../context/WorkoutContext';
import Bar from '../components/Bar';
import { CreateBox } from '../components/CreateBox';
import CustomModal from "../components/CustomModal";
import GradientButton from '../components/ui/GradientButton';
import { NumberWheel } from '../components/NumberWheel';
import { useAppContext } from '../hooks/useAppContext';
import { cardShadow } from '../utils/shadows';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Exercise } from '../types/workout';

export default function WorkoutEditScreen({ route }: any) {
  const workoutId = route?.params?.workoutId;
  const insets = useSafeAreaInsets();
  const { colors, layouts, text } = useAppContext();
  const { workouts, updateWorkout } = useWorkouts();
  const router = useRouter();
  const [modalExerciseIndex, setModalExerciseIndex] = useState<number | null>(null);

  if (!workouts) return null;

  const index = workoutId !== undefined ? workouts.findIndex((w) => w.id === workoutId) : -1;
  if (index === -1) return null;
  const workout = workouts[index];

  const styles = StyleSheet.create({
    input: {
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: layouts.borderRadius,
      backgroundColor: colors.surface,
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    exerciseCard: {
      marginBottom: 16,
      padding: 16,
      borderRadius: layouts.borderRadiusLarge,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      ...cardShadow(colors),
    },
    exerciseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 8,
    },
    setsRow: {
      alignItems: 'center',
      marginBottom: 12,
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 4,
    },
    toggleLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    spacer: {
      height: 80,
    },
  });

  const saveWorkouts = (updated: typeof workouts) => updateWorkout(updated);

  const handleWorkoutNameChange = (name: string) => {
    const updated = [...workouts];
    updated[index] = { ...updated[index], name };
    saveWorkouts(updated);
  };

  const handleExerciseChange = (exerciseIndex: number, value: string) => {
    const updated = [...workouts];
    updated[index].exercises[exerciseIndex].name = value;
    saveWorkouts(updated);
  };

  const toggleExerciseFlag = (
    exerciseIndex: number,
    field: 'trackWeight' | 'trackReps',
    value: boolean
  ) => {
    const updated = [...workouts];
    updated[index].exercises[exerciseIndex] = {
      ...updated[index].exercises[exerciseIndex],
      [field]: value,
    };
    saveWorkouts(updated);
  };

  const back = () => router.back();

  const del = () => {
    if (workoutId === undefined) return;
    saveWorkouts(workouts.filter((w) => w.id !== workoutId));
    router.back();
  };

  const delExercise = (exerciseIndex: number) => {
    const updated = [...workouts];
    const newExercises = updated[index].exercises.filter((_, idx) => idx !== exerciseIndex);
    updated[index] = { ...updated[index], exercises: newExercises };
    saveWorkouts(updated);
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      name: 'New Exercise',
      sets: 3,
      last_reps: [0, 0, 0],
      last_weight: [0, 0, 0],
      trackWeight: true,
      trackReps: true,
    };
    const updated = [...workouts];
    updated[index] = {
      ...updated[index],
      exercises: [...updated[index].exercises, newExercise],
    };
    saveWorkouts(updated);
  };

  const changeSets = (exerciseIndex: number, value: number) => {
    const updated = [...workouts];
    const ex = updated[index].exercises[exerciseIndex];
    ex.sets = value;

    if (!ex.last_reps) ex.last_reps = [];
    while (ex.last_reps.length < value) ex.last_reps.push(0);
    if (ex.last_reps.length > value) ex.last_reps = ex.last_reps.slice(0, value);

    if (!ex.last_weight) ex.last_weight = [];
    while (ex.last_weight.length < value) ex.last_weight.push(0);
    if (ex.last_weight.length > value) ex.last_weight = ex.last_weight.slice(0, value);

    saveWorkouts(updated);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 60, paddingTop: insets.top + 8 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <CreateBox onPress={back} iconName='arrow-back' variant='borderless' />
          <TextInput
            style={[styles.input, { flex: 1, height: 50 }]}
            value={workout.name}
            onChangeText={handleWorkoutNameChange}
            placeholder="Workout Name"
            placeholderTextColor={colors.textSecondary}
          />
          <CreateBox onPress={del} iconName='trash' variant='borderless' iconColor={colors.danger} />
        </View>

        {workout.exercises.map((exercise, exIndex) => {
          const trackWeight = exercise.trackWeight !== false;
          const trackReps = exercise.trackReps !== false;

          return (
            <View key={exIndex} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={exercise.name}
                  onChangeText={(value) => handleExerciseChange(exIndex, value)}
                  placeholder="Exercise Name"
                  placeholderTextColor={colors.textSecondary}
                />
                <CreateBox
                  onPress={() => delExercise(exIndex)}
                  iconName='trash'
                  variant='borderless'
                  iconColor={colors.danger}
                />
              </View>

              <View style={styles.setsRow}>
                <GradientButton
                  title={`${exercise.sets} ${exercise.sets > 1 ? text.sets : text.set}`}
                  onPress={() => setModalExerciseIndex(exIndex)}
                  style={{ minWidth: 160 }}
                />
              </View>

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>{text.trackWeight}</Text>
                <Switch
                  value={trackWeight}
                  onValueChange={(v) => toggleExerciseFlag(exIndex, 'trackWeight', v)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>{text.trackReps}</Text>
                <Switch
                  value={trackReps}
                  onValueChange={(v) => toggleExerciseFlag(exIndex, 'trackReps', v)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              <CustomModal
                visible={modalExerciseIndex === exIndex}
                onClose={() => setModalExerciseIndex(null)}
              >
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <NumberWheel
                    min={1}
                    max={30}
                    value={exercise.sets}
                    onValueChange={(value) => changeSets(exIndex, value)}
                    width={120}
                    suffix={` ${text.sets}`}
                    visibleItems={3}
                  />
                </View>
              </CustomModal>
            </View>
          );
        })}

        <CreateBox onPress={addExercise} iconName='add' text={text.addExercise} variant='accent' />
        <View style={styles.spacer} />
      </ScrollView>

      <Bar />
    </KeyboardAvoidingView>
  );
}
