import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SettingsBox } from '../components/SettingsBox/SettinsBox';
import { useTheme } from '../hooks/useTheme';

export default function SettingsScreen() {
  const colors = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState(true);
  const [autoplay, setAutoplay] = useState(false);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Einstellungen</Text>

      {/* App-Einstellungen Sektion */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          APP-EINSTELLUNGEN
        </Text>

        <SettingsBox
          title="Dunkelmodus"
          subtitle="Darkmode aktivieren"
          value={darkMode}
          onValueChange={setDarkMode}
        />
        <SettingsBox
          title="Benachrichtigungen"
          subtitle="Push-Benachrichtigungen erhalten"
          value={notifications}
          onValueChange={setNotifications}
        />
        <SettingsBox
          title="Standort"
          subtitle="Standortzugriff erlauben"
          value={location}
          onValueChange={setLocation}
        />
        <SettingsBox
          title="Autoplay"
          subtitle="Videos automatisch abspielen"
          value={autoplay}
          onValueChange={setAutoplay}
        />
      </View>

      {/* Weitere Optionen Sektion */}
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

      <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
    paddingTop: 40,
  },
  section: {
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6C8', // optional, kann dynamisch gemacht werden
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 30,
  },
});
