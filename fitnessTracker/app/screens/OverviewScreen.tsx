import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Workout } from "../types/workout";
import { CreateBox } from '../components/CreateBox';
import { WorkoutBox } from '../components/WorkoutBox';
import { useTheme } from '../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWorkouts } from '../../context/WorkoutContext';

export default function OverviewScreen() {
    const [workouts, setWorkouts] = useWorkouts();
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



    const addWorkout = () => {
        if (!workouts) return;
        const newWorkout: Workout = {
            id: workouts.length,
            name: "Neuer Workout",
            exercises: [{ name: "Exercise", sets: 3, last_reps: [1,1,1], last_weight: [10,10,10] }],
            createdAt: Date.now(),
        };

        setWorkouts([...workouts, newWorkout]);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.subtitle}>Klick auf ein Workout um es zu starten</Text>
                
                {workouts?.map((w: Workout, index: number) => (<WorkoutBox key={index} workout={w} />))}

                <CreateBox  onCreate={addWorkout}/>
            </ScrollView>
        </View>
    );
}
