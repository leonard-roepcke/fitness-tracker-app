import { useSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { NumberWheel } from '../components/NumberWheel';
import { RepWeightPicker } from '../components/RepWeightPicker';
import { Button } from '../components/Button';

export default function WorkoutScreen() {
    const colors = useTheme();

    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState(10);

    const params = useSearchParams();
    const workoutString = params.get('workout');
    const workout = workoutString ? JSON.parse(workoutString) : null;

    const [i_exercise, setI_exercise] = useState(0);
    const [i_set, setI_set] = useState(0);
    
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

    const [loading, setLoading] = useState(false);

    const handlePress = () => {
        if (i_set < workout.exercises[i_exercise].sets - 1) {
            // ✅ Nächster Satz - mit State Update
            setI_set(i_set + 1);
        } else if (i_exercise < workout.exercises.length - 1) {
            // ✅ Nächste Übung - mit State Update
            setI_exercise(i_exercise + 1);
            setI_set(0);
        } else {
            // Workout abgeschlossen
            console.log('Workout abgeschlossen!');
            // Hier könntest du zur Übersicht zurücknavigieren
        }
    };

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
            <Button 
                title="Next Set" 
                onPress={handlePress}
                variant="primary"
            />
        </View>
    );
}
