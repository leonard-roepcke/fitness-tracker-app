import { ThemeContext } from '@/context/ThemeContext';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useWorkouts } from '../../context/WorkoutContext';
import Bar from '../components/Bar';
import { CreateBox } from '../components/CreateBox';
import { WorkoutBox } from '../components/WorkoutBox';
import { Workout } from "../types/workout";
import { useAppContext } from '../hooks/useAppContext';
import AppContainer from '../components/ui/AppContainer';


export default function WorkoutOverview() {
    const {workouts, updateWorkout} = useWorkouts();
    const { isWTrackerEnabled } = useContext(ThemeContext);
    const {colors, nav, layouts} = useAppContext();    

    


    const styles = StyleSheet.create({
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
            name: "Neues Workout",
            exercises: [{ name: "Exercise", sets: 3, last_reps: [1,1,1], last_weight: [10,10,10]}],
            createdAt: Date.now(),
            isFavorite: false,
        };

        updateWorkout([...workouts, newWorkout]);
    };

    const settings = () => {
        nav.navigate('Settings');
    };

    return (
        <AppContainer heading="Workouts">

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.subtitle}></Text>
                    {workouts
                    ?.reduce((rows: Workout[][], item: Workout, index: number) => {
                    if (index % 2 === 0) rows.push([item]);
                    else rows[rows.length - 1].push(item);
                    return rows;
                    }, [])
                    .map((row:number, rowIndex:number) => (
                    <View
                        key={rowIndex}
                        style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: layouts.marginVertical,
                        }}
                    >
                        {row.map((w, i) => (
                        <View
                            key={i}
                            style={{
                            flex: 1,
                            // Nur innerer Abstand zwischen Workouts, nicht zum Rand
                            marginLeft: i === 0 ? 0 : 8,
                            marginRight: i === row.length - 1 ? 0 : 8,
                            }}
                        >
                            <WorkoutBox variant="box" workout={w} />
                        </View>
                        ))}
                    </View>
                    ))}

                <CreateBox  onPress={addWorkout} iconName='add' text='create workout'/>
                <Text style={styles.title}/>
                        <Text style={styles.title}/>
            </ScrollView>
            <Bar/>
        </AppContainer>
    );
}
