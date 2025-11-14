import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OverviewScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Test Text</Text>
            <Text style={styles.subtitle}>Das ist ein Testtext in der OverviewScreen.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
    },
});