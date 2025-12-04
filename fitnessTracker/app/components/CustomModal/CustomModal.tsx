import Layouts from "@/app/constants/Layouts";
import { useTheme } from "@/app/hooks/useTheme";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomModal({ visible, onClose, children }: any) {
  const colors = useTheme();
  const layouts = Layouts;
  
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    box: {
      width: "100%",
      maxWidth: 400,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    content: {
      marginBottom: 20,
    },
    closeBtn: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      backgroundColor: colors.primary || "#007AFF",
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    closeText: {
      fontSize: 17,
      fontWeight: "600",
      color: "#FFFFFF",
      letterSpacing: -0.4,
    },
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable 
          style={styles.backdrop} 
          onPress={onClose}
        />
        <View style={styles.box}>
          <View style={styles.content}>
            {children}
          </View>
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}