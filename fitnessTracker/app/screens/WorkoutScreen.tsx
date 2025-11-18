import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { RepWeightPicker } from '../components/RepWeightPicker';
import { useTheme } from '../hooks/useTheme';

export default function WorkoutScreen() {
    const colors = useTheme();
    const router = useRouter();

    
    const params = useSearchParams();
    const workoutString = params.get('workout');
    const workout = workoutString ? JSON.parse(workoutString) : null;
    
    const [i_exercise, setI_exercise] = useState(0);
    const [i_set, setI_set] = useState(0);
    
    // weight und reps als lokale Zustände (frühere `sets`-Variable war verwirrend)
    const [weight, setWeight] = useState<number>(() =>
        workout ? (workout.exercises[i_exercise].last_weight?.[i_set] ?? 0) : 0
    );
    const [reps, setReps] = useState<number>(() =>
        workout ? (workout.exercises[i_exercise].last_reps?.[i_set] ?? 0) : 0
    );

    // Wenn sich die aktuelle Übung oder der Satz ändert, die Wheels auf die
    // gespeicherten last_weight / last_reps für den neuen Index setzen.
    React.useEffect(() => {
        if (!workout) return;

        const exercise = workout.exercises[i_exercise];
        const newWeight = exercise.last_weight?.[i_set] ?? 0;
        const newReps = exercise.last_reps?.[i_set] ?? 0;

        setWeight(newWeight);
        setReps(newReps);
    }, [i_exercise, i_set, workout]);

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
        if (i_set < workout.exercises[i_exercise].sets - 1) {
            //  Nächster Satz - mit State Update
            setI_set(i_set + 1);
        } else if (i_exercise < workout.exercises.length - 1) {
            //  Nächste Übung - mit State Update
            setI_exercise(i_exercise + 1);
            setI_set(0);
        } else {
            // Workout abgeschlossen
            router.push('/screens/OverviewScreen');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{i_exercise+1}/{workout.exercises.length} {workout.name}</Text>
            <Text style={styles.subtitle}>{i_set+1}/{workout.exercises[i_exercise].sets} {workout.exercises[i_exercise].name}</Text>
            <RepWeightPicker 
                reps={reps}                    // Aktuelle Wiederholungen
                weight={weight}                // Aktuelles Gewicht (vorher `sets` genannt)
                onWeightChange={setWeight}     // Handler für Gewicht
                onRepsChange={setReps}         // Handler für Reps
            />
            <Button 
                title="Next Set" 
                onPress={handlePress}
                variant="primary"
            />
        </View>
    );
}
