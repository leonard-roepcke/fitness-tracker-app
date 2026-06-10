import { useSessions } from '@/context/SessionContext';
import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppContainer from '../components/ui/AppContainer';
import { useAppContext } from '../hooks/useAppContext';
import { useLanguage } from '../hooks/useLanguage';
import {
  formatSessionDate,
  formatSessionDuration,
  formatSessionTime,
  groupSessionsByDate,
} from '../utils/sessionHistory';

export default function HistoryScreen() {
  const { colors, layouts, text, nav } = useAppContext();
  const { language } = useLanguage();
  const { sessions, getCompletedSessions } = useSessions();

  const grouped = useMemo(
    () => groupSessionsByDate(getCompletedSessions()),
    [sessions, getCompletedSessions]
  );

  const styles = StyleSheet.create({
    scrollContent: { paddingBottom: 100 },
    dateHeader: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primaryDark,
      marginTop: 16,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: layouts.borderRadiusLarge,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    cardMeta: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    empty: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginTop: 40,
      fontSize: 16,
      lineHeight: 24,
    },
  });

  return (
    <AppContainer heading={text.historyHeading} isBar={true}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {grouped.length === 0 ? (
          <Text style={styles.empty}>{text.historyEmpty}</Text>
        ) : (
          grouped.map((group) => (
            <View key={group.dateISO}>
              <Text style={styles.dateHeader}>
                {formatSessionDate(group.dateISO, language)}
              </Text>
              {group.sessions.map((session) => {
                const duration = formatSessionDuration(
                  session.startedAt,
                  session.completedAt
                );
                return (
                  <TouchableOpacity
                    key={session.id}
                    style={styles.card}
                    onPress={() =>
                      nav.navigate('SessionDetail', { sessionId: session.id })
                    }
                  >
                    <Text style={styles.cardTitle}>{session.workoutName}</Text>
                    <Text style={styles.cardMeta}>
                      {formatSessionTime(session.completedAt ?? session.startedAt, language)}
                      {' · '}
                      {session.totalVolume.toLocaleString()} kg
                      {' · '}
                      {duration} {text.historyMinutes}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </AppContainer>
  );
}
