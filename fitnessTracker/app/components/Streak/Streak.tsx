import { useTracker } from "@/context/TrackerContext";
import { Flame } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type StreakFlameProps = {
  color: string;
  type: "daily" | "weekly";
  size?: number;
};

export const StreakFlame: React.FC<StreakFlameProps> = ({
  color,
  type,
  size = 38,
}) => {
  const { getDailyStreak, getWeeklyStreak } = useTracker();
  
  // Streak aus Context holen
  const streak = type === "daily" ? getDailyStreak() : getWeeklyStreak();

  return (
    <View style={styles.container}>
      <Text style={[styles.streakText, { color }]}>{streak}</Text>
      <Flame size={size} color={color} fill={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  streakText: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
});