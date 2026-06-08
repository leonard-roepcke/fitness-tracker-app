import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Layout from '../../constants/Layouts';
import { subtleShadow } from '../../utils/shadows';
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

    const isAccent = variant === 'accent';
    const isBorderless = variant === 'borderless';

    const styles = StyleSheet.create({
        box: {
            marginVertical: isBorderless ? 0 : layout.marginVertical,
            backgroundColor: isBorderless ? 'transparent' : isAccent ? 'transparent' : colors.card,
            borderRadius: layout.borderRadius,
            padding: padding ?? (isBorderless ? 8 : 16),
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: isBorderless || isAccent ? 0 : 1,
            borderColor: colors.border,
            overflow: isAccent ? 'hidden' : 'visible',
            ...(isBorderless ? {} : subtleShadow(colors)),
        },
        inner: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isAccent ? (padding ?? 16) : 0,
            paddingHorizontal: isAccent ? paddingHorizontal : undefined,
            paddingVertical: isAccent ? paddingVertical : undefined,
        },
        text: {
            color: isAccent ? '#FFFFFF' : colors.text,
            fontSize: 16,
            fontWeight: '600',
            marginLeft: text ? 8 : 0,
        }
    });

    const content = (
        <>
            <Ionicons
                name={iconName}
                size={iconSize}
                color={iconColor ?? (isAccent ? '#FFFFFF' : colors.primary)}
            />
            {text && <Text style={styles.text}>{text}</Text>}
        </>
    );

    return (
        <TouchableOpacity style={styles.box} onPress={onPress} activeOpacity={0.75}>
            {isAccent ? (
                <GradientSurface style={{ borderRadius: layout.borderRadius, alignSelf: 'stretch', width: '100%' }}>
                    <View style={styles.inner}>{content}</View>
                </GradientSurface>
            ) : content}
        </TouchableOpacity>
    );
};
