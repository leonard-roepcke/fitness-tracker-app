import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NumberWheel } from '../NumberWheel';

interface RepWeightPickerProps {
  reps: number;
  weight: number;
  onWeightChange: (weight: number) => void;
  onRepsChange: (reps: number) => void;
  showReps?: boolean;
  showWeight?: boolean;
}

export const RepWeightPicker: React.FC<RepWeightPickerProps> = ({
  reps,
  weight,
  onWeightChange,
  onRepsChange,
  showReps = true,
  showWeight = true,
}) => {
  if (!showReps && !showWeight) return null;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
      gap: 16,
    },
    wheelContainer: {
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {showReps && (
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
      )}

      {showWeight && (
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
      )}
    </View>
  );
};
