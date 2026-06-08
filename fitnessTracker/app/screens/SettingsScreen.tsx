import * as Application from 'expo-application';
import { ColorPaletteOptions } from '@/app/constants/ColorPalettes';
import { getAccentColors } from '@/app/constants/ColorPalettes';
import React, { useContext, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { SettingsBox } from "../components/SettingsBox/SettinsBox";
import { useAppContext } from '../hooks/useAppContext';
import AppContainer from '../components/ui/AppContainer';
import { useLanguage } from "@/app/hooks/useLanguage";
import CustomModal from '../components/CustomModal';
import { NumberWheel } from '../components/NumberWheel';
import GradientSurface from '../components/ui/GradientSurface';

export default function SettingsScreen() {
  const {
    isDark,
    toggleTheme,
    colorPalette,
    setColorPalette,
    isWTrackerEnabled,
    toggleWTracker,
    isCTrackerEnabled,
    toggleCTracker,
    isDailyStreakEnabled,
    setDailyStreakEnabled,
    isRestTimerEnabled,
    toggleRestTimer,
    restTimerDuration,
    setRestTimerDuration,
  } = useContext(ThemeContext);
  const version = Application.nativeApplicationVersion;
  const build = Application.nativeBuildVersion;
  const { colors, layouts, text, nav } = useAppContext();
  const { language, setLanguage } = useLanguage();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [restTimerModalVisible, setRestTimerModalVisible] = useState(false);
  const [streakModalVisible, setStreakModalVisible] = useState(false);

  const activePaletteLabel = ColorPaletteOptions.find((p) => p.id === colorPalette);

  const formatMinutes = (minutes: number) => {
    const formatted = Number.isInteger(minutes)
      ? String(minutes)
      : minutes.toFixed(1).replace('.', language === 'german' ? ',' : '.');
    return `${formatted} ${text.restTimerMinutes}`;
  };

  const formatRestDuration = (seconds: number) => formatMinutes(seconds / 60);

  const styles = StyleSheet.create({
    scrollContent: { paddingBottom: 40 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primaryDark,
      paddingHorizontal: 4,
      paddingTop: 20,
      paddingBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    footerText: { textAlign: "center", paddingVertical: 30, color: colors.text, opacity: 0.5, fontSize: 14 },
    spacing: { height: layouts.marginVertical * 12 },
    paletteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginVertical: 6,
      borderRadius: layouts.borderRadius,
      overflow: 'hidden',
    },
    palettePreview: {
      width: 48,
      height: 48,
      borderRadius: layouts.borderRadius,
    },
    paletteLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    paletteOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: layouts.borderRadius,
      borderWidth: 1,
      borderColor: colors.border,
      marginVertical: 6,
      backgroundColor: colors.card,
    },
    paletteOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.overlay,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primaryDark,
      textAlign: 'center',
      marginBottom: 12,
    },
    modalSwitchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      marginBottom: 8,
    },
    modalSwitchLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      paddingRight: 12,
    },
    optionSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
  });

  return (
    <AppContainer heading={text.settings} isBar={true}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>{text.viewSection}</Text>
        <SettingsBox
          title={text.darkmode}
          subtitle={text.darkmodeSub}
          value={isDark}
          onValueChange={toggleTheme}
        />

        <SettingsBox
          title={text.colorPalette}
          subtitle={`${text.colorPaletteSub}: ${language === 'german' ? activePaletteLabel?.labelDe : activePaletteLabel?.labelEn}`}
          isNavigable={true}
          onPress={() => setColorModalVisible(true)}
        />

        <SettingsBox
          title={`language: ${text.lang}`}
          subtitle={text.langSub}
          isNavigable={true}
          onPress={() => setLanguageModalVisible(true)}
        />

        <Text style={styles.sectionTitle}>{text.trackerSection}</Text>
        <SettingsBox
          title={text.restTimer}
          subtitle={isRestTimerEnabled ? formatRestDuration(restTimerDuration) : text.restTimerOff}
          isNavigable={true}
          onPress={() => setRestTimerModalVisible(true)}
        />
        <SettingsBox title={text.weightTracker} subtitle={text.weightTrackerSub} value={isWTrackerEnabled} onValueChange={toggleWTracker} />
        <SettingsBox title={text.calorieTracker} subtitle={text.calorieTrackerSub} value={isCTrackerEnabled} onValueChange={toggleCTracker} />
        <SettingsBox
          title={text.dailyStreak}
          subtitle={isDailyStreakEnabled ? text.dailyStreakDaily : text.dailyStreakWeekly}
          isNavigable={true}
          onPress={() => setStreakModalVisible(true)}
        />

        <Text style={styles.sectionTitle}>{text.suportSection}</Text>
        <SettingsBox title={text.privacyPolicyHeading} subtitle={text.privacyPolicyHeadingSub} isNavigable={true} onPress={() => nav.navigate("PrivacyPolicy")} />
        <SettingsBox title={text.termsOfUseHeading} subtitle={text.termsOfUseHeadingSub} isNavigable={true} onPress={() => nav.navigate("TermsOfUse")} />
        <SettingsBox title={text.suport} subtitle={text.suportSub} isNavigable={true} onPress={() => {}} />

        <Text style={styles.footerText}>
          Version {version} ({build})
        </Text>
        <View style={styles.spacing} />
      </ScrollView>

      <CustomModal visible={languageModalVisible} onClose={() => setLanguageModalVisible(false)}>
        <TouchableOpacity style={styles.paletteOption} activeOpacity={1} onPress={() => { setLanguage("german"); setLanguageModalVisible(false); }}>
          <Text style={styles.paletteLabel}>Deutsch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paletteOption} activeOpacity={1} onPress={() => { setLanguage("english"); setLanguageModalVisible(false); }}>
          <Text style={styles.paletteLabel}>English</Text>
        </TouchableOpacity>
      </CustomModal>

      <CustomModal visible={restTimerModalVisible} onClose={() => setRestTimerModalVisible(false)}>
        <Text style={styles.modalTitle}>{text.restTimer}</Text>
        <View style={styles.modalSwitchRow}>
          <Text style={styles.modalSwitchLabel}>{text.restTimerEnable}</Text>
          <Switch
            value={isRestTimerEnabled}
            onValueChange={toggleRestTimer}
            trackColor={{ false: '#d1d5db', true: colors.primary }}
            thumbColor={isRestTimerEnabled ? '#fff' : '#f4f4f5'}
          />
        </View>
        {isRestTimerEnabled && (
          <>
            <Text style={[styles.modalTitle, { fontSize: 16, marginBottom: 4 }]}>
              {text.restTimerDurationModal}
            </Text>
            <View style={{ alignItems: 'center', paddingVertical: 8 }}>
              <NumberWheel
                min={1}
                max={10}
                step={1}
                value={restTimerDuration / 30}
                onValueChange={(units) => setRestTimerDuration(units * 30)}
                formatValue={(units) => {
                  const minutes = units * 0.5;
                  return Number.isInteger(minutes)
                    ? String(minutes)
                    : minutes.toFixed(1).replace('.', language === 'german' ? ',' : '.');
                }}
                width={120}
                suffix={` ${text.restTimerMinutes}`}
                visibleItems={3}
              />
            </View>
          </>
        )}
      </CustomModal>

      <CustomModal visible={streakModalVisible} onClose={() => setStreakModalVisible(false)}>
        <Text style={styles.modalTitle}>{text.dailyStreakModal}</Text>
        <TouchableOpacity
          style={[styles.paletteOption, !isDailyStreakEnabled && styles.paletteOptionActive]}
          activeOpacity={1}
          onPress={() => {
            setDailyStreakEnabled(false);
            setStreakModalVisible(false);
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.paletteLabel}>{text.dailyStreakWeekly}</Text>
            <Text style={styles.optionSubtitle}>{text.dailyStreakSubWeekly}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paletteOption, isDailyStreakEnabled && styles.paletteOptionActive]}
          activeOpacity={1}
          onPress={() => {
            setDailyStreakEnabled(true);
            setStreakModalVisible(false);
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.paletteLabel}>{text.dailyStreakDaily}</Text>
            <Text style={styles.optionSubtitle}>{text.dailyStreakSubDaily}</Text>
          </View>
        </TouchableOpacity>
      </CustomModal>

      <CustomModal visible={colorModalVisible} onClose={() => setColorModalVisible(false)}>
        <Text style={styles.modalTitle}>{text.colorPalette}</Text>
        {ColorPaletteOptions.map((option) => {
          const accent = getAccentColors(option.id, isDark);
          const isActive = colorPalette === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.paletteOption, isActive && styles.paletteOptionActive]}
              activeOpacity={1}
              onPress={() => {
                setColorPalette(option.id);
                setColorModalVisible(false);
              }}
            >
              <GradientSurface
                style={styles.palettePreview}
                colors={[accent.primaryLight, accent.primary, accent.primaryDark]}
              />
              <Text style={styles.paletteLabel}>
                {language === 'german' ? option.labelDe : option.labelEn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </CustomModal>
    </AppContainer>
  );
}
