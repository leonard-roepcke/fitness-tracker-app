import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GradientButton from '../components/ui/GradientButton';
import AppContainer from '../components/ui/AppContainer';
import { useAppContext } from '../hooks/useAppContext';

const ONBOARDING_KEY = '@onboarding_done';

export const isOnboardingDone = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === 'true';
};

export const setOnboardingDone = async () => {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
};

export const resetOnboarding = async () => {
  await AsyncStorage.removeItem(ONBOARDING_KEY);
};

const SLIDES = ['welcome', 'create', 'track'] as const;

export default function OnboardingScreen() {
  const { colors, layouts, text, nav } = useAppContext();
  const [slideIndex, setSlideIndex] = useState(0);

  const slideKey = SLIDES[slideIndex];
  const isLast = slideIndex === SLIDES.length - 1;

  const slideContent = {
    welcome: { title: text.onboardingWelcome, body: text.onboardingWelcomeBody },
    create: { title: text.onboardingCreate, body: text.onboardingCreateBody },
    track: { title: text.onboardingTrack, body: text.onboardingTrackBody },
  }[slideKey];

  const finish = async () => {
    await setOnboardingDone();
    nav.navigate('WorkoutOverview');
  };

  const next = () => {
    if (isLast) finish();
    else setSlideIndex((i) => i + 1);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingBottom: 120,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 32,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },
    dotActive: {
      backgroundColor: colors.primary,
      width: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    body: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
      textAlign: 'center',
      marginBottom: 32,
    },
    skip: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginTop: 16,
      fontSize: 14,
    },
  });

  return (
    <AppContainer heading={text.onboardingHeading}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === slideIndex && styles.dotActive]}
            />
          ))}
        </View>
        <Text style={styles.title}>{slideContent.title}</Text>
        <Text style={styles.body}>{slideContent.body}</Text>
        <GradientButton
          title={isLast ? text.onboardingStart : text.onboardingNext}
          onPress={next}
        />
        {!isLast && (
          <TouchableOpacity onPress={finish}>
            <Text style={styles.skip}>{text.onboardingSkip}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </AppContainer>
  );
}

export function useOnboardingRedirect() {
  const { nav } = useAppContext();

  useEffect(() => {
    (async () => {
      const done = await isOnboardingDone();
      if (!done) {
        nav.navigate('Onboarding');
      }
    })();
  }, [nav]);
}
