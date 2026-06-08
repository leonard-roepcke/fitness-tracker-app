import { useTracker } from "@/context/TrackerContext";
import { Flame } from "lucide-react-native";
import React,{useContext} from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeContext } from '@/context/ThemeContext';
import { useAppContext } from "@/app/hooks/useAppContext";

type StreakFlameProps = {
  size?: number;
};

export const StreakFlame: React.FC<StreakFlameProps> = ({
  size = 30,
}) => {
  const { getDailyStreak, getWeeklyStreak } = useTracker();
  const { colors } = useAppContext();
  const { isWTrackerEnabled , isDailyStreakEnabled} = useContext(ThemeContext);
  // Streak aus Context holen

  const type = isDailyStreakEnabled?'daily':'weekly';
  const streak = type === "daily" ? getDailyStreak() : getWeeklyStreak();
  const color = isDailyStreakEnabled? colors.primary : colors.warning;
  
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
  },
  streakText: {
    fontSize: 28,
    fontWeight: "bold",
    marginRight: 4,
    lineHeight: 32,
  },
});
