import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
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
  const [setsModalIndex, setSetsModalIndex] = useState<number | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [focusedInputKey, setFocusedInputKey] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);
  const inputRefs = useRef<Record<string, View | null>>({});

  const scrollToInput = (key: string | null) => {
    const inputRef = key ? inputRefs.current[key] : null;
    if (!inputRef || !contentRef.current) return;

    inputRef.measureLayout(
      contentRef.current,
      (_x, y) => {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 20), animated: true });
      },
      () => {}
    );
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => scrollToInput(focusedInputKey), 50);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [focusedInputKey]);

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
    pickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
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
    field: 'trackWeight' | 'trackReps'
  ) => {
    const updated = [...workouts];
    const current = updated[index].exercises[exerciseIndex][field] !== false;
    updated[index].exercises[exerciseIndex] = {
      ...updated[index].exercises[exerciseIndex],
      [field]: !current,
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 60 + keyboardHeight,
          paddingTop: insets.top + 8,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View ref={contentRef}>
        <View
          ref={(ref) => { inputRefs.current.workoutName = ref; }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}
        >
          <CreateBox onPress={back} iconName='arrow-back' variant='borderless' />
          <TextInput
            style={[styles.input, { flex: 1, height: 50 }]}
            value={workout.name}
            onChangeText={handleWorkoutNameChange}
            placeholder="Workout Name"
            placeholderTextColor={colors.textSecondary}
            onFocus={() => {
              setFocusedInputKey('workoutName');
              scrollToInput('workoutName');
            }}
          />
          <CreateBox onPress={del} iconName='trash' variant='borderless' iconColor={colors.danger} />
        </View>

        {workout.exercises.map((exercise, exIndex) => {
          const trackWeight = exercise.trackWeight !== false;
          const trackReps = exercise.trackReps !== false;
          const setsLabel = `${exercise.sets} ${exercise.sets > 1 ? text.sets : text.set}`;

          return (
            <View key={exIndex} style={styles.exerciseCard}>
              <View
                ref={(ref) => { inputRefs.current[`exercise-${exIndex}`] = ref; }}
                style={styles.exerciseHeader}
              >
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={exercise.name}
                  onChangeText={(value) => handleExerciseChange(exIndex, value)}
                  placeholder="Exercise Name"
                  placeholderTextColor={colors.textSecondary}
                  onFocus={() => {
                    const key = `exercise-${exIndex}`;
                    setFocusedInputKey(key);
                    scrollToInput(key);
                  }}
                />
                <CreateBox
                  onPress={() => delExercise(exIndex)}
                  iconName='trash'
                  variant='borderless'
                  iconColor={colors.danger}
                />
              </View>

              <View style={styles.pickerRow}>
                <GradientButton
                  title={setsLabel}
                  onPress={() => setSetsModalIndex(exIndex)}
                  compact
                  style={{ flex: 1 }}
                />
                <GradientButton
                  title={text.trackWeight}
                  onPress={() => toggleExerciseFlag(exIndex, 'trackWeight')}
                  compact
                  active={trackWeight}
                  style={{ flex: 1 }}
                />
                <GradientButton
                  title={text.trackReps}
                  onPress={() => toggleExerciseFlag(exIndex, 'trackReps')}
                  compact
                  active={trackReps}
                  style={{ flex: 1 }}
                />
              </View>

              <CustomModal
                visible={setsModalIndex === exIndex}
                onClose={() => setSetsModalIndex(null)}
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
        </View>
      </ScrollView>

      <Bar />
    </KeyboardAvoidingView>
  );
}
