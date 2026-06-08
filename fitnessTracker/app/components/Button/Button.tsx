import Layouts from "@/app/constants/Layouts";
import GradientSurface from "@/app/components/ui/GradientSurface";
import { cardShadow } from "@/app/utils/shadows";
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ButtonText from '@/app/components/ui/ButtonText';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false
}) => {
  const colors = useTheme();
  const layouts = Layouts;

  const styles = StyleSheet.create({
    button: {
      borderRadius: layouts.borderRadius,
      minWidth: 200,
      alignItems: 'center',
      overflow: 'hidden',
      width: fullWidth ? '100%' : undefined,
    },
    buttonInner: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: 'center',
      width: '100%',
    },
    buttonSecondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: layouts.borderRadius,
      minWidth: 200,
      alignItems: 'center',
      width: fullWidth ? '100%' : undefined,
      ...cardShadow(colors),
    },
    buttonDestructive: {
      backgroundColor: colors.danger,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: layouts.borderRadius,
      minWidth: 200,
      alignItems: 'center',
      width: fullWidth ? '100%' : undefined,
      ...cardShadow(colors),
    },
    buttonDisabled: {
      backgroundColor: colors.border,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: layouts.borderRadius,
      minWidth: 200,
      alignItems: 'center',
      width: fullWidth ? '100%' : undefined,
    },
    buttonText: {
      fontWeight: '600',
      letterSpacing: -0.4,
      textAlign: 'center',
    },
    buttonTextPrimary: {
      color: '#FFFFFF',
    },
    buttonTextSecondary: {
      color: colors.primaryDark,
    },
    buttonTextDestructive: {
      color: '#FFFFFF',
    },
    buttonTextDisabled: {
      color: colors.textSecondary,
    },
  });

  const getTextStyle = () => {
    if (disabled) return [styles.buttonText, styles.buttonTextDisabled];

    switch (variant) {
      case 'secondary':
        return [styles.buttonText, styles.buttonTextSecondary];
      case 'destructive':
        return [styles.buttonText, styles.buttonTextDestructive];
      default:
        return [styles.buttonText, styles.buttonTextPrimary];
    }
  };

  const label = (
    <ButtonText baseFontSize={17} minFontSize={12} style={getTextStyle()}>
      {title}
    </ButtonText>
  );

  if (disabled) {
    return (
      <View style={styles.buttonDisabled}>
        {label}
      </View>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={onPress}
        activeOpacity={1}
      >
        {label}
      </TouchableOpacity>
    );
  }

  if (variant === 'destructive') {
    return (
      <TouchableOpacity
        style={styles.buttonDestructive}
        onPress={onPress}
        activeOpacity={1}
      >
        {label}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, cardShadow(colors)]}
      onPress={onPress}
      activeOpacity={1}
    >
      <GradientSurface>
        <View style={styles.buttonInner}>
          {label}
        </View>
      </GradientSurface>
    </TouchableOpacity>
  );
};
