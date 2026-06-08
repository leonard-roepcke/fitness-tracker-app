import { useTracker } from "@/context/TrackerContext";
import { ThemeContext } from "@/context/ThemeContext";
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useWorkouts } from '../../context/WorkoutContext';
import { CreateBox } from '../components/CreateBox';
import CustomModal from '../components/CustomModal';
import { RepWeightPicker } from '../components/RepWeightPicker';
import { RestTimer } from '../components/RestTimer';
import { WorkoutVolumeChart } from '../components/WorkoutVolumeChart';
import GradientButton from '../components/ui/GradientButton';
import AppContainer from "../components/ui/AppContainer";
import { useAppContext } from "../hooks/useAppContext";
import { getWorkoutVolumeHistory } from '../utils/workoutVolume';
import { cardShadow } from "../utils/shadows";

export default function WorkoutScreen({ route, navigation }: any) {
    const { colors, nav, layouts, text } = useAppContext();
    const { workouts, updateWorkout } = useWorkouts();
    const { isRestTimerEnabled, restTimerDuration } = useContext(ThemeContext);
    const { showWorkoutsById, workoutLogs } = useTracker();

    const params = useSearchParams();
    const rawId = route?.params?.workoutId ?? ((params as any).get ? (params as any).get('workoutId') : (params as any).workoutId);
    const workoutId = Number(rawId);
    const workout = workouts?.find(w => w.id === workoutId);

    const [i_exercise, setI_exercise] = useState(0);
    const [i_set, setI_set] = useState(0);
    const [showRestTimer, setShowRestTimer] = useState(false);
    const [showVolumeStats, setShowVolumeStats] = useState(false);
    const completingTimerRef = useRef(false);

    const volumeHistory = useMemo(
        () => getWorkoutVolumeHistory(showWorkoutsById(workoutId)),
        [workoutLogs, workoutId]
    );

    const [weight, setWeight] = useState<number>(() =>
        workout ? (workout.exercises[i_exercise].last_weight?.[i_set] ?? 0) : 0
    );
    const [reps, setReps] = useState<number>(() =>
        workout ? (workout.exercises[i_exercise].last_reps?.[i_set] ?? 0) : 0
    );

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        });
        return () => showSubscription.remove();
    }, []);

    if (!workout) {
        return <Text>Workout nicht gefunden</Text>;
    }

    const currentExercise = workout.exercises[i_exercise];
    const trackWeight = currentExercise.trackWeight !== false;
    const trackReps = currentExercise.trackReps !== false;

    const styles = StyleSheet.create({
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 0,
            marginTop: 10,
            color: colors.text,
        },
        subtitle: {
            fontSize: 22,
            fontWeight: '600',
            textAlign: 'center',
            marginTop: 12,
            marginBottom: 8,
            color: colors.primaryDark,
            backgroundColor: colors.surface,
            height: 50,
            paddingTop: 10,
            borderRadius: layouts.borderRadiusLarge,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
            ...cardShadow(colors),
        },
        notesWrapper: {
            marginTop: 20,
            marginBottom: 70,
            position: 'relative',
        },
        textBox: {
            minHeight: 120,
            textAlignVertical: "top",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: layouts.borderRadiusLarge,
            padding: 14,
            paddingLeft: 48,
            paddingBottom: 44,
            fontSize: 16,
            color: colors.text,
            backgroundColor: colors.surface,
            ...cardShadow(colors),
        },
        statsIcon: {
            position: 'absolute',
            left: 4,
            bottom: 4,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.primaryDark,
            textAlign: 'center',
            marginBottom: 12,
        },
    });

    const saveCurrentSet = () => {
        if (!workouts) return;

        const updatedWorkouts = workouts.map(w => {
            if (w.id !== workout.id) return w;

            const updatedExercises = w.exercises.map((ex, idx) => {
                if (idx !== i_exercise) return ex;

                const newLastWeight = [...(ex.last_weight ?? [])];
                const newLastReps = [...(ex.last_reps ?? [])];

                if (ex.trackWeight !== false) {
                    newLastWeight[i_set] = weight;
                }
                if (ex.trackReps !== false) {
                    newLastReps[i_set] = reps;
                }

                return {
                    ...ex,
                    last_weight: newLastWeight,
                    last_reps: newLastReps,
                };
            });

            return { ...w, exercises: updatedExercises };
        });

        updateWorkout(updatedWorkouts);
    };

    const advanceToNext = () => {
        const isLastSet = i_set >= currentExercise.sets - 1;
        const isLastExercise = i_exercise >= workout.exercises.length - 1;

        if (!isLastSet) {
            const nextSet = i_set + 1;
            setI_set(nextSet);
            const exercise = workout.exercises[i_exercise];
            setWeight(exercise.last_weight?.[nextSet] ?? 0);
            setReps(exercise.last_reps?.[nextSet] ?? 0);
        } else if (!isLastExercise) {
            const nextExercise = i_exercise + 1;
            setI_exercise(nextExercise);
            setI_set(0);
            const exercise = workout.exercises[nextExercise];
            setWeight(exercise.last_weight?.[0] ?? 0);
            setReps(exercise.last_reps?.[0] ?? 0);
        } else {
            if (nav && typeof nav.navigate === 'function') {
                nav.navigate('WorkoutEnd', { workoutId: workout.id });
            } else {
                navigation.goBack();
            }
        }
    };

    const handlePress = () => {
        saveCurrentSet();

        const isLastSet = i_set >= currentExercise.sets - 1;
        const isLastExercise = i_exercise >= workout.exercises.length - 1;
        const hasMoreSets = !(isLastSet && isLastExercise);

        if (hasMoreSets && isRestTimerEnabled) {
            completingTimerRef.current = false;
            setShowRestTimer(true);
            return;
        }

        advanceToNext();
    };

    const handleTimerComplete = () => {
        if (completingTimerRef.current || !showRestTimer) return;
        completingTimerRef.current = true;
        setShowRestTimer(false);
        advanceToNext();
    };

    const back = () => nav.goBack();

    const handleEditPress = (id: number) => {
        navigation.navigate('WorkoutEdit', { workoutId: id });
    };

    return (
        <AppContainer isBar={true} scrolable={true}>
            <Text style={styles.title}></Text>

            <View style={{ height: 60, justifyContent: 'center' }}>
                <Text style={[styles.title, { position: 'absolute', left: 0, right: 0, textAlign: 'center', height: 60, paddingTop: 18 }]}>
                    {i_exercise + 1}/{workout.exercises.length} {workout.name}
                </Text>

                <View style={{ position: 'absolute', left: 0, top: 0 }}>
                    <CreateBox onPress={back} iconName='arrow-back' variant='borderless' />
                </View>

                <View style={{ position: 'absolute', right: 0, top: 0 }}>
                    <CreateBox onPress={() => handleEditPress(workout.id)} iconName='create-outline' variant='borderless' />
                </View>
            </View>

            <Text />
            <Text style={[styles.subtitle, { marginTop: 5 }]}>
                {i_set + 1}/{currentExercise.sets} {currentExercise.name}
            </Text>
            <Text style={styles.title}></Text>

            <RepWeightPicker
                reps={reps}
                weight={weight}
                onWeightChange={setWeight}
                onRepsChange={setReps}
                showReps={trackReps}
                showWeight={trackWeight}
            />

            <Text style={styles.title}></Text>
            <GradientButton title={text.nextSet} onPress={handlePress} />

            <View style={styles.notesWrapper}>
                <TextInput
                    style={styles.textBox}
                    multiline={true}
                    placeholder="Notizen: Schreibe hier..."
                    placeholderTextColor={colors.border}
                    value={workout.notes}
                    onChangeText={(value) => {
                        if (!workouts) return;
                        const updatedWorkouts = workouts.map(w => {
                            if (w.id !== workout.id) return w;
                            return { ...w, notes: value };
                        });
                        updateWorkout(updatedWorkouts);
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }}
                />
                <View style={styles.statsIcon}>
                    <CreateBox
                        onPress={() => setShowVolumeStats(true)}
                        iconName="stats-chart"
                        variant="borderless"
                        iconSize={22}
                    />
                </View>
            </View>

            <CustomModal visible={showVolumeStats} onClose={() => setShowVolumeStats(false)}>
                <Text style={styles.modalTitle}>{text.workoutVolumeHistory}</Text>
                <WorkoutVolumeChart entries={volumeHistory} />
            </CustomModal>

            <RestTimer
                visible={showRestTimer}
                duration={restTimerDuration}
                onComplete={handleTimerComplete}
                onSkip={handleTimerComplete}
                skipLabel={text.skipTimer}
            />
        </AppContainer>
    );
}
