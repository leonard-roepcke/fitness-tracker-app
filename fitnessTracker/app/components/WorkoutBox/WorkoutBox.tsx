import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Workout } from '../../../../types/workout';

const WorkoutBox = ({ text }: { text: Workout | string }) => {

    const name = typeof text === 'string' ? text : text.name;

    const handlePress = () => {
        router.push({
            pathname: '/screens/WorkoutScreen', 
            params: { name },
        });
    };

    return (
        <TouchableOpacity style={styles.box} onPress={handlePress}>
            <View style={styles.content}>
                <Text style={styles.text}>{name}</Text>
                <TouchableOpacity>
                    <Ionicons name="create-outline" size={24} color="#c5c5c5ff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

export default WorkoutBox;

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