import Layouts from "@/app/constants/Layouts";
import { cardShadow } from "@/app/utils/shadows";
import { useTheme } from '@/app/hooks/useTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const layouts = Layouts;
const height_n = 200;

export default function CardBox({ size = 1, children }: any) {
  const colors = useTheme();

  const styles = StyleSheet.create({
    container: {
      borderRadius: layouts.borderRadiusLarge,
      padding: layouts.padding,
      marginVertical: layouts.marginVertical,
      height: height_n * size,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      ...cardShadow(colors),
    },
  });

  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}
