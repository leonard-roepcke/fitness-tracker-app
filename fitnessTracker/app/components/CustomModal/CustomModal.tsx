
import Layouts from "@/app/constants/Layouts";
import { useTheme } from "@/app/hooks/useTheme";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomModal({ visible, onClose, children }: any) {
  const colors = useTheme();
  const layouts = Layouts;
  
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    box: {
      width: "80%",
      backgroundColor: colors.card,
      borderRadius: layouts.borderRadius,
      padding: 20,
    },
    closeBtn: {
      marginTop: 20,
      padding: 10,
      backgroundColor: colors.background,
      borderRadius: layouts.borderRadius,
      alignItems: "center",
    },
    closeText: {
      fontSize: 16,
      color: colors.text
    },
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          {children}

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

