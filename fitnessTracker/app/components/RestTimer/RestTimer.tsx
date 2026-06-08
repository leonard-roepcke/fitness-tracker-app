import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomModal from '../CustomModal';
import GradientButton from '../ui/GradientButton';
import { useTheme } from '@/app/hooks/useTheme';

type RestTimerProps = {
  visible: boolean;
  duration: number;
  onComplete: () => void;
  onSkip: () => void;
  skipLabel: string;
};

export default function RestTimer({
  visible,
  duration,
  onComplete,
  onSkip,
  skipLabel,
}: RestTimerProps) {
  const colors = useTheme();
  const [remaining, setRemaining] = useState(duration);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!visible) {
      setRemaining(duration);
      return;
    }

    setRemaining(duration);
    let ticks = duration;

    const intervalId = setInterval(() => {
      ticks -= 1;
      if (ticks <= 0) {
        clearInterval(intervalId);
        setRemaining(0);
        onCompleteRef.current();
        return;
      }
      setRemaining(ticks);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [visible, duration]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    time: {
      fontSize: 56,
      fontWeight: '700',
      color: colors.primaryDark,
      marginBottom: 20,
    },
    skip: {
      alignSelf: 'stretch',
    },
  });

  return (
    <CustomModal visible={visible} onClose={onSkip} showCloseButton={false}>
      <View style={styles.container}>
        <Text style={styles.label}>Pause</Text>
        <Text style={styles.time}>{display}</Text>
        <GradientButton title={skipLabel} onPress={onSkip} style={styles.skip} />
      </View>
    </CustomModal>
  );
}
