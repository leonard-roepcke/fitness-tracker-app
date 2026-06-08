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
    style?: StyleProp<ViewStyle>;
};

export default function GradientButton({ title, onPress, small = false, style }: GradientButtonProps) {
    const colors = useTheme();
    const layouts = Layouts;

    const styles = StyleSheet.create({
        button: {
            borderRadius: layouts.borderRadius,
            overflow: 'hidden',
            ...cardShadow(colors),
        },
        inner: {
            paddingVertical: 12,
            paddingHorizontal: 24,
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
            color: '#FFFFFF',
            fontSize: small ? 16 : 14,
            fontWeight: '600',
        },
    });

    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <GradientSurface>
                <View style={small ? styles.innerSmall : styles.inner}>
                    <Text style={styles.text}>{title}</Text>
                </View>
            </GradientSurface>
        </TouchableOpacity>
    );
}
