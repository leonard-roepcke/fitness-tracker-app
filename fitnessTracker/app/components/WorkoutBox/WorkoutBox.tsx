import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Workout } from '../../types/workout';
import { useTheme } from "../../hooks/useTheme";
import { useNavigation } from '@react-navigation/native';
import { CreateBox } from '../CreateBox';

const WorkoutBox = ({ workout, variant = "default" }: { workout: Workout | string, variant?: string }) => {
    const colors = useTheme();
    
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            marginVertical: 8,
        },
        box: {
            backgroundColor: colors.card,
            paddingHorizontal: 20,
            borderRadius: 8,
            height: 120,
            justifyContent: 'center',
        },
        boxWithActions: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        },
        content: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        text: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '500',
        },
        actionsRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        actionButton: {
            width: 50,
            height: '100%',
            backgroundColor: colors.card,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: colors.border || 'rgba(0,0,0,0.1)',
            borderWidth: 0.5,
        },
        starButton: {
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            borderRightWidth: 0,
        },
        editButton: {
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            borderLeftWidth: 0,
        }
    });

    const isString = typeof workout === "string";
    const name = isString ? workout : workout.name;
    const id = isString ? null : workout.id;
    const navigation: any = useNavigation();

    const handlePress = () => {
        if (id === null || id === undefined) return;
        navigation.navigate('Workout', { workoutId: id });
    };

    const handleEditPress = () => {
        if (id === null || id === undefined) return;
        navigation.navigate('WorkoutEdit', { workoutId: id });
    };

    const handleStarPress = () => {
        // Star functionality
    };

    if (variant === "default") {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.box} onPress={handlePress}>
                    <View style={styles.content}>
                        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    } else if (variant === "box") {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.box} onPress={handlePress}>
                    <View style={styles.content}>
                        <Text style={styles.text}>{name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
};

export default WorkoutBox;