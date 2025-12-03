// components/CustomModal.jsx
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomModal({ visible, onClose, children }: any) {
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  closeBtn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    fontSize: 16,
  },
});
