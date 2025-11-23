import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { RepWeightPicker } from '../components/RepWeightPicker';
import { useTheme } from '../hooks/useTheme';
import { useWorkouts } from '../../context/WorkoutContext';
import { CreateBox } from '../components/CreateBox';


export default function WorkoutScreen({ route, navigation }: any) {
    const colors = useTheme();
    const router = useRouter();
    const nav = navigation;
    const [workouts, setWorkouts] = useWorkouts();

    const params = useSearchParams();
    // Try react-navigation route params first, otherwise fall back to expo-router search params
    const rawId = route?.params?.workoutId ?? ((params as any).get ? (params as any).get('workoutId') : (params as any).workoutId);
    const workoutId = Number(rawId);
    const workout = workouts?.find(w => w.id === workoutId);
    
    const [i_exercise, setI_exercise] = useState(0);
    const [i_set, setI_set] = useState(0);
    
    // weight und reps als lokale Zustände (frühere `sets`-Variable war verwirrend)
    const [weight, setWeight] = useState<number>(() =>
        workout ? (workout.exercises[i_exercise].last_weight?.[i_set] ?? 0) : 0
    );
    const [reps, setReps] = useState<number>(() =>
        workout ? (workout.exercises[i_exercise].last_reps?.[i_set] ?? 0) : 0
    );

    // Removed automatic syncing on index changes. Wheels will update only when
    // the user presses the "Next Set" button.

    if (!workout) {
        return <Text>Workout nicht gefunden</Text>;
    }


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: colors.background,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 0,
            marginTop: 10,
            color: colors.text,
        },
        content: {
            flex: 1,
        },
        text: {  
            fontSize: 16,
            color: colors.text,
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 22,
            fontWeight: '600',
            textAlign: 'center',
            marginTop: 12,
            marginBottom: 8,
            color: colors.text
        },
        exercise: {
            fontSize: 16,
            marginLeft: 8,
            marginBottom: 4,
        },
    });

    const [loading, setLoading] = useState(false);

    const handlePress = () => {
        if (!workout || !workouts) return;
        
        const updatedWorkouts = workouts.map(w => {
    if (w.id !== workout.id) return w;

    // Das Workout updaten
    const updatedExercises = w.exercises.map((ex, idx) => {
      if (idx !== i_exercise) return ex;

      // aktuelle Übung updaten
      const newLastWeight = [...(ex.last_weight ?? [])];
      const newLastReps = [...(ex.last_reps ?? [])];

      newLastWeight[i_set] = weight;
      newLastReps[i_set] = reps;

      return {
        ...ex,
        last_weight: newLastWeight,
        last_reps: newLastReps,
      };
    });

    return {
      ...w,
      exercises: updatedExercises,
    };
 });
 // State global updaten
 setWorkouts(updatedWorkouts);
 // Nächster Satz / nächste Übung wie gehabt
 if (i_set < workout.exercises[i_exercise].sets - 1) {
   const nextSet = i_set + 1;
   setI_set(nextSet);
   const exercise = workout.exercises[i_exercise];
   setWeight(exercise.last_weight?.[nextSet] ?? 0);
   setReps(exercise.last_reps?.[nextSet] ?? 0);
 } else if (i_exercise < workout.exercises.length - 1) {
   const nextExercise = i_exercise + 1;
   setI_exercise(nextExercise);
   setI_set(0);
   const exercise = workout.exercises[nextExercise];
   setWeight(exercise.last_weight?.[0] ?? 0);
   setReps(exercise.last_reps?.[0] ?? 0);
 } else {
     // Workout abgeschlossen
     if (nav && typeof nav.goBack === 'function') nav.goBack();
     else router.back();
 }
   };

   const back = () => {
      router.back();
   };
    return (
        <View style={styles.container}>
            <Text style={styles.title}></Text>

            <View style={{ height: 60, justifyContent: 'center' }}>
              {/* Absolute Title */}
              <Text style={[styles.title, { position: 'absolute', left: 0, right: 0, textAlign: 'center' , height:60, paddingTop:18,}]}>
                {i_exercise + 1}/{workout.exercises.length} {workout.name}
              </Text>
            
              {/* Back Button */}
              <View style={{ position: 'absolute', left: 0 , top: 0}}>
                <CreateBox onPress={back} iconName='arrow-back' />
              </View>
            </View>

            <Text/>
            <Text style={[styles.subtitle, {backgroundColor:colors.card, height:50, marginTop:5, paddingTop:8,borderRadius: 8,}]}>{i_set+1}/{workout.exercises[i_exercise].sets} {workout.exercises[i_exercise].name}</Text>
            <Text style={styles.title}></Text>
            <RepWeightPicker 
                reps={reps}                    // Aktuelle Wiederholungen
                weight={weight}                // Aktuelles Gewicht (vorher `sets` genannt)
                onWeightChange={setWeight}     // Handler für Gewicht
                onRepsChange={setReps}         // Handler für Reps
            />
            <Text style={styles.title}></Text>
            <Button 
                title="Next Set" 
                onPress={handlePress}
                variant="primary"
            />
        </View>
    );
}
