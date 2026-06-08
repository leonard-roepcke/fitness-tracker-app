import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type GradientSurfaceProps = {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'primary' | 'surface';
    colors?: [string, string, ...string[]];
};

export default function GradientSurface({
    children,
    style,
    variant = 'primary',
    colors: overrideColors,
}: GradientSurfaceProps) {
    const colors = useTheme();

    const gradientColors = overrideColors ?? (
        variant === 'primary'
            ? [colors.primaryLight, colors.primary, colors.primaryDark]
            : [colors.card, colors.surface]
    );

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, style]}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        overflow: 'hidden',
    },
});
