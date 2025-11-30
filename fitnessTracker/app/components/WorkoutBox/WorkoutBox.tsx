import { useNavigation } from '@react-navigation/native';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Workout } from '../../types/workout';
import { CreateBox } from '../CreateBox';

const WorkoutBox = ({ workout, variant = "default" }: { workout: Workout | string, variant?: string }) => {
    const colors = useTheme();
    const navigation: any = useNavigation();

    const isString = typeof workout === "string";
    const name = isString ? workout : workout.name;
    const id = isString ? null : workout.id;

    const handlePress = () => {
        if (id) navigation.navigate('Workout', { workoutId: id });
    };

    const handleEditPress = () => {
        if (id) navigation.navigate('WorkoutEdit', { workoutId: id });
    };

    const handleStarPress = () => {
        // star action
    };

    const styles = StyleSheet.create({
        stripContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
            borderRadius: 12,
            marginVertical: 8,
            overflow: "hidden",
            height: 70
        },
        stripButton: {
            width: 60,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRightWidth: 0.5,
            borderColor: colors.card
        },
        stripButtonRight: {
            borderRightWidth: 0,
            borderLeftWidth: 0.5,
        },
        stripCenter: {
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
        },
        stripText: {
            color: colors.text,
            fontSize: 16,
            fontWeight: "500",
        },

        // BOX VARIANT
        boxContainer: {
            width: "100%",
            marginVertical: 8,
        },
        box: {
            backgroundColor: colors.card,
            borderRadius: 12,
            paddingTop: 16,
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 12,
            height: 120,
            justifyContent: "flex-start",
        },
        boxText: {
            color: colors.text,
            fontSize: 18,
            fontWeight: "500",
        }
    });

    // VARIANTE: default → Strip
    if (variant === "default") {
        return (
            <View style={styles.stripContainer}>

                {/* STAR LEFT */}
                <TouchableOpacity style={styles.stripButton} onPress={handleStarPress}>
                    <CreateBox iconName="star-outline" onPress={handleStarPress}/>
                </TouchableOpacity>

                {/* CENTER BOX */}
                <TouchableOpacity style={styles.stripCenter} onPress={handlePress}>
                    <Text style={styles.stripText} numberOfLines={1}>
                        {name}
                    </Text>
                </TouchableOpacity>

                {/* EDIT RIGHT */}
                <TouchableOpacity style={[styles.stripButton, styles.stripButtonRight]} onPress={handleEditPress}>
                    <CreateBox iconName="create-outline" onPress={handleEditPress}/>
                </TouchableOpacity>

            </View>
        );
    }

    // VARIANTE: box → klassische Box
    return (
        <View style={styles.boxContainer}>
            <TouchableOpacity style={styles.box} onPress={handlePress}>
                <Text style={styles.boxText} numberOfLines={1}>
                    {name}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default WorkoutBox;
