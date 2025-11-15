import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export const CreateBox = () => {
    return (
        <TouchableOpacity style={styles.box}>
                <Ionicons name="add" size={24} color="#c5c5c5ff" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    box: {
        marginVertical: 8,
        backgroundColor: "#2b2b2bff",
        borderRadius: 5,
        padding: 16,
        //width: '100%',
    },
    text: {
        color: "#c5c5c5ff",
        fontSize: 16,
    }
});