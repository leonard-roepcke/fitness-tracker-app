import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Layout from '../../constants/Layouts';
import { cardShadow } from '../../utils/shadows';
import { useTheme } from "../../hooks/useTheme";
import ButtonText from '../ui/ButtonText';
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
        touchable: {
            marginVertical: isBorderless ? 0 : layout.marginVertical,
            borderRadius: layout.borderRadius,
            overflow: 'hidden',
            alignSelf: isLargeButton ? 'stretch' : 'auto',
            ...(isBorderless ? {} : cardShadow(colors)),
        },
        gradientFill: {
            borderRadius: layout.borderRadius,
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
        textWrap: {
            flexShrink: 1,
            minWidth: 0,
            marginLeft: 8,
        },
        textPrimary: {
            color: '#FFFFFF',
            fontWeight: '600',
            textAlign: 'center',
        },
        textDefault: {
            color: colors.text,
            fontWeight: '600',
            textAlign: 'center',
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
                <View style={styles.textWrap}>
                    <ButtonText
                        baseFontSize={16}
                        minFontSize={12}
                        style={isLargeButton ? styles.textPrimary : styles.textDefault}
                    >
                        {text}
                    </ButtonText>
                </View>
            )}
        </View>
    );

    if (isBorderless) {
        return (
            <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={1}>
                {content}
            </TouchableOpacity>
        );
    }

    if (isLargeButton) {
        return (
            <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={1}>
                <GradientSurface
                    style={styles.gradientFill}
                    variant={isAccent ? 'primary' : 'surface'}
                >
                    {content}
                </GradientSurface>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={1}>
            {content}
        </TouchableOpacity>
    );
};
