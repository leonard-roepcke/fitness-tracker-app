import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../hooks/useTheme";

type CreateBoxProps = {
    onPress: () => void;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    iconColor?: string;
    text?: string;

    // Neue optionale Style-Overrides
    padding?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;

    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
};

export const CreateBox = ({
    onPress,
    iconName = "add",
    iconSize = 24,
    iconColor,
    text,

    // neue Props
    padding,
    paddingHorizontal,
    paddingVertical,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
}: CreateBoxProps) => {
    const colors = useTheme();
    
    const defaultRadius = 5;

    const styles = StyleSheet.create({
        box: {
            marginVertical: 8,
            backgroundColor: colors.card,
            borderRadius: 5,

            // Standard-Padding → 16
            padding: padding ?? 16,
            paddingHorizontal,
            paddingVertical,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingBottom,

            borderTopLeftRadius: borderTopLeftRadius ?? defaultRadius,
            borderTopRightRadius: borderTopRightRadius ?? defaultRadius,
            borderBottomLeftRadius: borderBottomLeftRadius ?? defaultRadius,
            borderBottomRightRadius: borderBottomRightRadius ?? defaultRadius,

            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            color: colors.text,
            fontSize: 16,
            marginLeft: text ? 8 : 0,
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

