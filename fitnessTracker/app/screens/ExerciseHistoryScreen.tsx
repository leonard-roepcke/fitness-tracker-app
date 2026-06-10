import { useSessions } from '@/context/SessionContext';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import AppContainer from '../components/ui/AppContainer';
import { useAppContext } from '../hooks/useAppContext';
import { useLanguage } from '../hooks/useLanguage';
import {
  buildExerciseTimeline,
  getBestSet,
  getMaxWeightTimeline,
} from '../utils/exerciseHistory';
import { isSetPR } from '../utils/personalRecords';
import { formatSessionDate } from '../utils/sessionHistory';

export default function ExerciseHistoryScreen({ route }: any) {
  const { colors, layouts, text } = useAppContext();
  const { language } = useLanguage();
  const params = useSearchParams();
  const { sessions } = useSessions();
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const rawExerciseId =
    route?.params?.exerciseId ??
    ((params as any).get ? (params as any).get('exerciseId') : (params as any).exerciseId);
  const exerciseId = rawExerciseId as string;
  const exerciseName =
    route?.params?.exerciseName ??
    ((params as any).get ? (params as any).get('exerciseName') : (params as any).exerciseName) ??
    text.exerciseHistoryHeading;

  const timeline = useMemo(
    () => buildExerciseTimeline(sessions, exerciseId),
    [sessions, exerciseId]
  );

  const bestSet = useMemo(
    () => getBestSet(sessions.filter((s) => s.status === 'completed'), exerciseId),
    [sessions, exerciseId]
  );

  const chartData = useMemo(() => getMaxWeightTimeline(timeline), [timeline]);

  const chartContent = useMemo(() => {
    if (chartData.length < 2 || chartSize.width === 0 || chartSize.height === 0) return null;

    const weights = chartData.map((d) => d.maxWeight);
    const min = Math.min(...weights) - 2;
    const max = Math.max(...weights) + 2;
    const range = max - min || 1;

    const points = weights
      .map((weight, index) => {
        const x = (index / (weights.length - 1 || 1)) * chartSize.width;
        const y = chartSize.height - ((weight - min) / range) * chartSize.height;
        return `${x},${y}`;
      })
      .join(' ');

    const circles = weights.map((weight, index) => {
      const x = (index / (weights.length - 1 || 1)) * chartSize.width;
      const y = chartSize.height - ((weight - min) / range) * chartSize.height;
      return { x, y, key: index };
    });

    return { points, circles };
  }, [chartData, chartSize]);

  const styles = StyleSheet.create({
    scrollContent: { paddingBottom: 100 },
    bestRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    bestCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: layouts.borderRadiusLarge,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
    },
    bestLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    bestValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primaryDark,
    },
    chartContainer: {
      height: 120,
      marginBottom: 16,
    },
    entryCard: {
      backgroundColor: colors.card,
      borderRadius: layouts.borderRadiusLarge,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 8,
    },
    entryHeader: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    entrySub: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    setRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 2,
    },
    setText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    setTextPR: {
      fontSize: 13,
      color: colors.warning,
      fontWeight: '600',
    },
    empty: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginTop: 40,
    },
  });

  return (
    <AppContainer backbutton={true} heading={exerciseName as string} isBar={true}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {bestSet && (
          <View style={styles.bestRow}>
            <View style={styles.bestCard}>
              <Text style={styles.bestLabel}>{text.exerciseBestWeight}</Text>
              <Text style={styles.bestValue}>{bestSet.weight} kg</Text>
            </View>
            <View style={styles.bestCard}>
              <Text style={styles.bestLabel}>{text.exerciseBestReps}</Text>
              <Text style={styles.bestValue}>{bestSet.reps}</Text>
            </View>
          </View>
        )}

        {chartContent && (
          <View
            style={styles.chartContainer}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              if (width > 0 && height > 0) setChartSize({ width, height });
            }}
          >
            <Svg width={chartSize.width} height={chartSize.height}>
              <Polyline
                points={chartContent.points}
                fill="none"
                stroke={colors.primary}
                strokeWidth="2"
              />
              {chartContent.circles.map((circle) => (
                <Circle
                  key={circle.key}
                  cx={circle.x}
                  cy={circle.y}
                  r="4"
                  fill={colors.primary}
                />
              ))}
            </Svg>
          </View>
        )}

        {timeline.length === 0 ? (
          <Text style={styles.empty}>{text.exerciseHistoryEmpty}</Text>
        ) : (
          timeline.map((entry) => (
            <View key={entry.sessionId} style={styles.entryCard}>
              <Text style={styles.entryHeader}>
                {formatSessionDate(entry.dateISO, language)}
              </Text>
              <Text style={styles.entrySub}>{entry.workoutName}</Text>
              {entry.sets.map((set) => {
                const isPR = isSetPR(
                  sessions.filter((s) => s.status === 'completed' && s.id !== entry.sessionId),
                  exerciseId,
                  set.weight,
                  set.reps
                ) || (
                  sessions.find((s) => s.id === entry.sessionId)?.completedAt ===
                  Math.max(...sessions.filter(s => s.status === 'completed').map(s => s.completedAt ?? 0))
                  && set.weight === entry.maxWeight
                );
                return (
                <View key={set.setIndex} style={styles.setRow}>
                  <Text style={styles.setText}>
                    {text.set} {set.setIndex + 1}
                  </Text>
                  <Text style={isPR ? styles.setTextPR : styles.setText}>
                    {set.weight} kg × {set.reps}{isPR ? ` ${text.prBadge}` : ''}
                  </Text>
                </View>
              );})}
            </View>
          ))
        )}
      </ScrollView>
    </AppContainer>
  );
}
