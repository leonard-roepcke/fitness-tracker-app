import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../hooks/useTheme";

type CreateBoxProps = {
    onPress: () => void;
    iconName?: keyof typeof Ionicons.glyphMap; // optional, Standard z.B. "add"
    iconSize?: number;
    iconColor?: string;
    text?: string; // optionaler Text
};

export const CreateBox = ({
    onPress,
    iconName = "add",
    iconSize = 24,
    iconColor,
    text,
}: CreateBoxProps) => {
    const colors = useTheme();

    const styles = StyleSheet.create({
        box: {
            marginVertical: 8,
            backgroundColor: colors.card,
            borderRadius: 5,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            color: colors.text,
            fontSize: 16,
            marginLeft: text ? 8 : 0, // Abstand zum Icon nur wenn Text da ist
        }
    });

    return (
        <TouchableOpacity style={styles.box} onPress={onPress}>
            <Ionicons 
                name={iconName} 
                size={iconSize} 
                color={iconColor ?? colors.text} 
            />
            {text && <Text style={styles.text}>{text}</Text>}
        </TouchableOpacity>
    );
};
