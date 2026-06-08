import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Layout from '../../constants/Layouts';
import { cardShadow } from '../../utils/shadows';
import { useTheme } from "../../hooks/useTheme";
import GradientSurface from '../ui/GradientSurface';

type CreateBoxProps = {
    onPress?: () => void;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    iconColor?: string;
    text?: string;
    variant?: 'default' | 'accent' | 'borderless';

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
    onPress = () => {},
    iconName = "add",
    iconSize = 24,
    iconColor,
    text,
    variant = 'default',

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
    const layout = Layout;

    const isBorderless = variant === 'borderless';
    const isAccent = variant === 'accent';
    const isLargeButton = !!text && !isBorderless;

    const styles = StyleSheet.create({
        pressable: {
            marginVertical: isBorderless ? 0 : layout.marginVertical,
            borderRadius: layout.borderRadius,
            overflow: 'hidden',
            alignSelf: isLargeButton ? 'stretch' : 'auto',
            width: isLargeButton ? '100%' : undefined,
            minWidth: isBorderless ? 44 : undefined,
            minHeight: isBorderless ? 44 : undefined,
            ...(isBorderless ? {} : cardShadow(colors)),
        },
        pressed: {
            opacity: 0.78,
        },
        gradientFill: {
            borderRadius: layout.borderRadius,
            width: '100%',
        },
        inner: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: padding ?? (isBorderless ? 8 : isLargeButton ? 14 : 12),
            paddingHorizontal,
            paddingVertical,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingBottom,
            borderTopLeftRadius: borderTopLeftRadius ?? layout.borderRadius,
            borderTopRightRadius: borderTopRightRadius ?? layout.borderRadius,
            borderBottomLeftRadius: borderBottomLeftRadius ?? layout.borderRadius,
            borderBottomRightRadius: borderBottomRightRadius ?? layout.borderRadius,
        },
        compactInner: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: layout.borderRadius,
        },
        textPrimary: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
            marginLeft: 8,
        },
        textDefault: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '600',
            marginLeft: 8,
        },
    });

    const resolvedIconColor = iconColor ?? (
        isBorderless ? colors.primary :
        isLargeButton ? '#FFFFFF' : colors.primary
    );

    const content = (
        <View style={[
            styles.inner,
            !isLargeButton && !isBorderless && styles.compactInner,
        ]}>
            <Ionicons name={iconName} size={iconSize} color={resolvedIconColor} />
            {text && (
                <Text style={isLargeButton ? styles.textPrimary : styles.textDefault}>
                    {text}
                </Text>
            )}
        </View>
    );

    if (isLargeButton) {
        return (
            <Pressable
                style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
                onPress={onPress}
                delayPressIn={0}
            >
                <GradientSurface
                    style={styles.gradientFill}
                    variant={isAccent ? 'primary' : 'surface'}
                >
                    {content}
                </GradientSurface>
            </Pressable>
        );
    }

    return (
        <Pressable
            style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
            onPress={onPress}
            delayPressIn={0}
            hitSlop={isBorderless ? 4 : undefined}
        >
            {content}
        </Pressable>
    );
};
