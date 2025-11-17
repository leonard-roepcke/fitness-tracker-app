// components/ui/SetRepPicker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { NumberWheel } from '../NumberWheel';

interface SetRepPickerProps {
  sets: number;
  reps: number;
  onSetsChange: (sets: number) => void;
  onRepsChange: (reps: number) => void;
}

export const SetRepPicker: React.FC<SetRepPickerProps> = ({
  sets,
  reps,
  onSetsChange,
  onRepsChange
}) => {
  const colors = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
    },
    wheelContainer: {
      alignItems: 'center',
      marginHorizontal: 15,
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
        <Text style={styles.label}>Sätze</Text>
        <NumberWheel
          min={1}
          max={10}
          value={sets}
          onValueChange={onSetsChange}
          width={90}
        />
      </View>
      
      <Text style={styles.separator}>×</Text>
      
      <View style={styles.wheelContainer}>
        <Text style={styles.label}>Wdh.</Text>
        <NumberWheel
          min={1}
          max={30}
          value={reps}
          onValueChange={onRepsChange}
          width={90}
        />
      </View>
    </View>
  );
};