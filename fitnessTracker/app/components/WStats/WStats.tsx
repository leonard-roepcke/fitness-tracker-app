import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/app/hooks/useTheme';
import { useWeights } from '@/context/WeightContext';
import Svg, { Line, Circle, Polyline } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 120;

export default function WStats() {
  const colors = useTheme();
  const { weights, addWeight } = useWeights();
  const [showInput, setShowInput] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  // Statistiken berechnen
  const calculateStats = () => {
    if (!weights || weights.length === 0) return null;

    const weightValues = weights.map(w => w.weight);
    const current = weightValues[weightValues.length - 1];
    const highest = Math.max(...weightValues);
    const lowest = Math.min(...weightValues);
    const average = weightValues.reduce((a, b) => a + b, 0) / weightValues.length;
    const change = weightValues.length > 1 ? current - weightValues[0] : 0;

    // Durchschnitt der letzten Woche berechnen
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const lastWeekWeights = weights.filter(w => {
      const entryDate = new Date(w.date);
      return entryDate >= oneWeekAgo;
    });
    
    const weekAverage = lastWeekWeights.length > 0
      ? lastWeekWeights.reduce((sum, w) => sum + w.weight, 0) / lastWeekWeights.length
      : current;

    return { current, highest, lowest, average, change, weightValues, weekAverage };
  };

  const handleAddWeight = async () => {
    if (newWeight && !isNaN(parseFloat(newWeight))) {
      await addWeight(parseFloat(newWeight));
      setNewWeight('');
      setShowInput(false);
    }
  };

  const stats = calculateStats();

  // Chart Punkte berechnen
  const getChartPoints = () => {
    if (!stats || stats.weightValues.length === 0) return '';

    const values = stats.weightValues;
    const min = Math.min(...values) - 2;
    const max = Math.max(...values) + 2;
    const range = max - min;

    const points = values.map((weight, index) => {
      const x = (index / (values.length - 1 || 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - ((weight - min) / range) * CHART_HEIGHT;
      return `${x},${y}`;
    }).join(' ');

    return points;
  };

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Gewichtsstatistik</Text>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Noch keine Einträge
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowInput(true)}
        >
          <Text style={styles.addButtonText}>+ Gewicht hinzufügen</Text>
        </TouchableOpacity>

        {showInput && (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { borderColor: colors.primary }]}
              placeholder="z.B. 75.5"
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
              value={newWeight}
              onChangeText={setNewWeight}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleAddWeight}
              >
                <Text style={styles.buttonText}>Speichern</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.text }]}
                onPress={() => {
                  setShowInput(false);
                  setNewWeight('');
                }}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Abbrechen</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  const points = getChartPoints();
  const changeColor = stats.change < 0 ? '#10b981' : stats.change > 0 ? '#ef4444' : colors.text;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: colors.text }]}>Gewicht</Text>
          <View style={styles.compactStats}>
            <Text style={[styles.compactText, { color: colors.text }]}>
              Ø {stats.weekAverage.toFixed(1)}kg
            </Text>
            <Text style={[styles.compactText, { color: changeColor }]}>
              {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)}kg
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addButtonSmall, { backgroundColor: colors.primary }]}
          onPress={() => setShowInput(!showInput)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {showInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
            placeholder="Gewicht in kg"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
            value={newWeight}
            onChangeText={setNewWeight}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleAddWeight}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.text }]}
              onPress={() => {
                setShowInput(false);
                setNewWeight('');
              }}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Chart */}
      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Linie */}
          {points && (
            <Polyline
              points={points}
              fill="none"
              stroke={colors.primary}
              strokeWidth="2"
            />
          )}

          {/* Punkte */}
          {stats.weightValues.map((weight, index) => {
            const min = Math.min(...stats.weightValues) - 2;
            const max = Math.max(...stats.weightValues) + 2;
            const range = max - min;
            const x = (index / (stats.weightValues.length - 1 || 1)) * CHART_WIDTH;
            const y = CHART_HEIGHT - ((weight - min) / range) * CHART_HEIGHT;

            return (
              <Circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={colors.primary}
              />
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  addButtonSmall: {
    width: 35,
    height: 35,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',                                                                             
  },
  emptyText: {
    opacity: 0.6,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  compactStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
  },
});