import { ThemeContext } from '@/context/ThemeContext';
import { useNavigation } from 'expo-router';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useWorkouts } from '../../context/WorkoutContext';
import Bar from '../components/Bar';
import { CreateBox } from '../components/CreateBox';
import { WorkoutBox } from '../components/WorkoutBox';
import { useTheme } from '../hooks/useTheme';
import { Workout } from "../types/workout";


export default function WorkoutOverview() {
    const {workouts, updateWorkout} = useWorkouts();
    const colors = useTheme();
    const navigation: any = useNavigation();
    const { isWTrackerEnabled } = useContext(ThemeContext);
    

    


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
        header: {
            fontSize: 32,
            fontWeight: "bold",
            marginTop: 35,
            color: colors.text,
        },
    });



    const addWorkout = () => {
        if (!workouts) return;
        const newId = workouts.length > 0 ? Math.max(...workouts.map(w => w.id ?? 0)) + 1 : 0;
        const newWorkout: Workout = {
            id: newId,
            name: "Neuer Workout",
            exercises: [{ name: "Exercise", sets: 3, last_reps: [1,1,1], last_weight: [10,10,10]}],
            createdAt: Date.now(),
            isFavorite: false,
        };

        updateWorkout([...workouts, newWorkout]);
    };

    const settings = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}></Text>
                        <Text style={styles.header}>Trainings</Text>
                        <Text style={styles.title}></Text>

            <ScrollView style={styles.scrollView}>
                <Text style={styles.subtitle}></Text>
                
                {workouts?.map((w: Workout, index: number) => (<WorkoutBox key={index} workout={w} />))}

                <CreateBox  onPress={addWorkout} iconName='add' text='create workout'/>
                <Text style={styles.title}/>
                        <Text style={styles.title}/>
            </ScrollView>
            <Bar/>
        </View>
    );
}
