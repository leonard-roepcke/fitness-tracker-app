import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Workout } from "../types/workout";
import { CreateBox } from '../components/CreateBox';
import { WorkoutBox } from '../components/WorkoutBox';
import { useTheme } from '../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWorkouts } from '../../context/WorkoutContext';
import { useNavigation } from 'expo-router';

export default function OverviewScreen() {
    const [workouts, setWorkouts] = useWorkouts();
    const colors = useTheme();
    const navigation: any = useNavigation();

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
        const newId = workouts.length > 0 ? Math.max(...workouts.map(w => w.id ?? 0)) + 1 : 0;
        const newWorkout: Workout = {
            id: newId,
            name: "Neuer Workout",
            exercises: [{ name: "Exercise", sets: 3, last_reps: [1,1,1], last_weight: [10,10,10] }],
            createdAt: Date.now(),
        };

        setWorkouts([...workouts, newWorkout]);
    };

    const settings = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}></Text>
            <Text style={styles.title}></Text>

              <View style={{ position: 'absolute', right: 20 , top: 20}}>
                <CreateBox onPress={settings} iconName='settings' />
              </View>

            <ScrollView style={styles.scrollView}>
                <Text style={styles.subtitle}></Text>
                
                {workouts?.map((w: Workout, index: number) => (<WorkoutBox key={index} workout={w} />))}

                <CreateBox  onPress={addWorkout} iconName='add' text='create workout'/>
                <Text style={styles.title}/>
                        <Text style={styles.title}/>
            </ScrollView>
        </View>
    );
}
