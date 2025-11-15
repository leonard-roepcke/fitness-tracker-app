import React, { useState } from 'react';
import { View,ScrollView, Text, StyleSheet } from 'react-native';
import { WorkoutBox } from '../components/WorkoutBox';
import { CreateBox } from '../components/CreateBox';
import { Workout } from "../../types/workout";


export default function OverviewScreen() {
    const [workouts, setWorkouts] = useState<Workout[]>([
        { id: 0, name: "Push", exercises: ["Bench", "Dips"] },
        { id: 1, name: "Pull", exercises: ["Rows", "Curls"] },
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        //justifyContent: 'center',
        padding: 16,
        backgroundColor: '#000000',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
    },
    scrollView: {
        width: '100%',
    },
});
