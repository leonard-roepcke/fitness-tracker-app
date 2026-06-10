import { useSessions } from "@/context/SessionContext";
import { getDailyStreakFromSessions, getWeeklyStreakFromSessions } from "@/app/utils/sessionStreak";
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
  const { colors } = useAppContext();
  const { isDailyStreakEnabled } = useContext(ThemeContext);
  const { sessions } = useSessions();
  const type = isDailyStreakEnabled ? 'daily' : 'weekly';
  const streak = type === "daily"
    ? getDailyStreakFromSessions(sessions)
    : getWeeklyStreakFromSessions(sessions);
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
