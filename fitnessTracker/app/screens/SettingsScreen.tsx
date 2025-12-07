import * as Application from 'expo-application';
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import Bar from "../components/Bar";
import { SettingsBox } from "../components/SettingsBox/SettinsBox";
import { useTheme } from '../hooks/useTheme';
import Layouts from '../constants/Layouts';

export default function SettingsScreen() {
  const { isDark, toggleTheme, isWTrackerEnabled, toggleWTracker, isCTrackerEnabled, toggleCTracker } =
    useContext(ThemeContext);
  const router = useRouter();
  const colors = useTheme();
  const version = Application.nativeApplicationVersion;
  const build = Application.nativeBuildVersion;  

  const handleNavigation = (route: string) => {
    // Navigation zu den jeweiligen Screens
    router.push(route);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      
    },
    scrollContent: {
      paddingBottom: 40,
    },
    header: {
        fontSize: 32,
        fontWeight: "bold",
        marginTop: 35,
        color: colors.text,
        textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      opacity: 0.6,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    footerText: {
      textAlign: "center",
      paddingVertical: 30,
      color: colors.text,
      opacity: 0.5,
      fontSize: 14,
    },
    title: {
        fontSize: 10,
        fontWeight: '600',
        marginBottom: Layouts.marginVertical,
        color: colors.text,
        justifyContent: 'center',
        alignItems: 'center',

    },
    spacing: {
        height: Layouts.marginVertical*12,
    }
  });

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <Text style={styles.title}></Text>
      <Text style={styles.header}>Einstellungen</Text>
      <Text style={styles.title}></Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Darstellung Sektion */}
        <Text style={styles.sectionTitle}>Darstellung</Text>
        <SettingsBox
          title="Dunkelmodus"
          subtitle="Darkmode aktivieren"
          value={isDark}
          onValueChange={toggleTheme}
        />

        {/* Tracker Sektion */}
        <Text style={styles.sectionTitle}>Tracker</Text>
        <SettingsBox
          title="Gewicht Tracker"
          subtitle="in der Übersicht anzeigen"
          value={isWTrackerEnabled}
          onValueChange={toggleWTracker}
          />
        <SettingsBox
          title="Calories Tracker"
          subtitle="in der Übersicht anzeigen"
          value={isCTrackerEnabled}
          onValueChange={toggleCTracker}
        />

        {/* Rechtliches & Support Sektion */}
        <Text style={styles.sectionTitle}>Rechtliches & Support</Text>
        <SettingsBox
          title="Datenschutz"
          subtitle="Datenschutzerklärung ansehen"
          isNavigable={true}
          onPress={() => {}}
        />
        <SettingsBox
          title="Nutzungsbedingungen"
          subtitle="AGB ansehen"
          isNavigable={true}
          onPress={() => {}}
        />
        <SettingsBox
          title="Hilfe & Support"
          subtitle="Unterstützung erhalten"
          isNavigable={true}
          onPress={() => {}}
        />

        {/* Footer */}
        <Text style={styles.footerText}>
          Version {version} ({build})
        </Text>
      <View style={styles.spacing}/>
      </ScrollView>
      <Bar />
    </View>
  );
}