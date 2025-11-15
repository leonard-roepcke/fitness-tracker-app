import { useSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { View,ScrollView, Text, StyleSheet } from 'react-native';


export default function WorkoutScreen() {
    const params = useSearchParams(); // Parameter aus URL
    const workoutName = params.get('name') ?? 'Workout';
    
    return (
        <View>
            <ScrollView>
                <Text>{workoutName}</Text>
            </ScrollView>
        </View>
    );
}