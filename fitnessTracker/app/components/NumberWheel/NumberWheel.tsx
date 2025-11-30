// components/ui/NumberWheel.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface NumberWheelProps {
  min?: number;
  max?: number;
  value: number;
  onValueChange: (value: number) => void;
  width?: number;
  suffix?: string;
  visibleItems?: number;
}

export const NumberWheel: React.FC<NumberWheelProps> = ({
  min = 0,
  max = 59,
  value,
  onValueChange,
  width = 80,
  suffix = '',
  visibleItems = 5,
}) => {
  const colors = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [scrolling, setScrolling] = useState(false);
  const itemHeight = 35;
  
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const paddingItems = Math.floor(visibleItems / 2);

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

  const snapToValue = (scrollY: number) => {
    const rawIndex = scrollY / itemHeight;
    let targetIndex = Math.round(rawIndex);
    
    // Begrenze den Index auf gültige Werte
    targetIndex = Math.max(0, Math.min(targetIndex, numbers.length - 1));
    
    const targetY = targetIndex * itemHeight;
    const selectedValue = numbers[targetIndex];
    
    // Scrolle zur korrekten Position
    scrollRef.current?.scrollTo({
      y: targetY,
      animated: true
    });
    
    // Update den Wert
    if (selectedValue !== undefined && selectedValue !== value) {
      onValueChange(selectedValue);
    }
  };

  const handleScroll = (event: any) => {
    if (!scrolling) return;
    
    const scrollY = event.nativeEvent.contentOffset.y;
    const rawIndex = scrollY / itemHeight;
    const selectedIndex = Math.round(rawIndex);
    
    // Begrenze den Index
    const clampedIndex = Math.max(0, Math.min(selectedIndex, numbers.length - 1));
    const selectedValue = numbers[clampedIndex];
    
    if (selectedValue !== undefined && selectedValue !== value) {
      onValueChange(selectedValue);
    }
  };

  const handleScrollBeginDrag = () => {
    setScrolling(true);
  };

  const handleScrollEndDrag = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const velocity = event.nativeEvent.velocity?.y || 0;
    
    // Wenn keine Geschwindigkeit, sofort einrasten
    if (Math.abs(velocity) < 0.1) {
      snapToValue(scrollY);
      setScrolling(false);
    }
    // Sonst weiter gleiten lassen (handleMomentumScrollEnd kümmert sich darum)
  };

  const handleMomentumScrollEnd = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    snapToValue(scrollY);
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

  const getTranslateY = (index: number) => {
    const currentIndex = numbers.indexOf(value);
    const distance = index - currentIndex;
    
    if (distance === 0) return 0;
    
    // Kompression des Abstands für entfernte Elemente
    const absDistance = Math.abs(distance);
    const sign = distance > 0 ? 1 : -1;
    
    // Progressive Kompression: weiter weg = stärker komprimiert
    const compression = Math.pow(absDistance, 0.7);
    
    return sign * compression * itemHeight - distance * itemHeight;
  };

  const getRotation = (index: number) => {
    const currentIndex = numbers.indexOf(value);
    const distance = index - currentIndex;
    
    // Rotation um X-Achse (wie ein Rad)
    const maxRotation = 75;
    const rotation = (distance * maxRotation) / visibleItems;
    
    return rotation;
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

  const getFontWeight = (index: number): '600' | '400' => {
    const currentIndex = numbers.indexOf(value);
    return index === currentIndex ? '600' : '400';
  };

  const styles = StyleSheet.create({
    container: {
      width: width,
      height: itemHeight * visibleItems,
      overflow: 'hidden',
      perspective: 1000,
    },
    selectionIndicator: {
      position: 'absolute',
      top: itemHeight * paddingItems,
      left: 0,
      right: 0,
      height: itemHeight,
      backgroundColor: `${colors.primary}20`,
      borderRadius: 10,
      zIndex: 1,
      pointerEvents: 'none',
    },
    scrollView: {
      width: '100%',
      height: '100%',
      zIndex: 10,
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
        decelerationRate={0.98}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        bounces={false}
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
                  transform: [
                    { translateY: getTranslateY(index) },
                    { scale: getScale(index) },
                    { rotateX: `${getRotation(index)}deg` },
                    { perspective: 1000 }
                  ],
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