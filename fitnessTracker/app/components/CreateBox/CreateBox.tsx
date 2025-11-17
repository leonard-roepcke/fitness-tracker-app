import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../hooks/useTheme";

export const CreateBox = ({onCreate}: { onCreate: () => void }) => {
    const colors = useTheme();
    const styles = StyleSheet.create({
        box: {
            marginVertical: 8,
            backgroundColor: colors.card,
            borderRadius: 5,
            padding: 16,
            //width: '100%',
        },
        text: {
            color: colors.text,
            fontSize: 16,
        }
    });

    return (
        <TouchableOpacity style={styles.box} onPress={onCreate}>
                <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
    );
}
