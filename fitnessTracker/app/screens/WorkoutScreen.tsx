import { useSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { View,ScrollView, Text, StyleSheet } from 'react-native';


export default function WorkoutScreen() {
    const params = useSearchParams();
    const workoutString = params.get('workout');
    const workout = workoutString ? JSON.parse(workoutString) : null;
    if (!workout) {
        return <Text>Workout nicht gefunden</Text>;
    }
    const workoutName = workout.name;
    const workoutId = workout.id;
    
    return (
        <View>
            <ScrollView>
                <Text>{workoutName} </Text>
                <Text>{workoutId}</Text>
            </ScrollView>
        </View>
    );
}