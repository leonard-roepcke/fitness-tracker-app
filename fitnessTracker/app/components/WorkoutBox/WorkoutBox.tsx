import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Workout } from '../../types/workout';
import { useTheme } from "../../hooks/useTheme";
import { useNavigation } from '@react-navigation/native';
import { CreateBox } from '../CreateBox';

const WorkoutBox = ({ workout }: { workout: Workout | string }) => {
    const colors = useTheme();
        
    const styles = StyleSheet.create({
        box: {
            marginVertical: 8,
            backgroundColor: colors.card,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            padding: 18.5,
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

    const navigation: any = useNavigation();

    const handlePress = () => {
        if (id === null || id === undefined) return;
        navigation.navigate('Workout', { workoutId: id });
    };

    const handleEditPress = () => {
        if (id === null || id === undefined) return;
        navigation.navigate('WorkoutEdit', { workoutId: id });
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
        <TouchableOpacity style={[styles.box, { flex: 1 }]} onPress={handlePress}>
            <View style={styles.content}>
                <Text style={styles.text}>{name}</Text>
                
            </View>
        </TouchableOpacity>
        <CreateBox  onPress={handleEditPress} iconName='create-outline' borderBottomLeftRadius={0} borderTopLeftRadius={0}/>
        </View>
    );
}

export default WorkoutBox;
