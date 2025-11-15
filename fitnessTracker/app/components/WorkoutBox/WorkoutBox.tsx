import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const WorkoutBox = ({text}:{text:string}) => {
    return (
        <TouchableOpacity style={styles.box}>
            <View style={styles.content}>
                <Text style={styles.text}>{text}</Text>
                <TouchableOpacity>
                    <Ionicons name="create-outline" size={24} color="#c5c5c5ff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    box: {
        marginVertical: 8,
        backgroundColor: "#2b2b2bff",
        borderRadius: 5,
        padding: 16,
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        color: "#c5c5c5ff",
        fontSize: 16,
    }
});