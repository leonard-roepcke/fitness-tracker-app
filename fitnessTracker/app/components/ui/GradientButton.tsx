import { cardShadow } from "@/app/utils/shadows";
import Layouts from "@/app/constants/Layouts";
import React from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import ButtonText from "./ButtonText";
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
    const baseFontSize = small ? 16 : compact ? 13 : 14;
    const minFontSize = small ? 12 : compact ? 10 : 11;

    const styles = StyleSheet.create({
        button: {
            borderRadius: layouts.borderRadius,
            overflow: 'hidden',
            ...cardShadow(colors),
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
            fontWeight: '600',
            textAlign: 'center',
        },
    });

    return (
        <TouchableOpacity
            style={[styles.button, style, !active && { opacity: 0.75 }]}
            onPress={onPress}
            activeOpacity={1}
        >
            <GradientSurface variant={active ? 'primary' : 'surface'}>
                <View style={small ? styles.innerSmall : styles.inner}>
                    <ButtonText
                        baseFontSize={baseFontSize}
                        minFontSize={minFontSize}
                        style={styles.text}
                    >
                        {title}
                    </ButtonText>
                </View>
            </GradientSurface>
        </TouchableOpacity>
    );
}
