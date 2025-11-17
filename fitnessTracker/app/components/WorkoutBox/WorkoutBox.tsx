import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Workout } from '../../../../types/workout';
import { useTheme } from "../../hooks/useTheme";

const WorkoutBox = ({ workout }: { workout: Workout | string }) => {
    const colors = useTheme();
        
    const styles = StyleSheet.create({
        box: {
            marginVertical: 8,
            backgroundColor: colors.card,
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
            color: colors.text,
            fontSize: 16,
        }
    });

    const isString = typeof workout === "string";

    const name = isString ? workout : workout.name;
    const id = isString ? null : workout.id;


    const handlePress = () => {
        router.push({
            pathname: '/screens/WorkoutScreen', 
            params: { 
                workout: JSON.stringify(workout)
            },
        });
    };

    return (
        <TouchableOpacity style={styles.box} onPress={handlePress}>
            <View style={styles.content}>
                <Text style={styles.text}>{name}</Text>
                <TouchableOpacity>
                    <Ionicons name="create-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

export default WorkoutBox;
