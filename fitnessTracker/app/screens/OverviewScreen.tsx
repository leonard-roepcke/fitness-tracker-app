import React, { useState } from 'react';
import { View,ScrollView, Text, StyleSheet } from 'react-native';
import { WorkoutBox } from '../components/WorkoutBox';
import { CreateBox } from '../components/CreateBox';



export default function OverviewScreen() {
    const [workouts, setWorkouts] = useState(["Push", "Pull", "Leg", "Cardio"]);
    const addWorkout = () => {
        setWorkouts([...workouts, "Neuer Workout"]); 
    };
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.subtitle}>Klick auf ein Workout um es zu starten</Text>
                
                {workouts.map((w, index) => (<WorkoutBox key={index} text={w} />))}

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