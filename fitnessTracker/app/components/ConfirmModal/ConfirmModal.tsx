import CustomModal from '@/app/components/CustomModal';
import GradientButton from '@/app/components/ui/GradientButton';
import { useTheme } from '@/app/hooks/useTheme';
import Layouts from '@/app/constants/Layouts';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const colors = useTheme();
  const layouts = Layouts;

  const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 8,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: layouts.borderRadius,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
    },
    cancelText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
  });

  return (
    <CustomModal visible={visible} onClose={onClose} showCloseButton={false}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.buttonRow}>
        <GradientButton title={confirmLabel} onPress={onConfirm} style={{ flex: 1 }} />
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>{cancelLabel}</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
}
