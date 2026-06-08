import Layouts from "@/app/constants/Layouts";
import { elevatedShadow } from "@/app/utils/shadows";
import { useTheme } from "@/app/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const Bar = () => {
    const colors = useTheme();
    const navigation: any = useNavigation();
    const route = useRoute();

    const current = route.name;
    const layouts = Layouts;

    const activeSize = 24;
    const inactiveSize = 20;

    const styles = StyleSheet.create({
        bar: {
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            padding: 8,
            backgroundColor: colors.card,
            borderRadius: layouts.borderRadiusLarge,
            marginHorizontal: 32,
            borderWidth: 1,
            borderColor: colors.border,
            ...elevatedShadow(colors),
        },
        tab: {
            padding: 12,
            borderRadius: layouts.borderRadius,
        },
        tabActive: {
            backgroundColor: colors.overlay,
        },
    });

    const iconColor = (screen: string) =>
        current === screen ? colors.primary : colors.textSecondary;

    return (
        <View style={styles.bar}>
            <TouchableOpacity
                onPress={() => navigation.navigate("WorkoutOverview")}
                style={[styles.tab, current === "WorkoutOverview" && styles.tabActive]}
                activeOpacity={1}
            >
                <FontAwesome5
                    name="dumbbell"
                    size={current === "WorkoutOverview" ? activeSize : inactiveSize}
                    color={iconColor("WorkoutOverview")}
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("Health")}
                style={[styles.tab, current === "Health" && styles.tabActive]}
                activeOpacity={1}
            >
                <Ionicons
                    name="scale"
                    size={current === "Health" ? activeSize : inactiveSize}
                    color={iconColor("Health")}
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                style={[styles.tab, current === "Settings" && styles.tabActive]}
                activeOpacity={1}
            >
                <Ionicons
                    name="settings"
                    size={current === "Settings" ? activeSize : inactiveSize}
                    color={iconColor("Settings")}
                />
            </TouchableOpacity>
        </View>
    );
};
