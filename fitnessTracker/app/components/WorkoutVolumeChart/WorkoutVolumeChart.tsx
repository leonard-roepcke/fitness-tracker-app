import { VolumeHistoryEntry, formatVolumeDate } from '@/app/utils/workoutVolume';
import { useAppContext } from '@/app/hooks/useAppContext';
import { useTheme } from '@/app/hooks/useTheme';
import { useLanguage } from '@/app/hooks/useLanguage';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CHART_HEIGHT = 120;
const MAX_BARS = 8;

type WorkoutVolumeChartProps = {
  entries: VolumeHistoryEntry[];
  highlightVolume?: number;
};

export default function WorkoutVolumeChart({
  entries,
  highlightVolume,
}: WorkoutVolumeChartProps) {
  const colors = useTheme();
  const { text } = useAppContext();
  const { language } = useLanguage();

  const chartEntries = useMemo(() => {
    const sliced = entries.slice(-MAX_BARS);
    if (highlightVolume === undefined) return sliced;

    const today = new Date().toISOString().split('T')[0];
    const last = sliced[sliced.length - 1];
    if (last?.dateISO === today) {
      return sliced.map((entry, index) =>
        index === sliced.length - 1 ? { ...entry, volume: highlightVolume } : entry
      );
    }

    return [...sliced, { dateISO: today, volume: highlightVolume }].slice(-MAX_BARS);
  }, [entries, highlightVolume]);

  const maxVolume = useMemo(() => {
    const volumes = chartEntries.map((entry) => entry.volume);
    return volumes.length > 0 ? Math.max(...volumes, 1) : 1;
  }, [chartEntries]);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    title: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 12,
    },
    empty: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingVertical: 24,
    },
    barsRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 6,
      minHeight: CHART_HEIGHT + 44,
    },
    barColumn: {
      flex: 1,
      alignItems: 'center',
      maxWidth: 48,
    },
    volumeLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 4,
      textAlign: 'center',
    },
    barTrack: {
      width: '100%',
      height: CHART_HEIGHT,
      justifyContent: 'flex-end',
      backgroundColor: colors.overlay,
      borderRadius: 6,
      overflow: 'hidden',
    },
    barFill: {
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: 6,
      minHeight: 4,
    },
    barFillHighlight: {
      backgroundColor: colors.primaryDark,
    },
    dateLabel: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 6,
      textAlign: 'center',
    },
  });

  const formatVolume = (volume: number) => {
    if (volume >= 1000) return `${Math.round(volume / 100) / 10}k`;
    return String(volume);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{text.workoutVolumeHistory}</Text>
      {chartEntries.length === 0 ? (
        <Text style={styles.empty}>{text.workoutVolumeEmpty}</Text>
      ) : (
        <View style={styles.barsRow}>
          {chartEntries.map((entry, index) => {
            const barHeight = Math.max(4, (entry.volume / maxVolume) * CHART_HEIGHT);
            const isHighlight =
              highlightVolume !== undefined &&
              entry.dateISO === today &&
              index === chartEntries.length - 1;

            return (
              <View key={`${entry.dateISO}-${entry.index}`} style={styles.barColumn}>
                <Text style={styles.volumeLabel}>{formatVolume(entry.volume)}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: barHeight },
                      isHighlight && styles.barFillHighlight,
                    ]}
                  />
                </View>
                <Text style={styles.dateLabel}>
                  {formatVolumeDate(entry.dateISO, language)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
