// components/SettingsBox.tsx
import { useTheme } from '@/app/hooks/useTheme';
import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import CardBox from '../CardBox';

interface SettingsBoxProps {
  title: string;
  subtitle?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  isNavigable?: boolean;
  onPress?: () => void;
}

export const SettingsBox: React.FC<SettingsBoxProps> = ({
  title,
  subtitle,
  value,
  onValueChange,
  isNavigable = false,
  onPress,
}) => {
  const colors = useTheme();

  const content = (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {/* Switch nur anzeigen, wenn value und onValueChange vorhanden sind */}
      {value !== undefined && onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#d1d5db', true: colors.primary }}
          thumbColor={value ? '#fff' : '#f4f4f5'}
        />
      )}
      
      {/* Pfeil-Icon für navigierbare Boxen */}
      {isNavigable && (
        <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
      )}
    </View>
  );

  // Wenn navigierbar, in TouchableOpacity wrappen
  if (isNavigable && onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <CardBox size={0.4}>
          {content}
        </CardBox>
      </TouchableOpacity>
    );
  }

  // Sonst normale CardBox
  return (
    <CardBox size={0.4}>
      {content}
    </CardBox>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  textContainer: {
    flex: 1,
    paddingRight: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
    marginLeft: 8,
  },
});