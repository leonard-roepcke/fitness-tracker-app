import Layouts from "@/app/constants/Layouts";
import { useTheme } from '@/app/hooks/useTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const layouts = Layouts;
const height_n = 200;

export default function CardBox({ size=1, children }:any) {
  const colors = useTheme();

  const styles = StyleSheet.create({
  container: {
    borderRadius: layouts.borderRadius,
    padding: 16,
    marginVertical: 8,
    height: height_n*size},
  },
);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {children}
    </View>
  );
}

