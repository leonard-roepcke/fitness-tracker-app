import Layouts from "@/app/constants/Layouts";
import { useTheme } from "@/app/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";

export const Bar = () => {
    const colors = useTheme();
    const navigation: any = useNavigation();
    const route = useRoute();

    const current = route.name;
    const layouts = Layouts;

    // aktive vs. inaktive Größe
    const activeSize = 24;
    const inactiveSize = 18;

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
                padding: 5,
                backgroundColor: colors.card,
                borderRadius: layouts.borderRadius,
                marginHorizontal: 40,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 5,
            }}
        >
            <TouchableOpacity
                onPress={() => navigation.navigate("Overview")}
                style={{ padding: 12 }}
            >
                <Ionicons
                    name="home"
                    size={current === "Overview" ? activeSize : inactiveSize}
                    color={colors.text}
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("WorkoutOverview")}
                style={{ padding: 12 }}
            >
                <FontAwesome5
                    name="dumbbell"
                    size={current === "WorkoutOverview" ? activeSize : inactiveSize}
                    color={colors.text}
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                style={{ padding: 12 }}
            >
                <Ionicons
                    name="settings"
                    size={current === "Settings" ? activeSize : inactiveSize}
                    color={colors.text}
                />
            </TouchableOpacity>

        </View>
    );
};
