import { cardShadow } from "@/app/utils/shadows";
import Layouts from "@/app/constants/Layouts";
import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import GradientSurface from "./GradientSurface";

type GradientButtonProps = {
    title: string;
    onPress: () => void;
    small?: boolean;
    compact?: boolean;
    active?: boolean;
    style?: StyleProp<ViewStyle>;
};

export default function GradientButton({
    title,
    onPress,
    small = false,
    compact = false,
    active = true,
    style,
}: GradientButtonProps) {
    const colors = useTheme();
    const layouts = Layouts;

    const styles = StyleSheet.create({
        button: {
            borderRadius: layouts.borderRadius,
            overflow: 'hidden',
            ...cardShadow(colors),
        },
        inner: {
            paddingVertical: compact ? 10 : 12,
            paddingHorizontal: compact ? 8 : 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        innerSmall: {
            width: 35,
            height: 35,
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            color: active ? '#FFFFFF' : colors.textSecondary,
            fontSize: small ? 16 : compact ? 13 : 14,
            fontWeight: '600',
        },
    });

    return (
        <TouchableOpacity
            style={[styles.button, style, !active && { opacity: 0.75 }]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <GradientSurface variant={active ? 'primary' : 'surface'}>
                <View style={small ? styles.innerSmall : styles.inner}>
                    <Text style={styles.text}>{title}</Text>
                </View>
            </GradientSurface>
        </TouchableOpacity>
    );
}
