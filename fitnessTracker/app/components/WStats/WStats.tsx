import Layouts from "@/app/constants/Layouts";
import { useTheme } from '@/app/hooks/useTheme';
import { useWeights } from '@/context/WeightContext';
import CustomModal from '@/app/components/CustomModal';
import CardBox from '@/app/components/CardBox';
import GradientButton from '@/app/components/ui/GradientButton';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

const layouts = Layouts;

export default function WStats() {
  const colors = useTheme();
  const { weights, addWeight } = useWeights();
  const [showModal, setShowModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const stats = useMemo(() => {
    if (!weights || weights.length === 0) return null;

    const weightValues = weights.map(w => w.weight);
    const current = weightValues[weightValues.length - 1];
    const change = weightValues.length > 1 ? current - weightValues[0] : 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const lastWeekWeights = weights.filter(w => new Date(w.date) >= oneWeekAgo);
    const weekAverage = lastWeekWeights.length > 0
      ? lastWeekWeights.reduce((sum, w) => sum + w.weight, 0) / lastWeekWeights.length
      : current;

    return { current, change, weightValues, weekAverage };
  }, [weights]);

  const chartContent = useMemo(() => {
    if (!stats || chartSize.width === 0 || chartSize.height === 0) return null;

    const values = stats.weightValues;
    const min = Math.min(...values) - 2;
    const max = Math.max(...values) + 2;
    const range = max - min || 1;

    const points = values.map((weight, index) => {
      const x = (index / (values.length - 1 || 1)) * chartSize.width;
      const y = chartSize.height - ((weight - min) / range) * chartSize.height;
      return `${x},${y}`;
    }).join(' ');

    const circles = values.map((weight, index) => {
      const x = (index / (values.length - 1 || 1)) * chartSize.width;
      const y = chartSize.height - ((weight - min) / range) * chartSize.height;
      return { x, y, key: index };
    });

    return { points, circles };
  }, [stats, chartSize]);

  const handleAddWeight = async () => {
    if (newWeight && !isNaN(parseFloat(newWeight))) {
      await addWeight(parseFloat(newWeight));
      setNewWeight('');
      setShowModal(false);
    }
  };

  const handleNumberPress = (num: string) => setNewWeight(prev => prev + num);
  const handleCommaPress = () => { if (!newWeight.includes('.')) setNewWeight(prev => prev + '.'); };
  const handleBackspace = () => setNewWeight(prev => prev.slice(0, -1));

  const renderNumPad = () => {
    const numbers = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'], [',', '0', '←']];
    return (
      <View style={styles.numPad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numPadRow}>
            {row.map((btn) => (
              <Pressable
                key={btn}
                style={({ pressed }) => [
                  styles.numButton,
                  { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
                  pressed && styles.numButtonPressed,
                ]}
                onPress={() => {
                  if (btn === '←') handleBackspace();
                  else if (btn === ',') handleCommaPress();
                  else handleNumberPress(btn);
                }}
                delayPressIn={0}
              >
                <Text style={[styles.numButtonText, { color: colors.text }]}>{btn}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderModal = () => (
    <CustomModal
      visible={showModal}
      onClose={() => { setShowModal(false); setNewWeight(''); }}
      showCloseButton={false}
    >
      <View style={styles.modalContent}>
        <Text style={[styles.modalTitle, { color: colors.text }]}>Gewicht hinzufügen</Text>
        <View style={[styles.display, { borderColor: colors.primary }]}>
          <Text style={[styles.displayText, { color: colors.text }]}>{newWeight || '0'} kg</Text>
        </View>
        {renderNumPad()}
        <View style={styles.buttonRow}>
          <GradientButton title="Speichern" onPress={handleAddWeight} style={{ flex: 1 }} />
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              { borderColor: colors.border, backgroundColor: colors.surface },
              pressed && styles.cancelButtonPressed,
            ]}
            onPress={() => { setShowModal(false); setNewWeight(''); }}
            delayPressIn={0}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Abbrechen</Text>
          </Pressable>
        </View>
      </View>
    </CustomModal>
  );

  if (!stats) {
    return (
      <CardBox>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Gewicht</Text>
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>Noch keine Einträge</Text>
          </View>
          <GradientButton title="+ Hinzufügen" onPress={() => setShowModal(true)} />
        </View>
        {renderModal()}
      </CardBox>
    );
  }

  const changeColor = stats.change < 0 ? '#10b981' : stats.change > 0 ? '#ef4444' : colors.text;

  return (
    <CardBox>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>Gewicht</Text>
            <View style={styles.compactStats}>
              <Text style={[styles.compactText, { color: colors.text }]}>Ø {stats.weekAverage.toFixed(1)}kg</Text>
              <Text style={[styles.compactText, { color: changeColor }]}>
                {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)}kg
              </Text>
            </View>
          </View>
          <GradientButton title="+" onPress={() => setShowModal(true)} small />
        </View>

        <View
          style={styles.chartContainer}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            if (width > 0 && height > 0) setChartSize({ width, height });
          }}
        >
          {chartContent && (
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
          )}
        </View>
      </View>
      {renderModal()}
    </CardBox>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  compactStats: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  compactText: { fontSize: 14, fontWeight: '500' },
  chartContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { opacity: 0.6, fontSize: 14 },
  modalContent: { padding: 4 },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  display: { borderWidth: 2, borderRadius: layouts.borderRadius, padding: 16, marginBottom: 16, alignItems: 'center' },
  displayText: { fontSize: 32, fontWeight: '600' },
  numPad: { marginBottom: 16 },
  numPadRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  numButton: { flex: 1, aspectRatio: 1.5, borderRadius: layouts.borderRadius, justifyContent: 'center', alignItems: 'center', width: '100%' },
  numButtonPressed: { opacity: 0.78 },
  numButtonText: { fontSize: 24, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 8 },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: layouts.borderRadius, borderWidth: 1, alignItems: 'center', width: '100%' },
  cancelButtonPressed: { opacity: 0.78 },
  buttonText: { fontSize: 14, fontWeight: '600' },
});
