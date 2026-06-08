import Layouts from "@/app/constants/Layouts";
import { cardShadow } from "@/app/utils/shadows";
import { useTracker } from '@/context/TrackerContext';
import { useWorkouts } from '@/context/WorkoutContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Workout } from '../../types/workout';
import { getWorkoutVolumeHistory } from '../../utils/workoutVolume';
import { CreateBox } from '../CreateBox';
import CustomModal from '../CustomModal';
import CardBox from "../CardBox";
import { WorkoutVolumeChart, WorkoutVolumeMiniChart } from '../WorkoutVolumeChart';

const WorkoutBox = ({ workout, variant = "default" }: { workout: Workout | string, variant?: string }) => {
    const colors = useTheme();
    const navigation: any = useNavigation();
    const layouts = Layouts;
    const { showWorkoutsById, workoutLogs } = useTracker();
    const [showVolumeStats, setShowVolumeStats] = useState(false);

    const isString = typeof workout === "string";
    const name = isString ? workout : workout.name;
    const id = isString ? null : workout.id;
    const { toggleFavorite } = useWorkouts();

    const handlePress = () => {
        if (id != null) navigation.navigate('Workout', { workoutId: id });
    };

    const handleEditPress = () => {
        if (id != null) navigation.navigate('WorkoutEdit', { workoutId: id });
    };

    const handleStarPress = () => {
        if (id != null) toggleFavorite(id);
    };

    const volumeHistory = useMemo(() => {
        if (id == null) return [];
        return getWorkoutVolumeHistory(showWorkoutsById(id));
    }, [id, workoutLogs]);

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
        box: {
            flex: 1,
            justifyContent: "flex-start",
            width: '100%',
        },
        boxPressed: {
            opacity: 0.85,
        },
        boxText: {
            color: colors.primaryDark,
            fontSize: 18,
            fontWeight: "600",
        },
        editButton: {
            position: 'absolute',
            bottom: 6,
            right: 6,
            padding: 0,
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
        <View>
            <CardBox size={0.6}>
                <Pressable
                    style={({ pressed }) => [styles.box, pressed && styles.boxPressed]}
                    onPress={handlePress}
                    delayPressIn={0}
                >
                    <Text style={styles.boxText} numberOfLines={1}>
                        {name}
                    </Text>
                </Pressable>

                <WorkoutVolumeMiniChart
                    entries={volumeHistory}
                    onPress={() => setShowVolumeStats(true)}
                />

                <View style={styles.editButton}>
                    <CreateBox
                        onPress={handleEditPress}
                        iconName="create-outline"
                        variant="borderless"
                    />
                </View>
            </CardBox>

            <CustomModal visible={showVolumeStats} onClose={() => setShowVolumeStats(false)}>
                <WorkoutVolumeChart entries={volumeHistory} />
            </CustomModal>
        </View>
    );
};

export default WorkoutBox;
