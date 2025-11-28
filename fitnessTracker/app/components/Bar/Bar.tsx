import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/app/hooks/useTheme";

export const Bar = () => {
    const colors = useTheme();
    const navigation: any = useNavigation();

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
                padding: 12,
                backgroundColor: colors.card,
                borderRadius: 20,
                marginHorizontal: 40,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 5,
            }}
        >
            <TouchableOpacity
                onPress={() => navigation.navigate("Overview")}
            >
                <Text style={{ color: colors.text }}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
            >
                <Text style={{ color: colors.text }}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};
