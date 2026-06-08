import { nextUniformFontSize, shouldShrinkForWrap } from '@/app/utils/buttonTextFit';
import React, { useEffect, useId, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextLayoutEvent,
  TextStyle,
  View,
} from 'react-native';
import { useButtonTextGroup } from './ButtonTextGroup';

type ButtonTextProps = {
  children: string;
  baseFontSize: number;
  minFontSize?: number;
  style?: StyleProp<TextStyle>;
};

export default function ButtonText({
  children,
  baseFontSize,
  minFontSize = 11,
  style,
}: ButtonTextProps) {
  const group = useButtonTextGroup();
  const id = useId();
  const [soloFontSize, setSoloFontSize] = useState(baseFontSize);
  const fontSize = group?.fontSize ?? soloFontSize;

  useEffect(() => {
    if (!group) {
      setSoloFontSize(baseFontSize);
    }
  }, [children, baseFontSize, group, group?.generation]);

  useEffect(() => {
    if (!group) return undefined;

    group.register(id);
    return () => group.unregister(id);
  }, [group, id]);

  const handleTextLayout = (event: TextLayoutEvent) => {
    const wrapped = shouldShrinkForWrap(event.nativeEvent.lines.length);

    if (group) {
      group.report(id, wrapped);
      return;
    }

    if (wrapped && soloFontSize > minFontSize) {
      setSoloFontSize((current) => nextUniformFontSize(current, minFontSize));
    }
  };

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[style, { fontSize }]}
        onTextLayout={handleTextLayout}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 0,
    flexShrink: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
