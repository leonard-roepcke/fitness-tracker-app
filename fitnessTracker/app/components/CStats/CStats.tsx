import { useTheme } from '@/app/hooks/useTheme';
import { useTracker } from '@/context/TrackerContext';
import CustomModal from '@/app/components/CustomModal';
import CardBox from '@/app/components/CardBox';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import Layouts from '@/app/constants/Layouts';

const { width } = Dimensions.get('window');
const layouts = Layouts;

export default function CStats() {
  const colors = useTheme();
  const { calorys, addCaloryEntry, getTotalCaloriesForDate } = useTracker();
  const [showModal, setShowModal] = useState(false);
  const [newCalories, setNewCalories] = useState('');
  const [chartDimensions, setChartDimensions] = useState(null);

  const calculateStats = () => {
    const allDates = Object.keys(calorys).sort();
    if (allDates.length === 0) return null;

    const dailyTotals = allDates.map(date => getTotalCaloriesForDate(date));
    const current = dailyTotals[dailyTotals.length - 1];
    const change = dailyTotals.length > 1 ? current - dailyTotals[0] : 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString().split("T")[0];
    
    const lastWeekTotals = allDates
      .filter(date => date >= oneWeekAgoISO)
      .map(date => getTotalCaloriesForDate(date));
    
    const weekAverage = lastWeekTotals.length > 0
      ? lastWeekTotals.reduce((sum, val) => sum + val, 0) / lastWeekTotals.length
      : current;

    return { current, change, dailyTotals, weekAverage };
  };

  const handleAddCalories = async () => {
    if (newCalories && !isNaN(parseFloat(newCalories))) {
      await addCaloryEntry({
        date: Date.now(),
        calorys: parseFloat(newCalories),
      });
      setNewCalories('');
      setShowModal(false);
    }
  };

  const handleNumberPress = (num) => {
    setNewCalories(prev => prev + num);
  };

  const handleCommaPress = () => {
    if (!newCalories.includes('.')) {
      setNewCalories(prev => prev + '.');
    }
  };

  const handleBackspace = () => {
    setNewCalories(prev => prev.slice(0, -1));
  };

  const stats = calculateStats();

  const getChartPoints = (chartWidth, chartHeight) => {
    if (!stats || stats.dailyTotals.length === 0) return '';

    const values = stats.dailyTotals;
    const min = Math.min(...values) - 100;
    const max = Math.max(...values) + 100;
    const range = max - min;

    const points = values.map((calories, index) => {
      const x = (index / (values.length - 1 || 1)) * chartWidth;
      const y = chartHeight - ((calories - min) / range) * chartHeight;
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
          <Text style={[styles.title, { color: colors.text }]}>Kalorien</Text>
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
            setNewCalories('');
          }}
          showCloseButton={false}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Kalorien hinzufügen
            </Text>
            <View style={[styles.display, { borderColor: colors.primary }]}>
              <Text style={[styles.displayText, { color: colors.text }]}>
                {newCalories || '0'} kcal
              </Text>
            </View>
            
            {renderNumPad()}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleAddCalories}
              >
                <Text style={styles.buttonText}>Speichern</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.text }]}
                onPress={() => {
                  setShowModal(false);
                  setNewCalories('');
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

  const changeColor = stats.change < 0 ? '#ef4444' : stats.change > 0 ? '#10b981' : colors.text;

  return (
    <CardBox>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>Kalorien</Text>
            <View style={styles.compactStats}>
              <Text style={[styles.compactText, { color: colors.text }]}>
                Ø {Math.round(stats.weekAverage)} kcal
              </Text>
              <Text style={[styles.compactText, { color: changeColor }]}>
                {stats.change > 0 ? '+' : ''}{Math.round(stats.change)} kcal
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
        <View style={styles.chartContainer} onLayout={(e) => {
          const { width: chartWidth, height: chartHeight } = e.nativeEvent.layout;
          if (chartWidth > 0 && chartHeight > 0) {
            const calculatedPoints = getChartPoints(chartWidth, chartHeight);
            setChartDimensions({ width: chartWidth, height: chartHeight, points: calculatedPoints });
          }
        }}>
          {chartDimensions && (
            <Svg width={chartDimensions.width} height={chartDimensions.height}>
              {chartDimensions.points && (
                <Polyline
                  points={chartDimensions.points}
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth="2"
                />
              )}

              {stats.dailyTotals.map((calories, index) => {
                const min = Math.min(...stats.dailyTotals) - 100;
                const max = Math.max(...stats.dailyTotals) + 100;
                const range = max - min;
                const x = (index / (stats.dailyTotals.length - 1 || 1)) * chartDimensions.width;
                const y = chartDimensions.height - ((calories - min) / range) * chartDimensions.height;

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
          )}
        </View>
      </View>

      <CustomModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setNewCalories('');
        }}
        showCloseButton={false}
      >
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Kalorien hinzufügen
          </Text>
          <View style={[styles.display, { borderColor: colors.primary }]}>
            <Text style={[styles.displayText, { color: colors.text }]}>
              {newCalories || '0'} kcal
            </Text>
          </View>
          
          {renderNumPad()}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleAddCalories}
            >
              <Text style={styles.buttonText}>Speichern</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.text }]}
              onPress={() => {
                setShowModal(false);
                setNewCalories('');
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