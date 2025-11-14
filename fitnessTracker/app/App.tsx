// app/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet } from 'react-native';
import OverviewScreen from './screens/OverviewScreen';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <OverviewScreen />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});