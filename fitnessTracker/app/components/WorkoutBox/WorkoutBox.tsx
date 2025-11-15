import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const WorkoutBox = ({text}:{text:string}) => {
    return (
        <TouchableOpacity style={styles.box}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    box: {
        marginVertical: 8,
        backgroundColor: "#2b2b2bff",
        borderRadius: 5,
        padding: 16,
        width: '90%',
    },
    text: {
        color: "#c5c5c5ff",
        fontSize: 16,
    }
});