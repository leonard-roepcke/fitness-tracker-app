import Layouts from "@/app/constants/Layouts";
import { cardShadow } from "@/app/utils/shadows";
import { useTracker } from '@/context/TrackerContext';
import { useWorkouts } from '@/context/WorkoutContext';
import { getWorkoutVolumeHistory } from '@/app/utils/workoutVolume';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Workout } from '../../types/workout';
import { CreateBox } from '../CreateBox';
import CardBox from "../CardBox";
import { WorkoutVolumeChart } from '../WorkoutVolumeChart';

const WorkoutBox = ({ workout, variant = "default" }: { workout: Workout | string, variant?: string }) => {
    const colors = useTheme();
    const navigation: any = useNavigation();
    const layouts = Layouts;
    const { showWorkoutsById, workoutLogs } = useTracker();

    const isString = typeof workout === "string";
    const name = isString ? workout : workout.name;
    const id = isString ? null : workout.id;
    const { toggleFavorite } = useWorkouts();

    const volumeHistory = useMemo(() => {
        if (id == null) return [];
        return getWorkoutVolumeHistory(showWorkoutsById(id));
    }, [id, workoutLogs]);

    const handlePress = () => {
        if (id != null) navigation.navigate('Workout', { workoutId: id });
    };

    const handleEditPress = () => {
        if (id != null) navigation.navigate('WorkoutEdit', { workoutId: id });
    };

    const handleStarPress = () => {
        if (id != null) toggleFavorite(id);
    };

    const starIcon = typeof workout === "string"
        ? "star-outline"
        : workout.isFavorite
            ? "star"
            : "star-outline";

    const styles = StyleSheet.create({
        stripContainer: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
            borderRadius: layouts.borderRadiusLarge,
            marginVertical: layouts.marginVertical,
            overflow: "hidden",
            height: 70,
            borderWidth: 1,
            borderColor: colors.border,
            ...cardShadow(colors),
        },
        stripButton: {
            width: 60,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRightWidth: 1,
            borderColor: colors.border,
        },
        stripButtonRight: {
            borderRightWidth: 0,
            borderLeftWidth: 1,
        },
        stripPressed: {
            opacity: 0.75,
            backgroundColor: colors.overlay,
        },
        stripCenter: {
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            height: "100%",
        },
        stripText: {
            color: colors.text,
            fontSize: 16,
            fontWeight: "600",
        },
        boxContainer: {
            flex: 1,
        },
        mainPress: {
            flex: 1,
            width: '100%',
        },
        boxPressed: {
            opacity: 0.85,
        },
        boxHeader: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
        },
        boxText: {
            flex: 1,
            color: colors.primaryDark,
            fontSize: 16,
            fontWeight: "600",
            paddingRight: 36,
        },
        chartArea: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        editButton: {
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 2,
        },
    });

    if (variant === "default") {
        const starColor = typeof workout !== 'string' && workout.isFavorite ? colors.warning : colors.primary;

        return (
            <View style={styles.stripContainer}>
                <Pressable
                    style={({ pressed }) => [styles.stripButton, pressed && styles.stripPressed]}
                    onPress={handleStarPress}
                    delayPressIn={0}
                >
                    <Ionicons name={starIcon} size={24} color={starColor} />
                </Pressable>

                <Pressable
                    style={({ pressed }) => [styles.stripCenter, pressed && styles.stripPressed]}
                    onPress={handlePress}
                    delayPressIn={0}
                >
                    <Text style={styles.stripText} numberOfLines={1}>
                        {name}
                    </Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [styles.stripButton, styles.stripButtonRight, pressed && styles.stripPressed]}
                    onPress={handleEditPress}
                    delayPressIn={0}
                >
                    <Ionicons name="create-outline" size={24} color={colors.primary} />
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.boxContainer}>
            <CardBox size={1.1}>
                <View style={{ flex: 1 }}>
                    <Pressable
                        style={({ pressed }) => [styles.mainPress, pressed && styles.boxPressed]}
                        onPress={handlePress}
                        delayPressIn={0}
                    >
                        <View style={styles.boxHeader}>
                            <Text style={styles.boxText} numberOfLines={2}>
                                {name}
                            </Text>
                        </View>
                        <View style={styles.chartArea}>
                            <WorkoutVolumeChart entries={volumeHistory} compact />
                        </View>
                    </Pressable>
                    <View style={styles.editButton}>
                        <CreateBox
                            onPress={handleEditPress}
                            iconName="create-outline"
                            variant="borderless"
                            iconSize={20}
                        />
                    </View>
                </View>
            </CardBox>
        </View>
    );
};

export default WorkoutBox;
