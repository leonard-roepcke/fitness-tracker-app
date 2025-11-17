import { useSearchParams } from 'expo-router/build/hooks';
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function WorkoutScreen() {
    const colors = useTheme();

    const params = useSearchParams();
    const workoutString = params.get('workout');
    const workout = workoutString ? JSON.parse(workoutString) : null;

    let i_exercise = 0;
    
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
            marginBottom: 20,
            marginTop: 10,
            color: colors.text
        },
        content: {
            flex: 1,
        },
        text: {  // ✅ NEUE Style für normalen Text
            fontSize: 16,
            color: colors.text,
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 20,
            fontWeight: '600',
            marginTop: 16,
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
            <Text style={styles.title}>{workout.name} {i_exercise+1}/{workout.exercises.length} {workout.exercises[i_exercise]}</Text>
            <ScrollView style={styles.content}>

                <Text style={styles.subtitle}>Workout Details</Text>
                <Text style={styles.text}>ID: {workout.id}</Text>
                <Text style={styles.text}>Anzahl Übungen: {workout.exercises.length}</Text>
                
                
                {workout.exercises.length > 0 && (
                    <>
                        <Text style={styles.subtitle}>Übungen:</Text>
                        {workout.exercises.map((exercise: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                            <Text key={index} style={[styles.exercise ,styles.text]}>
                                • {exercise}
                            </Text>
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
}
