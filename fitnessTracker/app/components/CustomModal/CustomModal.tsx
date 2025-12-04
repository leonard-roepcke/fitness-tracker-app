import Layouts from "@/app/constants/Layouts";
import { useTheme } from "@/app/hooks/useTheme";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CustomModal({ visible, onClose, children }: any) {
  const colors = useTheme();
  const layouts = Layouts;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  
  const handlePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          closeModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [visible]);

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "flex-end",
    },
    backdrop: {
      flex: 1,
    },
    container: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 20,
      maxHeight: SCREEN_HEIGHT * 0.9,
    },
    handleContainer: {
      paddingTop: 12,
      paddingBottom: 8,
      alignItems: "center",
    },
    handle: {
      width: 40,
      height: 5,
      backgroundColor: colors.text || "#C6C6C8",
      opacity: 0.3,
      borderRadius: 3,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 34,
    },
    buttonWrapper: {
      paddingTop: 20,
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
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable 
          style={styles.backdrop} 
          onPress={closeModal}
        />
        <Animated.View 
          style={[
            styles.container,
            {
              transform: [{ translateY }]
            }
          ]}
        >
          <View 
            style={styles.handleContainer}
            {...handlePanResponder.panHandlers}
          >
            <View style={styles.handle} />
          </View>
          
          <View style={styles.content}>
            {children}
            <View style={styles.buttonWrapper}>
              <TouchableOpacity 
                onPress={closeModal} 
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.closeText}>Schließen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}