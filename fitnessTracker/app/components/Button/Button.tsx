// components/ui/Button.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  const [pressed, setPressed] = useState(false);

  const styles = StyleSheet.create({
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
      minWidth: 200,
      alignItems: 'center',
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width: fullWidth ? '100%' : undefined,
    },
    buttonPrimary: {
      backgroundColor: colors.card,
    },
    buttonSecondary: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.card,
    },
    buttonDestructive: {
      backgroundColor: colors.danger,
    },
    buttonDisabled: {
      backgroundColor: colors.border,
      shadowOpacity: 0,
    },
    buttonPressed: {
      opacity: 0.7,
      transform: [{ scale: 0.98 }],
    },
    buttonText: {
      fontSize: 17,
      fontWeight: '600',
      letterSpacing: -0.4,
      color: colors.text,
    },
    buttonTextPrimary: {
      color: colors.text, 
    },
    buttonTextSecondary: {
      color: colors.primary,
    },
    buttonTextDestructive: {
      color: '#FFFFFF', // Immer weiß auf destructive
    },
    buttonTextDisabled: {
      color: colors.textSecondary,
    },
  });

  const getButtonStyle = () => {
    if (disabled) return [styles.button, styles.buttonDisabled];
    
    switch (variant) {
      case 'secondary':
        return [styles.button, styles.buttonSecondary];
      case 'destructive':
        return [styles.button, styles.buttonDestructive];
      default:
        return [styles.button, styles.buttonPrimary];
    }
  };

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

  return (
    <TouchableOpacity
      style={[
        ...getButtonStyle(),
        pressed && styles.buttonPressed
      ]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};