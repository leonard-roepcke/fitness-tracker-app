import * as Application from 'expo-application';
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Button } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { SettingsBox } from "../components/SettingsBox/SettinsBox";
import { useAppContext } from '../hooks/useAppContext';
import AppContainer from '../components/ui/AppContainer';
import { useLanguage } from "@/app/hooks/useLanguage";
import CustomModal from '../components/CustomModal';
import { CreateBox } from '../components/CreateBox';
import TermsOfUseScreen from './info/TermsOfUseScreen';

export default function SettingsScreen() {
  const { isDark, toggleTheme, isWTrackerEnabled, toggleWTracker, isCTrackerEnabled, toggleCTracker, isDailyStreakEnabled, toggleDailyStreak } =
    useContext(ThemeContext);
  const router = useRouter();
  const version = Application.nativeApplicationVersion;
  const build = Application.nativeBuildVersion;  
  const {colors, layouts, text, nav} = useAppContext();
  const { language, setLanguage } = useLanguage();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);


  const styles = StyleSheet.create({
    scrollContent: { paddingBottom: 40 },
    header: { fontSize: 32, fontWeight: "bold", marginTop: 35, color: colors.text, textAlign: 'center' },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.text, opacity: 0.6, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    footerText: { textAlign: "center", paddingVertical: 30, color: colors.text, opacity: 0.5, fontSize: 14 },
    title: { fontSize: 10, fontWeight: '600', marginBottom: layouts.marginVertical, color: colors.text, justifyContent: 'center', alignItems: 'center' },
    spacing: { height: layouts.marginVertical*12 },
    languageOption: { paddingVertical: 14, paddingHorizontal: 20, backgroundColor: colors.primary, borderRadius: 12, marginVertical: 5, alignItems: 'center' },
    languageText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  });

  return (
    <AppContainer heading={text.settings} isBar={true}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Darstellung Sektion */}
        <Text style={styles.sectionTitle}>{text.viewSection}</Text>
        <SettingsBox
          title={text.darkmode}
          subtitle={text.darkmodeSub}
          value={isDark}
          onValueChange={toggleTheme}
        />

        <SettingsBox
          title={`language: ${text.lang}`}
          subtitle={text.langSub}
          isNavigable={true}
          onPress={() => setLanguageModalVisible(true)}
        />

        {/* Tracker Sektion */}
        <Text style={styles.sectionTitle}>{text.trackerSection}</Text>
        <SettingsBox title={text.weightTracker} subtitle={text.weightTrackerSub}  value={isWTrackerEnabled} onValueChange={toggleWTracker} />
        <SettingsBox title={text.calorieTracker} subtitle={text.calorieTrackerSub} value={isCTrackerEnabled} onValueChange={toggleCTracker} />
        <SettingsBox title={text.dailyStreak} subtitle={text.dailyStreakSub} value={isDailyStreakEnabled} onValueChange={toggleDailyStreak} />

        {/* Rechtliches & Support Sektion */}
        <Text style={styles.sectionTitle}>{text.suportSection}</Text>
        <SettingsBox title={text.privacyPolicyHeading} subtitle={text.privacyPolicyHeadingSub} isNavigable={true} onPress={() => nav.navigate("PrivacyPolicy")} />
        <SettingsBox title={text.termsOfUseHeading} subtitle={text.termsOfUseHeadingSub} isNavigable={true} onPress={() => nav.navigate("TermsOfUse")} />
        <SettingsBox title={text.suport} subtitle={text.suportSub} isNavigable={true} onPress={() => {}} />

        {/* Footer */}
        <Text style={styles.footerText}>
          Version {version} ({build})
        </Text>
        <View style={styles.spacing}/>
      </ScrollView>

      {/* Sprache Modal */}
      <CustomModal visible={languageModalVisible} onClose={() => setLanguageModalVisible(false)}>
          <CreateBox onPress={()=> {setLanguage("german"); setLanguageModalVisible(false)}} text='Deutsch' iconName='square'/>
          <CreateBox onPress={()=> {setLanguage("english"); setLanguageModalVisible(false)}} text='English  ' iconName='square'/>
      </CustomModal>
    </AppContainer>
  );
}

