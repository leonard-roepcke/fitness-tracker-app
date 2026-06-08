import { cardShadow } from "@/app/utils/shadows";
import Layouts from "@/app/constants/Layouts";
import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
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
            alignSelf: 'stretch',
            width: '100%',
            ...cardShadow(colors),
        },
        pressed: {
            opacity: 0.82,
        },
        gradientFill: {
            width: '100%',
        },
        inner: {
            width: '100%',
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
        <Pressable
            style={({ pressed }) => [
                styles.button,
                style,
                !active && { opacity: 0.75 },
                pressed && active && styles.pressed,
            ]}
            onPress={onPress}
            delayPressIn={0}
        >
            <GradientSurface variant={active ? 'primary' : 'surface'} style={styles.gradientFill}>
                <View style={small ? styles.innerSmall : styles.inner}>
                    <Text style={styles.text}>{title}</Text>
                </View>
            </GradientSurface>
        </Pressable>
    );
}
