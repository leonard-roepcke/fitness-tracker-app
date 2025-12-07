import * as Application from 'expo-application';
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import Bar from "../components/Bar";
import { SettingsBox } from "../components/SettingsBox/SettinsBox";
import { useTheme } from "../hooks/useTheme";



export default function SettingsScreen() {
  const { isDark, toggleTheme, isWTrackerEnabled, toggleWTracker, isCTrackerEnabled, toggleCTracker } = useContext(ThemeContext);

  const colors = useTheme();
  const router = useRouter();

  const version = Application.nativeApplicationVersion;
  const build = Application.nativeBuildVersion;  

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header mit Back-Button */}
      <View style={styles.headerContainer}>
        
        <Text style={[styles.header, { color: colors.text }]}>Einstellungen</Text>
      </View>
 
      <ScrollView contentContainerStyle={styles.scrollContent}>
 
        {/* App-Einstellungen */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            APP-EINSTELLUNGEN
          </Text>
                                           
          <SettingsBox
            title="Dunkelmodus"
            subtitle="Darkmode aktivieren"
            value={isDark}
            onValueChange={toggleTheme}
          />

          <SettingsBox
            title="Gewicht Tracker"
            subtitle="Gewicht Tracking im Overview anzeigen"
            value={isWTrackerEnabled}
            onValueChange={toggleWTracker}
          />

          <SettingsBox
            title="Calories Tracker"
            subtitle="Calories Tracking im Overview anzeigen"
            value={isCTrackerEnabled}
            onValueChange={toggleCTracker}
          />
        </View>

        {/* Weitere Optionen */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            WEITERE OPTIONEN
          </Text>

          <TouchableOpacity style={styles.button}>
            <Text style={[styles.buttonText, { color: colors.primary }]}>Datenschutz</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={[styles.buttonText, { color: colors.primary }]}>Nutzungsbedingungen</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={[styles.buttonText, { color: colors.primary }]}>Hilfe & Support</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={[styles.version, { color: colors.textSecondary }]}>
          Version $1.0.1.0
        </Text>


      </ScrollView>
        <Bar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonWrapper: { 
    position: "absolute",
    left: 20,
    top: 40,
    zIndex: 10,
  },

  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 35,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  section: {
    marginTop: 20,
    paddingVertical: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingVertical: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#C6C6C8",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },

  version: {
    textAlign: "center",
    fontSize: 14,
    paddingVertical: 30,
  },
});
