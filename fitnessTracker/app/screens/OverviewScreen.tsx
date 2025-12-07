import { ThemeContext } from '@/context/ThemeContext';
import { useNavigation } from 'expo-router';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useWorkouts } from '../../context/WorkoutContext';
import Bar from '../components/Bar';
import { StreakFlame } from '../components/Streak';
import { WorkoutBox } from '../components/WorkoutBox';
import WStats from '../components/WStats';
import { useTheme } from '../hooks/useTheme';
import { Workout } from "../types/workout";
import CardBox from '../components/CardBox';


export default function OverviewScreen() {
    const {workouts} = useWorkouts();
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
            fontSize: 10,
            fontWeight: '600',
            marginBottom: 8,
            color: colors.text,
            justifyContent: 'center',
            alignItems: 'center',

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
        addWorkout();
    };

    const settings = () => {
        navigation.navigate('Settings');
    };

    const messages = [
        "Willkommen zurück.",
        "Gut, dass du wieder da bist.",
        "Schön, dich wieder zu sehen.",
        "Zurück im Flow.",
        "Weiter geht’s.",
        "Los geht’s.",
        "Bleib dran.",
        "Eine Runde reicht für Fortschritt."
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    return (
        <View style={styles.container}>
            <View style={{position: "absolute", top: 62, right: 10,}}>
            <StreakFlame color={colors.warning} type={'weekly'}/>
            </View>

            <View style={{position: "absolute", top: 62, left: 10,}}>
            <StreakFlame color={colors.primary} type={'daily'}/>
            </View>

            <Text style={styles.title}></Text>
            <Text style={styles.header}>Übersicht</Text>
            <Text style={styles.title}></Text>

            <ScrollView style={styles.scrollView}>
                {isWTrackerEnabled && <WStats />}
                <Text style={styles.subtitle}></Text>

                {workouts
                    ?.filter(w => w.isFavorite)
                    ?.reduce((rows: Workout[][], item: Workout, index: number) => {
                    if (index % 2 === 0) rows.push([item]);
                    else rows[rows.length - 1].push(item);
                    return rows;
                    }, [])
                    .map((row, rowIndex) => (
                    <View
                        key={rowIndex}
                        style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 10,
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
                </ScrollView>

            <Bar/>
        </View>
    );
}
