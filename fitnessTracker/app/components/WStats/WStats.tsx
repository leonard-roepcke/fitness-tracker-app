import Layouts from "@/app/constants/Layouts";
import { useTheme } from '@/app/hooks/useTheme';
import { useWeights } from '@/context/WeightContext';
import CustomModal from '@/app/components/CustomModal';
import CardBox from '@/app/components/CardBox';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 80; // Angepasst für padding
const CHART_HEIGHT = 100; // Kompakter für die Box
const layouts = Layouts;

export default function WStats() {
  const colors = useTheme();
  const { weights, addWeight } = useWeights();
  const [showModal, setShowModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const calculateStats = () => {
    if (!weights || weights.length === 0) return null;

    const weightValues = weights.map(w => w.weight);
    const current = weightValues[weightValues.length - 1];
    const change = weightValues.length > 1 ? current - weightValues[0] : 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const lastWeekWeights = weights.filter(w => {
      const entryDate = new Date(w.date);
      return entryDate >= oneWeekAgo;
    });
    
    const weekAverage = lastWeekWeights.length > 0
      ? lastWeekWeights.reduce((sum, w) => sum + w.weight, 0) / lastWeekWeights.length
      : current;

    return { current, change, weightValues, weekAverage };
  };

  const handleAddWeight = async () => {
    if (newWeight && !isNaN(parseFloat(newWeight))) {
      await addWeight(parseFloat(newWeight));
      setNewWeight('');
      setShowModal(false);
    }
  };

  const handleNumberPress = (num) => {
    setNewWeight(prev => prev + num);
  };

  const handleCommaPress = () => {
    if (!newWeight.includes('.')) {
      setNewWeight(prev => prev + '.');
    }
  };

  const handleBackspace = () => {
    setNewWeight(prev => prev.slice(0, -1));
  };

  const stats = calculateStats();

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

  const renderNumPad = () => {
    const numbers = [
      ['7', '8', '9'],
      ['4', '5', '6'],
      ['1', '2', '3'],
      [',', '0', '←']
    ];

    return (
      <View style={styles.numPad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numPadRow}>
            {row.map((btn) => (
              <TouchableOpacity
                key={btn}
                style={[styles.numButton, { backgroundColor: colors.background }]}
                onPress={() => {
                  if (btn === '←') handleBackspace();
                  else if (btn === ',') handleCommaPress();
                  else handleNumberPress(btn);
                }}
              >
                <Text style={[styles.numButtonText, { color: colors.text }]}>
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  if (!stats) {
    return (
      <CardBox>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Gewicht</Text>
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              Noch keine Einträge
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addButtonText}>+ Hinzufügen</Text>
          </TouchableOpacity>
        </View>

        <CustomModal
          visible={showModal}
          onClose={() => {
            setShowModal(false);
            setNewWeight('');
          }}
          showCloseButton={false}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Gewicht hinzufügen
            </Text>
            <View style={[styles.display, { borderColor: colors.primary }]}>
              <Text style={[styles.displayText, { color: colors.text }]}>
                {newWeight || '0'} kg
              </Text>
            </View>
            
            {renderNumPad()}

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
                  setShowModal(false);
                  setNewWeight('');
                }}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Abbrechen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
      </CardBox>
    );
  }

  const points = getChartPoints();
  const changeColor = stats.change < 0 ? '#10b981' : stats.change > 0 ? '#ef4444' : colors.text;

  return (
    <CardBox>
      <View style={styles.content}>
        {/* Header */}
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
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            {points && (
              <Polyline
                points={points}
                fill="none"
                stroke={colors.primary}
                strokeWidth="2"
              />
            )}

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

      <CustomModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setNewWeight('');
        }}
        showCloseButton={false}
      >
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Gewicht hinzufügen
          </Text>
          <View style={[styles.display, { borderColor: colors.primary }]}>
            <Text style={[styles.displayText, { color: colors.text }]}>
              {newWeight || '0'} kg
            </Text>
          </View>
          
          {renderNumPad()}

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
                setShowModal(false);
                setNewWeight('');
              }}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>
    </CardBox>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
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
  addButtonSmall: {
    width: 35,
    height: 35,
    borderRadius: layouts.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.6,
    fontSize: 14,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: layouts.borderRadius,
    alignItems: 'center',
  },
  modalContent: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  display: {
    borderWidth: 2,
    borderRadius: layouts.borderRadius,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  displayText: {
    fontSize: 32,
    fontWeight: '600',
  },
  numPad: {
    marginBottom: 16,
  },
  numPadRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  numButton: {
    flex: 1,
    aspectRatio: 1.5,
    borderRadius: layouts.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: layouts.borderRadius,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: layouts.borderRadius,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});