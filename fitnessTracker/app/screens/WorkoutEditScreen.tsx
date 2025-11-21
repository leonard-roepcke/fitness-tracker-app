import { useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function WorkoutEditScreen() {
    const colors = useTheme();
    const router = useRouter();

    
    const params = useLocalSearchParams();
    const workoutString = params.workout as string | undefined;
    const workout = workoutString ? JSON.parse(workoutString) : null;
    
    const [i_exercise, setI_exercise] = useState(0);
    const [i_set, setI_set] = useState(0);

    return(
        <View>
            <Text>Edit Workout page</Text>
        </View>
        );
}