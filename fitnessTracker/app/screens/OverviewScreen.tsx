import React from 'react';
import { View,ScrollView, Text, StyleSheet } from 'react-native';
import { WorkoutBox } from '../components/WorkoutBox';

export default function OverviewScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Test Text</Text>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.subtitle}>Das ist ein Testtext in der OverviewScreen.</Text>
                <WorkoutBox text="Push"/>
                <WorkoutBox text="Pull"/>
                <WorkoutBox text="Leg"/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        //justifyContent: 'center',
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
    scrollView: {
        width: '100%',
    },
});