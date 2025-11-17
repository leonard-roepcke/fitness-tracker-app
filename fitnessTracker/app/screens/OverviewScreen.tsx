import React, { useState } from 'react';
import { View,ScrollView, Text, StyleSheet } from 'react-native';
import { WorkoutBox } from '../components/WorkoutBox';
import { CreateBox } from '../components/CreateBox';
import { Workout } from "../../types/workout";
import { useTheme } from '../hooks/useTheme';

export default function OverviewScreen() {
    const colors = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            //justifyContent: 'center',
            padding: 16,
            backgroundColor: colors.background,
        },
        title: {
            fontSize: 24,
            fontWeight: '600',
            marginBottom: 8,
            color: colors.text,

        },
        subtitle: {
            fontSize: 16,
            color: colors.textSecondary,
        },
        scrollView: {
            width: '100%',
        },
    });


    const [workouts, setWorkouts] = useState<Workout[]>([
        { 
            id: 0, 
            name: "Push", 
            exercises: [
                { name: "Bench Press", sets: 3, last_reps: [10,4], last_weight: [20,18] },
                { name: "Dips", sets: 4, last_reps: [], last_weight: [] }
            ],
            createdAt: Date.now()
        },
        { 
            id: 0, 
            name: "Pull", 
            exercises: [
                { name: "Klimzüge", sets: 3, last_reps: [10,4], last_weight: [20,18] },
                { name: "zusammen dinger :)", sets: 3, last_reps: [1], last_weight: [2] }
            ],
            createdAt: Date.now()
        },
    ]);
    const addWorkout = () => {
        const newWorkout: Workout = {
            id: workouts.length,
            name: "Neuer Workout",
            exercises: [],
        };

        setWorkouts([...workouts, newWorkout]);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.subtitle}>Klick auf ein Workout um es zu starten</Text>
                
                {workouts.map((w, index) => (<WorkoutBox key={index} workout={w} />))}

                <CreateBox  onCreate={addWorkout}/>
            </ScrollView>
        </View>
    );
}
