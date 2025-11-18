// components/ui/SetRepPicker.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { NumberWheel } from '../NumberWheel';

interface RepWeightPickerProps {
  reps: number;
  weight: number;
  onWeightChange: (weight: number) => void;
  onRepsChange: (reps: number) => void;
}

export const RepWeightPicker: React.FC<RepWeightPickerProps> = ({
  reps,
  weight,
  onWeightChange,
  onRepsChange
}) => {
  const colors = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
    },
    wheelContainer: {
      alignItems: 'center',
      marginHorizontal: 0,
    },
    label: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    separator: {
      fontSize: 18,
      color: colors.text,
      marginTop: 40,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <NumberWheel
          min={0}
          max={30}
          value={reps}
          onValueChange={onRepsChange}
          width={90}
          suffix=' Reps'
        />
      </View>

      <View style={styles.wheelContainer}>
        <NumberWheel
          min={0}
          max={300}
          value={weight}
          onValueChange={onWeightChange}
          width={90}
          suffix=' kg'
        />
      </View>

    </View>
  );
};