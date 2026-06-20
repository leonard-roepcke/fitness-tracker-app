import { reorderList } from '@/app/utils/reorderList';
import { Workout } from '@/app/types/workout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

type ReorderableWorkoutListProps = {
  items: Workout[];
  onReorder: (items: Workout[]) => void;
  renderItem: (
    item: Workout,
    dragHandlers: ReturnType<typeof PanResponder.create>['panHandlers'],
    isDragging: boolean
  ) => React.ReactNode;
  itemStyle?: ViewStyle;
};

function DraggableRow({
  index,
  totalCount,
  onMove,
  itemStyle,
  children,
}: {
  index: number;
  totalCount: number;
  onMove: (from: number, to: number) => void;
  itemStyle?: ViewStyle;
  children: (
    dragHandlers: ReturnType<typeof PanResponder.create>['panHandlers'],
    isDragging: boolean
  ) => React.ReactNode;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const rowHeight = useRef(140);
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setIsDragging(true);
        },
        onPanResponderMove: (_, gesture) => {
          translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_, gesture) => {
          const shift = Math.round(gesture.dy / Math.max(rowHeight.current, 1));
          const nextIndex = Math.max(0, Math.min(totalCount - 1, index + shift));
          if (nextIndex !== index) {
            onMove(index, nextIndex);
          }

          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start(() => {
            setIsDragging(false);
          });
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => {
            setIsDragging(false);
          });
        },
      }),
    [index, totalCount, onMove, translateY]
  );

  return (
    <Animated.View
      onLayout={(event) => {
        rowHeight.current = event.nativeEvent.layout.height;
      }}
      style={[
        itemStyle,
        {
          transform: [{ translateY }],
          zIndex: isDragging ? 2 : 0,
          elevation: isDragging ? 4 : 0,
          opacity: isDragging ? 0.92 : 1,
        },
      ]}
    >
      {children(panResponder.panHandlers, isDragging)}
    </Animated.View>
  );
}

export default function ReorderableWorkoutList({
  items,
  onReorder,
  renderItem,
  itemStyle,
}: ReorderableWorkoutListProps) {
  const [orderedItems, setOrderedItems] = useState(items);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const handleMove = (from: number, to: number) => {
    const next = reorderList(orderedItems, from, to);
    setOrderedItems(next);
    onReorder(next);
  };

  return (
    <View style={styles.list}>
      {orderedItems.map((item, index) => (
        <DraggableRow
          key={item.id}
          index={index}
          totalCount={orderedItems.length}
          onMove={handleMove}
          itemStyle={itemStyle}
        >
          {(dragHandlers, isDragging) => renderItem(item, dragHandlers, isDragging)}
        </DraggableRow>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
});
