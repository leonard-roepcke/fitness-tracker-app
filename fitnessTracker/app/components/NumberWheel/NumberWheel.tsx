// components/ui/NumberWheel.tsx
import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';


interface NumberWheelProps {
  min?: number;
  max?: number;
  value: number;
  onValueChange: (value: number) => void;
  width?: number;
  suffix?: string;
}

export const NumberWheel: React.FC<NumberWheelProps> = ({
  min = 0,
  max = 59,
  value,
  onValueChange,
  width = 80,
  suffix = ''
}) => {
  const colors = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [scrolling, setScrolling] = useState(false);
  const itemHeight = 35;
  const visibleItems = 5;
  
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const paddingItems = 2;

  useEffect(() => {
    if (scrollRef.current && !scrolling) {
      const index = numbers.indexOf(value);
      if (index !== -1) {
        scrollRef.current.scrollTo({
          y: index * itemHeight,
          animated: false
        });
      }
    }
  }, [value, scrolling]);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const selectedIndex = Math.round(scrollY / itemHeight);
    const selectedValue = numbers[selectedIndex];
    
    if (selectedValue !== undefined && selectedValue !== value) {
      onValueChange(selectedValue);
    }
  };

  const handleScrollBeginDrag = () => {
    setScrolling(true);
  };

  const handleScrollEndDrag = () => {
    setScrolling(false);
  };

  const handleMomentumScrollEnd = () => {
    setScrolling(false);
  };

  const getOpacity = (index: number) => {
    const currentIndex = numbers.indexOf(value);
    const distance = Math.abs(index - currentIndex);
    
    if (distance === 0) return 1;
    if (distance === 1) return 0.6;
    if (distance === 2) return 0.3;
    return 0.15;
  };

  const getScale = (index: number) => {
    const currentIndex = numbers.indexOf(value);
    const distance = Math.abs(index - currentIndex);
    
    if (distance === 0) return 1;
    if (distance === 1) return 0.85;
    return 0.7;
  };

  const getFontSize = (index: number) => {
    const currentIndex = numbers.indexOf(value);
    const distance = Math.abs(index - currentIndex);
    
    if (distance === 0) return 23;
    if (distance === 1) return 20;
    return 17;
  };

  const getFontWeight = (index: number) => {
    const currentIndex = numbers.indexOf(value);
    return index === currentIndex ? '600' : '400';
  };

  const styles = StyleSheet.create({
    container: {
      width: width,
      height: itemHeight * visibleItems,
      overflow: 'hidden',
    },
    selectionIndicator: {
      position: 'absolute',
      top: itemHeight * 2,
      left: 0,
      right: 0,
      height: itemHeight,
      backgroundColor: `${colors.primary}20`,
      borderRadius: 10,
      zIndex: 1,
    },
    scrollView: {
      width: '100%',
      height: '100%',
    },
    paddingItem: {
      height: itemHeight,
    },
    numberItem: {
      height: itemHeight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    numberText: {
      color: colors.text,
      letterSpacing: -0.3,
      fontFamily: 'System',
    },
  });

  return (
    <View style={styles.container}>
      {/* Selection Indicator */}
      <View style={styles.selectionIndicator} />
      
      {/* Scrollable Container */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {/* Top Padding */}
        {Array.from({ length: paddingItems }).map((_, i) => (
          <View
            key={`padding-top-${i}`}
            style={styles.paddingItem}
          />
        ))}

        {/* Number Items */}
        {numbers.map((number, index) => (
          <View
            key={number}
            style={styles.numberItem}
          >
            <Text
              style={[
                styles.numberText,
                {
                  fontSize: getFontSize(index),
                  fontWeight: getFontWeight(index),
                  opacity: getOpacity(index),
                  transform: [{ scale: getScale(index) }],
                }
              ]}
            >
              {number.toString().padStart(2, '0')}{suffix}
            </Text>
          </View>
        ))}

        {/* Bottom Padding */}
        {Array.from({ length: paddingItems }).map((_, i) => (
          <View
            key={`padding-bottom-${i}`}
            style={styles.paddingItem}
          />
        ))}
      </ScrollView>
    </View>
  );
};