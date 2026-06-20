import { useTheme } from '@/app/hooks/useTheme';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

const LABEL_WIDTH = 40;
const PADDING_X = 12;
const PADDING_Y = 12;
const POINT_RADIUS = 4;
const GRID_LINES = 3;

type MiniLineChartProps = {
  values: number[];
  width: number;
  height: number;
  formatLabel?: (value: number) => string;
  valuePadding?: number;
};

export default function MiniLineChart({
  values,
  width,
  height,
  formatLabel = (value) => String(Math.round(value)),
  valuePadding,
}: MiniLineChartProps) {
  const colors = useTheme();

  const chartContent = useMemo(() => {
    if (values.length === 0 || width === 0 || height === 0) return null;

    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const pad = valuePadding ?? Math.max((dataMax - dataMin) * 0.15, dataMax * 0.05 || 1);
    const min = dataMin - pad;
    const max = dataMax + pad;
    const range = max - min || 1;

    const plotWidth = Math.max(width - LABEL_WIDTH - PADDING_X * 2, 1);
    const plotHeight = Math.max(height - PADDING_Y * 2, 1);

    const xForIndex = (index: number) => {
      if (values.length === 1) {
        return LABEL_WIDTH + PADDING_X + plotWidth / 2;
      }
      return LABEL_WIDTH + PADDING_X + (index / (values.length - 1)) * plotWidth;
    };

    const yForValue = (value: number) =>
      PADDING_Y + plotHeight - ((value - min) / range) * plotHeight;

    const points = values
      .map((value, index) => `${xForIndex(index)},${yForValue(value)}`)
      .join(' ');

    const circles = values.map((value, index) => ({
      x: xForIndex(index),
      y: yForValue(value),
      key: index,
    }));

    const gridValues = Array.from({ length: GRID_LINES }, (_, index) => {
      const ratio = index / (GRID_LINES - 1);
      return max - ratio * range;
    });

    const gridLines = gridValues.map((value, index) => ({
      y: yForValue(value),
      label: formatLabel(value),
      key: index,
    }));

    const chartLeft = LABEL_WIDTH + PADDING_X;
    const chartRight = width - PADDING_X;

    return { points, circles, gridLines, chartLeft, chartRight };
  }, [values, width, height, formatLabel, valuePadding]);

  const styles = StyleSheet.create({
    container: {
      width,
      height,
      position: 'relative',
    },
    label: {
      position: 'absolute',
      left: 0,
      width: LABEL_WIDTH - 4,
      fontSize: 10,
      color: colors.textSecondary,
      textAlign: 'right',
    },
    border: {
      position: 'absolute',
      left: LABEL_WIDTH,
      top: PADDING_Y,
      right: PADDING_X,
      bottom: PADDING_Y,
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
  });

  if (!chartContent) return null;

  return (
    <View style={styles.container}>
      {chartContent.gridLines.map((line) => (
        <Text
          key={`label-${line.key}`}
          style={[styles.label, { top: line.y - 7 }]}
        >
          {line.label}
        </Text>
      ))}

      <View style={styles.border} pointerEvents="none" />

      <Svg width={width} height={height}>
        {chartContent.gridLines.map((line) => (
          <Line
            key={`grid-${line.key}`}
            x1={chartContent.chartLeft}
            y1={line.y}
            x2={chartContent.chartRight}
            y2={line.y}
            stroke={colors.border}
            strokeWidth="1"
            strokeDasharray="4,4"
            opacity={0.7}
          />
        ))}

        {values.length > 1 && (
          <Polyline
            points={chartContent.points}
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
          />
        )}

        {chartContent.circles.map((circle) => (
          <Circle
            key={circle.key}
            cx={circle.x}
            cy={circle.y}
            r={POINT_RADIUS}
            fill={colors.primary}
            stroke={colors.card}
            strokeWidth="1.5"
          />
        ))}
      </Svg>
    </View>
  );
}
