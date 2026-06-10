import { checkSetForPR } from '@/app/utils/personalRecords';
import { ThemeContext } from "@/context/ThemeContext";
import { useSessions } from "@/context/SessionContext";
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useWorkouts } from '../../context/WorkoutContext';
import { CreateBox } from '../components/CreateBox';
import { RepWeightPicker } from '../components/RepWeightPicker';
import { RestTimer } from '../components/RestTimer';
import GradientButton from '../components/ui/GradientButton';
import AppContainer from "../components/ui/AppContainer";
import { useAppContext } from "../hooks/useAppContext";
import { cardShadow } from "../utils/shadows";

export default function WorkoutScreen({ route, navigation }: any) {
    const { colors, nav, layouts, text } = useAppContext();
    const { workouts } = useWorkouts();
    const {
        activeSession,
        startSession,
        updateSessionSet,
        updateSessionNotes,
        getLastPerformance,
        discardActiveSession,
        sessions,
    } = useSessions();
    const { isRestTimerEnabled, restTimerDuration } = useContext(ThemeContext);
    const params = useSearchParams();
    const rawId = route?.params?.workoutId ?? ((params as any).get ? (params as any).get('workoutId') : (params as any).workoutId);
    const workoutId = Number(rawId);
    const workout = workouts?.find(w => w.id === workoutId);

    const [i_exercise, setI_exercise] = useState(0);
    const [i_set, setI_set] = useState(0);
    const [showRestTimer, setShowRestTimer] = useState(false);
    const completingTimerRef = useRef(false);
    const sessionStartedRef = useRef(false);

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (!workout || sessionStartedRef.current) return;
        if (!activeSession || activeSession.workoutId !== workout.id) {
            startSession(workout);
        }
        sessionStartedRef.current = true;
    }, [workout, activeSession, startSession]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        });
        return () => showSubscription.remove();
    }, []);

    const session = activeSession?.workoutId === workoutId ? activeSession : null;

    if (!workout || !session) {
        return (
            <AppContainer isBar={true}>
                <Text style={{ color: colors.text, textAlign: 'center', marginTop: 24 }}>
                    {text.workoutNotFound}
                </Text>
            </AppContainer>
        );
    }

    const currentSessionExercise = session.exercises[i_exercise];
    const currentSet = currentSessionExercise?.sets[i_set];
    const trackWeight = currentSessionExercise?.trackWeight !== false;
    const trackReps = currentSessionExercise?.trackReps !== false;

    const weight = currentSet?.weight ?? 0;
    const reps = currentSet?.reps ?? 0;

    const lastPerformance = getLastPerformance(
        workoutId,
        currentSessionExercise.exerciseId,
        i_set
    );

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
            minHeight: 50,
            paddingTop: 10,
            paddingBottom: 8,
            borderRadius: layouts.borderRadiusLarge,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
            ...cardShadow(colors),
        },
        lastTime: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 8,
        },
        prBadge: {
            fontSize: 13,
            fontWeight: '700',
            color: colors.warning,
            textAlign: 'center',
            marginBottom: 8,
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
            paddingBottom: 44,
            fontSize: 16,
            color: colors.text,
            backgroundColor: colors.surface,
            ...cardShadow(colors),
        },
    });

    const setWeight = (value: number) => {
        updateSessionSet(session.id, currentSessionExercise.exerciseId, i_set, { weight: value });
    };

    const setReps = (value: number) => {
        updateSessionSet(session.id, currentSessionExercise.exerciseId, i_set, { reps: value });
    };

    const saveCurrentSet = () => {
        updateSessionSet(session.id, currentSessionExercise.exerciseId, i_set, {
            reps,
            weight,
            completed: true,
        });
    };

    const advanceToNext = () => {
        const isLastSet = i_set >= currentSessionExercise.sets.length - 1;
        const isLastExercise = i_exercise >= session.exercises.length - 1;

        if (!isLastSet) {
            setI_set(i_set + 1);
        } else if (!isLastExercise) {
            setI_exercise(i_exercise + 1);
            setI_set(0);
        } else {
            nav.navigate('WorkoutEnd', { sessionId: session.id, workoutId: workout.id });
        }
    };

    const handlePress = () => {
        saveCurrentSet();

        const isLastSet = i_set >= currentSessionExercise.sets.length - 1;
        const isLastExercise = i_exercise >= session.exercises.length - 1;
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

    const back = () => {
        Alert.alert(
            text.workoutAbortTitle,
            text.workoutAbortMessage,
            [
                { text: text.workoutAbortCancel, style: 'cancel' },
                {
                    text: text.workoutAbortConfirm,
                    style: 'destructive',
                    onPress: () => {
                        discardActiveSession(session.id);
                        nav.goBack();
                    },
                },
            ]
        );
    };

    const handleEditPress = (id: number) => {
        navigation.navigate('WorkoutEdit', { workoutId: id });
    };

    const lastTimeLabel = lastPerformance
        ? `${text.lastTime}: ${lastPerformance.weight} kg × ${lastPerformance.reps}`
        : null;

    const prCheck = checkSetForPR(
        sessions,
        currentSessionExercise.exerciseId,
        weight,
        reps,
        session.id
    );
    const isPR = prCheck.isWeightPR || prCheck.isVolumePR;

    return (
        <AppContainer isBar={true} scrolable={true}>
            <View style={{ height: 60, justifyContent: 'center' }}>
                <Text style={[styles.title, { position: 'absolute', left: 0, right: 0, textAlign: 'center', height: 60, paddingTop: 18 }]}>
                    {i_exercise + 1}/{session.exercises.length} {session.workoutName}
                </Text>

                <View style={{ position: 'absolute', left: 0, top: 0 }}>
                    <CreateBox onPress={back} iconName='arrow-back' variant='borderless' />
                </View>

                <View style={{ position: 'absolute', right: 0, top: 0 }}>
                    <CreateBox onPress={() => handleEditPress(workout.id)} iconName='create-outline' variant='borderless' />
                </View>
            </View>

            <Text style={[styles.subtitle, { marginTop: 5 }]}>
                {i_set + 1}/{currentSessionExercise.sets.length} {currentSessionExercise.name}
            </Text>

            {lastTimeLabel && (
                <Text style={styles.lastTime}>{lastTimeLabel}</Text>
            )}

            {isPR && weight > 0 && (
                <Text style={styles.prBadge}>{text.prBadge}</Text>
            )}

            <RepWeightPicker
                reps={reps}
                weight={weight}
                onWeightChange={setWeight}
                onRepsChange={setReps}
                showReps={trackReps}
                showWeight={trackWeight}
            />

            <GradientButton title={text.nextSet} onPress={handlePress} />

            <View style={styles.notesWrapper}>
                <TextInput
                    style={styles.textBox}
                    multiline={true}
                    placeholder={text.workoutNotesPlaceholder}
                    placeholderTextColor={colors.border}
                    value={session.notes ?? ''}
                    onChangeText={(value) => {
                        updateSessionNotes(session.id, value);
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }}
                />
            </View>

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
