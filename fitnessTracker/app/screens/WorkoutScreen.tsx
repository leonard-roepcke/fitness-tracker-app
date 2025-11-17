import { useSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { NumberWheel } from '../components/NumberWheel';
import { RepWeightPicker } from '../components/RepWeightPicker';

export default function WorkoutScreen() {
    const colors = useTheme();

    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState(10);

    const params = useSearchParams();
    const workoutString = params.get('workout');
    const workout = workoutString ? JSON.parse(workoutString) : null;

    let i_exercise = 0;
    let i_set = 0;
    
    if (!workout) {
        return <Text>Workout nicht gefunden</Text>;
    }


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
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
            flex: 1,
        },
        text: {  
            fontSize: 16,
            color: colors.text,
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 22,
            fontWeight: '600',
            textAlign: 'center',
            marginTop: 12,
            marginBottom: 8,
            color: colors.text
        },
        exercise: {
            fontSize: 16,
            marginLeft: 8,
            marginBottom: 4,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{i_exercise+1}/{workout.exercises.length} {workout.name}</Text>
            <Text style={styles.subtitle}>{i_set+1}/{workout.exercises[i_exercise].sets} {workout.exercises[i_exercise].name}</Text>
            <RepWeightPicker 
                reps={reps}                    // Aktuelle Wiederholungen
                weight={sets}                    // Aktuelle Sätze
                onSetsChange={setSets}         // Handler für Sätze-Änderung
                onRepsChange={setReps}         // Handler für Reps-Änderung
            />
        </View>
    );
}
