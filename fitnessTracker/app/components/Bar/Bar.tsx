import { View, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/hooks/useTheme";

export const Bar = () => {
    const colors = useTheme();
    const navigation: any = useNavigation();
    const route = useRoute(); // aktueller Screen

    const current = route.name; // z.B. "Overview", "Settings"

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
                    name={current === "Overview" ? "home" : "home-outline"}
                    size={28}
                    color={colors.text}
                />
            </TouchableOpacity>

            {/* Settings */}
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Ionicons
                    name={current === "Settings" ? "settings" : "settings-outline"}
                    size={28}
                    color={colors.text}
                />
            </TouchableOpacity>
        </View>
    );
};
