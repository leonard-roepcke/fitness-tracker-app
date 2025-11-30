import { ThemeContext } from '@/context/ThemeContext';
import { useNavigation } from 'expo-router';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useWorkouts } from '../../context/WorkoutContext';
import Bar from '../components/Bar';
import { WorkoutBox } from '../components/WorkoutBox';
import WStats from '../components/WStats';
import { useTheme } from '../hooks/useTheme';
import { Workout } from "../types/workout";


export default function OverviewScreen() {
    const {workouts, addWorkouts} = useWorkouts();
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
    });



    const addWorkout = () => {
        if (!workouts) return;
        addWorkout();
    };

    const settings = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}></Text>
            <Text style={styles.title}></Text>

            <ScrollView style={styles.scrollView}>
                {isWTrackerEnabled && <WStats />}
                <Text style={styles.subtitle}></Text>

                {
    workouts
  ?.filter(w => w.isFavorite)   // nur favorisierte Workouts
  ?.reduce((rows: Workout[][], item: Workout, index: number) => {
      if (index % 2 === 0) rows.push([item]);
      else rows[rows.length - 1].push(item);
      return rows;
  }, [])
  .map((row, rowIndex) => (
      <View
          key={rowIndex}
          style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}
      >
          {row.map((w, i) => (
              <View key={i} style={{ flex: 1, marginHorizontal: 4 }}>
                  <WorkoutBox variant="box" workout={w} />
              </View>
          ))}
          {row.length === 1 && <View style={{ flex: 1, marginHorizontal: 4 }} />}
      </View>
  ))
}

                
            </ScrollView>
            <Bar/>
        </View>
    );
}
