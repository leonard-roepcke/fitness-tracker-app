import Layouts from "@/app/constants/Layouts";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useWorkouts } from '../../context/WorkoutContext';
import Bar from '../components/Bar';
import { CreateBox } from '../components/CreateBox';
import CustomModal from "../components/CustomModal";
import { NumberWheel } from '../components/NumberWheel';
import { useTheme } from '../hooks/useTheme';

export default function WorkoutEditScreen({ route }: any) {
  const workoutId = route?.params?.workoutId;
  const colors = useTheme();
  const layouts = Layouts;
  const { workouts, updateWorkout } = useWorkouts();
  const router = useRouter();
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Modal für eine bestimmte Exercise
  const [modalExerciseIndex, setModalExerciseIndex] = useState<number | null>(null);

  if (!workouts) return null;

  const index = workoutId !== undefined ? workouts.findIndex((w) => w.id === workoutId) : -1;
  if (index === -1) return null;
  const workout = workouts[index];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 0,
      marginTop: 10,
      color: colors.text,
    },
    content: {
      padding: 16,
    },
    input: {
      padding: 8,
      borderWidth: 1,
      borderColor: colors.textSecondary,
      borderRadius: layouts.borderRadius,
      marginBottom: 12,
      backgroundColor: colors.card,
      color: colors.text,
      fontSize: 16,
    },
    exerciseBox: {
      marginBottom: 16,
      padding: 12,
      borderRadius: layouts.borderRadius,
      backgroundColor: colors.card,
      flexDirection: 'row',
      alignItems: 'center',
    },
    exerciseTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    exerciseRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    label: {
      color: colors.text,
      marginRight: 6,
    },
    smallInput: {
      width: 50,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.textSecondary,
      borderRadius: layouts.borderRadius,
      marginRight: 8,
      backgroundColor: colors.background,
      color: colors.text,
      textAlign: 'center',
    },
  });

  const handleWorkoutNameChange = (text: string) => {
    const updated = [...workouts];
    updated[index] = { ...updated[index], name: text };
    updateWorkout(updated);
  };

  const handleExerciseChange = (
    exerciseIndex: number,
    field: 'name' | 'sets',
    value: string
  ) => {
    const updated = [...workouts];
    const ex = updated[index].exercises[exerciseIndex];

    if (field === 'name') {
      ex.name = value;
    } else if (field === 'sets') {
      const newSets = Math.max(1, parseInt(value) || 1);
      ex.sets = newSets;

      if (!ex.last_reps) ex.last_reps = [];
      while (ex.last_reps.length < newSets) ex.last_reps.push(0);
      if (!ex.last_weight) ex.last_weight = [];
      while (ex.last_weight.length < newSets) ex.last_weight.push(0);
      if (ex.last_weight.length > newSets) ex.last_weight = ex.last_weight.slice(0, newSets);
    }

    updateWorkout(updated);
  };

  const handleRepChange = (exerciseIndex: number, setIndex: number, value: string) => {
    const updated = [...workouts];
    if (!updated[index].exercises[exerciseIndex].last_reps)
      updated[index].exercises[exerciseIndex].last_reps = [];

    updated[index].exercises[exerciseIndex].last_reps[setIndex] = parseInt(value) || 0;
    updateWorkout(updated);
  };

  const handleWeightChange = (exerciseIndex: number, setIndex: number, value: string) => {
    const updated = [...workouts];
    const ex = updated[index].exercises[exerciseIndex];
    if (!ex.last_weight) ex.last_weight = [];
    ex.last_weight[setIndex] = parseInt(value) || 0;
    updateWorkout(updated);
  };

  const back = () => {
    router.back();
  };

  const del = () => {
    if (workoutId === undefined) return;
    const updated = workouts.filter((w) => w.id !== workoutId);
    updateWorkout(updated);
    router.back();
  };

  const delExercise = (exerciseIndex: number) => {
    const updated = [...workouts];
    const newExercises = updated[index].exercises.filter((_, idx) => idx !== exerciseIndex);
    updated[index] = { ...updated[index], exercises: newExercises };
    updateWorkout(updated);
  };

  const addWorkout = () => {
    const updated = [...workouts];
    const newExercise = {
      name: 'New Exercise',
      sets: 3,
      last_reps: [0, 0, 0],
      last_weight: [0, 0, 0]
    };

    const newExercises = [...updated[index].exercises, newExercise];
    updated[index] = { ...updated[index], exercises: newExercises };
    updateWorkout(updated);
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

    updateWorkout(updated);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 60, paddingTop: 20 }}
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps="handled"
      >
        {/* Workout Name */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <CreateBox onPress={back} iconName='arrow-back' />

          <TextInput
            style={[styles.input, { flex: 1, marginHorizontal: 12, height: 50, marginTop: 12 }]}
            value={workout.name}
            onChangeText={handleWorkoutNameChange}
            placeholder="Workout Name"
            placeholderTextColor={colors.textSecondary}
          />

          <CreateBox onPress={del} iconName='trash' />
        </View>

        {/* Exercises */}
        {workout.exercises.map((exercise, exIndex) => (
          <View key={exIndex} style={styles.exerciseBox}>

            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              value={exercise.name}
              onChangeText={(text) => handleExerciseChange(exIndex, 'name', text)}
              placeholder="Exercise Name"
              placeholderTextColor={colors.textSecondary}
            />

            {/* Wheel: Scroll während Drag deaktivieren */}
            <View
            >
              <View style={{ flex: 1, padding: 20 }}>
                <Button
                title={exercise.sets.toString() + (exercise.sets > 1 ? " Sets" : " Set ")}
                  onPress={() => setModalExerciseIndex(exIndex)}
                />

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
                      width={90}
                      suffix=" Sets"
                      visibleItems={3}
                    />
                </View>
                </CustomModal>
              </View>
            </View>

            <CreateBox onPress={() => delExercise(exIndex)} iconName='trash' />
          </View>
        ))}

        <CreateBox onPress={addWorkout} iconName='add' text='Add workout' />
        <Text style={styles.title} />
        <Text style={styles.title} />
      </ScrollView>

      <Bar />
    </KeyboardAvoidingView>
  );
}
