import { useTheme } from "@/app/hooks/useTheme";
import { View, Text } from "react-native";

export default function WStats() {
    const colors = useTheme();
    return (
        <View>
            <Text style={{color: colors.text}}>Weight</Text>
        </View>
    )
}