// components/ui/SetRepPicker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { NumberWheel } from '../NumberWheel';

interface RepWeightPicker {
  reps: number;
  weight: number;
  onSetsChange: (sets: number) => void;
  onRepsChange: (reps: number) => void;
}

export const RepWeightPicker: React.FC<RepWeightPicker> = ({
  reps,
  weight,
  onSetsChange,
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
      color: 'color.text',
      marginTop: 40,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <Text style={styles.label}></Text>
        <NumberWheel
          min={1}
          max={10}
          value={weight}
          onValueChange={onSetsChange}
          width={90}
          sufix=' Reps'
        />
      </View>
      
      
      
      <View style={styles.wheelContainer}>
        <Text style={styles.label}></Text>
        <NumberWheel
          min={1}
          max={30}
          value={reps}
          onValueChange={onRepsChange}
          width={90}
          sufix=' kg'
        />
      </View>
    </View>
  );
};