// components/ui/NumberWheel.tsx
import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface NumberWheelProps {
  min?: number;
  max?: number;
  value: number;
  onValueChange: (value: number) => void;
  width?: number;
  sufix?: string;
}

export const NumberWheel: React.FC<NumberWheelProps> = ({
  min = 0,
  max = 59,
  value,
  onValueChange,
  width = 80,
  sufix = ''
}) => {
  const colors = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const itemHeight = 40;
  const visibleItems = 5;

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => (i + min));

  const styles = StyleSheet.create({
    container: {
      width: width,
      height: itemHeight * visibleItems,
      overflow: 'hidden',
    },
    scrollView: {
      width: '100%',
    },
    numberItem: {
      height: itemHeight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    numberText: {
      fontSize: 20,
      color: colors.text,
    },
    selectedNumberText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
    },
    selectionIndicator: {
      position: 'absolute',
      top: itemHeight * 2,
      left: 0,
      right: 0,
      height: itemHeight,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}20`, // 20% opacity
    },
  });

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const selectedIndex = Math.round(y / itemHeight);
    const selectedValue = numbers[selectedIndex];
    
    if (selectedValue !== undefined && selectedValue !== value) {
      onValueChange(selectedValue);
    }
  };

  // Scroll zur aktuellen Position
  React.useEffect(() => {
    const index = numbers.indexOf(value);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: index * itemHeight,
        animated: false,
      });
    }
  }, [value]);

  return (
    <View style={styles.container}>
      {/* Auswahl-Indikator */}
      <View style={styles.selectionIndicator} />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Leere Items für Padding */}
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.numberItem}>
            <Text style={[styles.numberText, { opacity: 0.3 }]}>
              {index === 0 ? numbers[0] : numbers[numbers.length - 1]}
            </Text>
          </View>
        ))}
        
        {/* Zahlen Items */}
        {numbers.map((number, index) => (
          <View key={number} style={styles.numberItem}>
            <Text 
              style={[
                styles.numberText,
                number === value && styles.selectedNumberText
              ]}
            >
              {number.toString().padStart(2, '0')}{sufix}
            </Text>
          </View>
        ))}
        
        {/* Leere Items für Padding */}
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={`empty-end-${index}`} style={styles.numberItem}>
            <Text style={[styles.numberText, { opacity: 0.3 }]}>
              {index === 0 ? numbers[0] : numbers[numbers.length - 1]}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};