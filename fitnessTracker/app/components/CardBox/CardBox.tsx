import Layouts from "@/app/constants/Layouts";
import { useTheme } from '@/app/hooks/useTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const layouts = Layouts;

export default function CardBox({ children }:any) {
  const colors = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: layouts.borderRadius,
    padding: 16,
    marginVertical: 8,
    height: 500,
  },
});