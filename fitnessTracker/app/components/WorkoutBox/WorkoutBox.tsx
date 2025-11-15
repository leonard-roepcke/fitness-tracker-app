import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const WorkoutBox = () => {
    return (
        <View>
            <TouchableOpacity style={styles.box}>
                <Text>Workout Box Component</Text>

            </TouchableOpacity>
        </View>
    );
}

const styles = {
    box: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: "#f70000ff",
        borderRadius: 8,
    }
};