import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Workout } from "../types/workout";
import { CreateBox } from '../components/CreateBox';
import { WorkoutBox } from '../components/WorkoutBox';
import { useTheme } from '../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


    const [workouts, setWorkouts] = useState<Workout[] | null>(null);

    const addWorkout = () => {
        if (!workouts) return;
        const newWorkout: Workout = {
            id: workouts.length,
            name: "Neuer Workout",
            exercises: [{ name: "Exercise", sets: 3, last_reps: [1,1,1], last_weight: [10,10,10] }],
        };

        setWorkouts([...workouts, newWorkout]);
    };

    useEffect(() => {
        const loadWorkouts = async () => {
            try {
            const json = await AsyncStorage.getItem('workouts');
            if (json) {
                setWorkouts(JSON.parse(json));
            } else {
                // Wenn noch nichts im Speicher ist → initiale Werte setzen
                setWorkouts([
                { 
                    id: 0, 
                    name: "Push", 
                    exercises: [
                    { name: "Bench Press", sets: 3, last_reps: [10,4,0], last_weight: [20,18,0] },
                    { name: "Dips", sets: 4, last_reps: [0,0,0,0], last_weight: [0,0,0,0] }
                    ],
                    createdAt: Date.now()
                },
                { 
                    id: 1, 
                    name: "Pull", 
                    exercises: [
                    { name: "Klimzüge", sets: 3, last_reps: [10,4,10], last_weight: [20,18,10] },
                    { name: "zusammen dinger :)", sets: 3, last_reps: [1,0,0], last_weight: [2,0,0] }
                    ],
                    createdAt: Date.now()
                }
                ]);
            }
            } catch (e) {
            console.log("Fehler beim Laden", e);
            }
        };

        loadWorkouts();
        }, []);
    
    useEffect(() => {
        if (workouts !== null) {
            AsyncStorage.setItem('workouts', JSON.stringify(workouts));
        }
    }, [workouts]);



    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.subtitle}>Klick auf ein Workout um es zu starten</Text>
                
                {workouts?.map((w, index) => (<WorkoutBox key={index} workout={w} />))}

                <CreateBox  onCreate={addWorkout}/>
            </ScrollView>
        </View>
    );
}
