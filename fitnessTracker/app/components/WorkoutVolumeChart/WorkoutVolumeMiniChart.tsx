import { VolumeHistoryEntry } from '@/app/utils/workoutVolume';
import { useTheme } from '@/app/hooks/useTheme';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const CHART_HEIGHT = 20;
const MAX_BARS = 8;
const CHART_WIDTH = 48;

type WorkoutVolumeMiniChartProps = {
  entries: VolumeHistoryEntry[];
  onPress: () => void;
};

export default function WorkoutVolumeMiniChart({
  entries,
  onPress,
}: WorkoutVolumeMiniChartProps) {
  const colors = useTheme();

  const chartEntries = useMemo(() => entries.slice(-MAX_BARS), [entries]);

  const maxVolume = useMemo(() => {
    const volumes = chartEntries.map((entry) => entry.volume);
    return volumes.length > 0 ? Math.max(...volumes, 1) : 1;
  }, [chartEntries]);

  if (chartEntries.length === 0) {
    return null;
  }

  const styles = StyleSheet.create({
    touchable: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      padding: 8,
    },
    barsRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      gap: 2,
    },
    barColumn: {
      flex: 1,
      height: CHART_HEIGHT,
      justifyContent: 'flex-end',
    },
    barFill: {
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
      minHeight: 2,
    },
  });

  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.barsRow}>
        {chartEntries.map((entry) => {
          const barHeight = Math.max(2, (entry.volume / maxVolume) * CHART_HEIGHT);

          return (
            <View key={`${entry.dateISO}-${entry.index}`} style={styles.barColumn}>
              <View style={[styles.barFill, { height: barHeight }]} />
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}
