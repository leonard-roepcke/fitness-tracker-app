import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { useWorkouts } from '../../context/WorkoutContext';
import { useTheme } from '../hooks/useTheme';

export default function WorkoutEditScreen({ route }: any) {
  const workoutIndex = route?.params?.workoutIndex ?? 0;
  const colors = useTheme();
  const [workouts, setWorkouts] = useWorkouts();

  if (!workouts) return null;

  const workout = workouts[workoutIndex];
  if (!workout) return null;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
    },
    input: {
      padding: 8,
      borderWidth: 1,
      borderColor: colors.textSecondary,
      borderRadius: 6,
      marginBottom: 12,
      backgroundColor: colors.card,
      color: colors.text,
      fontSize: 16,
    },
    exerciseBox: {
      marginBottom: 16,
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.card,
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
      borderRadius: 4,
      marginRight: 8,
      backgroundColor: colors.background,
      color: colors.text,
      textAlign: 'center',
    },
  });

  const handleWorkoutNameChange = (text: string) => {
    const updated = [...workouts];
    updated[workoutIndex] = { ...updated[workoutIndex], name: text };
    setWorkouts(updated);
  };

  const handleExerciseChange = (
    exerciseIndex: number,
    field: 'name' | 'sets',
    value: string
  ) => {
    const updated = [...workouts];
    const ex = updated[workoutIndex].exercises[exerciseIndex];

    if (field === 'name') {
      ex.name = value;
    } else if (field === 'sets') {
      const newSets = Math.max(1, parseInt(value) || 1);
      ex.sets = newSets;

      // Wenn last_reps oder last_weight zu kurz ist, erweitern
      if (!ex.last_reps) ex.last_reps = [];
      while (ex.last_reps.length < newSets) ex.last_reps.push(0);
      if (!ex.last_weight) ex.last_weight = [];
      while (ex.last_weight.length < newSets) ex.last_weight.push(0);
      if (ex.last_weight.length > newSets) ex.last_weight = ex.last_weight.slice(0, newSets);
    }

    setWorkouts(updated);
  };

  const handleRepChange = (exerciseIndex: number, setIndex: number, value: string) => {
    const updated = [...workouts];
    updated[workoutIndex].exercises[exerciseIndex].last_reps[setIndex] = parseInt(value) || 0;
    setWorkouts(updated);
  };

  const handleWeightChange = (exerciseIndex: number, setIndex: number, value: string) => {
    const updated = [...workouts];
    const ex = updated[workoutIndex].exercises[exerciseIndex];
    if (!ex.last_weight) ex.last_weight = [];
    ex.last_weight[setIndex] = parseInt(value) || 0;
    setWorkouts(updated);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Workout Name */}
        <TextInput
          style={styles.input}
          value={workout.name}
          onChangeText={handleWorkoutNameChange}
          placeholder="Workout Name"
          placeholderTextColor={colors.textSecondary}
        />

        {/* Exercises */}
        {workout.exercises.map((exercise, exIndex) => (
          <View key={exIndex} style={styles.exerciseBox}>
            <TextInput
              style={styles.input}
              value={exercise.name}
              onChangeText={(text) => handleExerciseChange(exIndex, 'name', text)}
              placeholder="Exercise Name"
              placeholderTextColor={colors.textSecondary}
            />

            <TextInput
              style={styles.input}
              value={exercise.sets.toString()}
              onChangeText={(text) => handleExerciseChange(exIndex, 'sets', text)}
              placeholder="Sets"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />

            {/* Last reps & weights */}
            {Array.from({ length: exercise.sets }).map((_, setIndex) => (
              <View key={setIndex} style={styles.exerciseRow}>
                <Text style={styles.label}>Set {setIndex + 1}:</Text>
                <TextInput
                  style={styles.smallInput}
                  value={exercise.last_reps[setIndex]?.toString() || '0'}
                  onChangeText={(text) => handleRepChange(exIndex, setIndex, text)}
                  keyboardType="numeric"
                />
                <Text style={styles.label}>kg</Text>
                <TextInput
                  style={styles.smallInput}
                  value={exercise.last_weight?.[setIndex]?.toString() || '0'}
                  onChangeText={(text) => handleWeightChange(exIndex, setIndex, text)}
                  keyboardType="numeric"
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
