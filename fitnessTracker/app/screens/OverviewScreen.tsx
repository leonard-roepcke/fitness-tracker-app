import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WorkoutBox } from '../components/WorkoutBox';

export default function OverviewScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Test Text</Text>
            <Text style={styles.subtitle}>Das ist ein Testtext in der OverviewScreen.</Text>
            <WorkoutBox text="Hallo"/>
            <WorkoutBox text="Hallo Test"/>
            <WorkoutBox text="Hallo"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#000000',
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