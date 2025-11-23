import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { useWorkouts } from '../../context/WorkoutContext';
import { useTheme } from '../hooks/useTheme';
import { CreateBox } from '../components/CreateBox';
import { useRouter } from 'expo-router';
import { NumberWheel } from '../components/NumberWheel';

export default function WorkoutEditScreen({ route }: any) {
  const workoutId = route?.params?.workoutId;
  const colors = useTheme();
  const [workouts, setWorkouts] = useWorkouts();
  const router = useRouter();

  if (!workouts) return null;

  const index = workoutId !== undefined ? workouts.findIndex((w) => w.id === workoutId) : -1;
  if (index === -1) return null;
  const workout = workouts[index];

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
      flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    updated[index] = { ...updated[index], name: text };
    setWorkouts(updated);
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
    if (!updated[index].exercises[exerciseIndex].last_reps) updated[index].exercises[exerciseIndex].last_reps = [];
    updated[index].exercises[exerciseIndex].last_reps[setIndex] = parseInt(value) || 0;
    setWorkouts(updated);
  };

  const handleWeightChange = (exerciseIndex: number, setIndex: number, value: string) => {
    const updated = [...workouts];
    const ex = updated[index].exercises[exerciseIndex];
    if (!ex.last_weight) ex.last_weight = [];
    ex.last_weight[setIndex] = parseInt(value) || 0;
    setWorkouts(updated);
  };

  const back = () => {
    router.back();
  };

  const del = () => {
    if (workoutId === undefined) return;
    const updated = workouts.filter((w) => w.id !== workoutId);
    setWorkouts(updated);
    router.back();
  };

  const addWorkout = () => {
    const updated = [...workouts];
    updated[index].exercises.push({ name: 'New Exercise', sets: 3, last_reps: [0, 0, 0], last_weight: [0, 0, 0] });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Workout Name */}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
<CreateBox  onPress={back} iconName='arrow-back'/>
        <TextInput
          style={styles.input}
          value={workout.name}
          onChangeText={handleWorkoutNameChange}
          placeholder="Workout Name"
          placeholderTextColor={colors.textSecondary}
        />
        <CreateBox  onPress={del} iconName='trash'/>
        </View>
        
        

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

            <View>
            <NumberWheel
                      min={1}
                      max={30}
                      value={3}
                      onValueChange={back}
                      width={90}
                      suffix=' Sets'
                      visibleItems={3}
            />

            </View>

            <CreateBox  onPress={back} iconName='trash'/>

            
            
          </View>
        ))}

        <CreateBox  onPress={addWorkout} iconName='add' text='Add workout'/>
      </ScrollView>
    </View>
  );
}
