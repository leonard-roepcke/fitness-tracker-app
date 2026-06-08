import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Layout from '../../constants/Layouts';
import { subtleShadow } from '../../utils/shadows';
import { useTheme } from "../../hooks/useTheme";

type CreateBoxProps = {
    onPress?: () => void;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconSize?: number;
    iconColor?: string;
    text?: string;
    variant?: 'default' | 'accent';

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

    const styles = StyleSheet.create({
        box: {
            marginVertical: layout.marginVertical,
            backgroundColor: isAccent ? colors.primary : colors.card,
            borderRadius: layout.borderRadius,
            padding: padding ?? 16,
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
            borderWidth: isAccent ? 0 : 1,
            borderColor: colors.border,
            ...subtleShadow(colors),
        },
        text: {
            color: isAccent ? '#FFFFFF' : colors.text,
            fontSize: 16,
            fontWeight: '600',
            marginLeft: text ? 8 : 0,
        }
    });

    return (
        <TouchableOpacity style={styles.box} onPress={onPress} activeOpacity={0.75}>
            <Ionicons
                name={iconName}
                size={iconSize}
                color={iconColor ?? (isAccent ? '#FFFFFF' : colors.primary)}
            />
            {text && <Text style={styles.text}>{text}</Text>}
        </TouchableOpacity>
    );
};
