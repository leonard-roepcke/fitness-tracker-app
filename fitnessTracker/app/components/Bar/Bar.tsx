import { View, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/hooks/useTheme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export const Bar = () => {
    const colors = useTheme();
    const navigation: any = useNavigation();
    const route = useRoute();

    const current = route.name;

    // aktive vs. inaktive Größe
    const activeSize = 30;
    const inactiveSize = 24;

    return (
        <View
            style={{
                position: "absolute",
                bottom: 20,
                left: 0,
                right: 0,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                padding: 14,
                backgroundColor: colors.card,
                borderRadius: 30,
                marginHorizontal: 40,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 5,
            }}
        >
            {/* Home */}
            <TouchableOpacity onPress={() => navigation.navigate("Overview")}>
                <Ionicons
                    name="home"
                    size={current === "Overview" ? activeSize : inactiveSize}
                    color={colors.text}
                />
            </TouchableOpacity>

            {/* Workouts */}
            <TouchableOpacity onPress={() => navigation.navigate("WorkoutOverview")}>
                <FontAwesome5
                    name="dumbbell"
                    size={current === "WorkoutOverview" ? activeSize : inactiveSize}
                    color={colors.text}
                />
            </TouchableOpacity>

            {/* Settings */}
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Ionicons
                    name="settings"
                    size={current === "Settings" ? activeSize : inactiveSize}
                    color={colors.text}
                />
            </TouchableOpacity>
        </View>
    );
};
