import { useSessions } from '@/context/SessionContext';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { generateId } from '../utils/generateId';
import { useWorkouts } from '../../context/WorkoutContext';
import { CreateBox } from '../components/CreateBox';
import { WorkoutBox } from '../components/WorkoutBox';
import { Workout } from "../types/workout";
import { useAppContext } from '../hooks/useAppContext';
import AppContainer from '../components/ui/AppContainer';
import { StreakFlame } from '../components/Streak';
import GradientButton from '../components/ui/GradientButton';
import { useLanguage } from '../hooks/useLanguage';
import {
  createWorkoutFromTemplate,
  DEFAULT_WORKOUT_TEMPLATES,
} from '../constants/defaultWorkouts';
import { useOnboardingRedirect } from './OnboardingScreen';

const MOTIVATION_KEYS = [
  'homeMotivation1',
  'homeMotivation2',
  'homeMotivation3',
] as const;

export default function WorkoutOverview() {
    const { workouts, updateWorkout } = useWorkouts();
    const { getSessionsByWorkoutId } = useSessions();
    const { language } = useLanguage();
    const { colors, layouts, text } = useAppContext();
    useOnboardingRedirect();

    const motivation = useMemo(() => {
      const key = MOTIVATION_KEYS[Math.floor(Math.random() * MOTIVATION_KEYS.length)];
      return (text as Record<string, string>)[key] ?? text.homeMotivation1;
    }, [text]);

    const favorites = useMemo(
      () => (workouts ?? []).filter((w) => w.isFavorite),
      [workouts]
    );

    const regular = useMemo(
      () => (workouts ?? []).filter((w) => !w.isFavorite),
      [workouts]
    );

    const getLastTrainedLabel = (workoutId: number): string | null => {
      const sessions = getSessionsByWorkoutId(workoutId);
      if (sessions.length === 0) return null;
      const date = new Date(sessions[0].completedAt ?? sessions[0].startedAt);
      const locale = language === 'german' ? 'de-DE' : 'en-GB';
      return date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });
    };

    const styles = StyleSheet.create({
        subtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 12,
        },
        scrollView: {
            width: '100%',
        },
        sectionTitle: {
          fontSize: 14,
          fontWeight: '700',
          color: colors.primaryDark,
          marginTop: 8,
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        emptyContainer: {
          alignItems: 'center',
          paddingVertical: 32,
          paddingHorizontal: 16,
        },
        emptyTitle: {
          fontSize: 20,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 8,
          textAlign: 'center',
        },
        emptyBody: {
          fontSize: 15,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 22,
          marginBottom: 20,
        },
        templateRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          marginBottom: 16,
        },
        templateBtn: {
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: layouts.borderRadius,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        templateText: {
          color: colors.text,
          fontSize: 14,
          fontWeight: '500',
        },
        listItem: {
          marginBottom: layouts.marginVertical,
        },
    });

    const addWorkout = () => {
        if (!workouts) return;
        const newId = workouts.length > 0 ? Math.max(...workouts.map(w => w.id ?? 0)) + 1 : 0;
        const newWorkout: Workout = {
            id: newId,
            name: text.newWorkout,
            exercises: [{ id: generateId(), name: "Exercise", sets: 3, last_reps: [1,1,1], last_weight: [10,10,10], trackWeight: true, trackReps: true }],
            createdAt: Date.now(),
            isFavorite: false,
        };

        updateWorkout([...workouts, newWorkout]);
    };

    const addTemplate = (index: number) => {
      if (!workouts) return;
      const newId = workouts.length > 0 ? Math.max(...workouts.map(w => w.id ?? 0)) + 1 : 0;
      const template = createWorkoutFromTemplate(
        DEFAULT_WORKOUT_TEMPLATES[index],
        language,
        newId
      );
      updateWorkout([...workouts, template]);
    };

    const handleFavoritesReorder = ({ data }: { data: Workout[] }) => {
      if (!workouts) return;
      updateWorkout([...data, ...regular]);
    };

    const handleRegularReorder = ({ data }: { data: Workout[] }) => {
      if (!workouts) return;
      updateWorkout([...favorites, ...data]);
    };

    const renderWorkoutItem = ({ item, drag, isActive }: RenderItemParams<Workout>) => {
      const lastLabel = getLastTrainedLabel(item.id);
      return (
        <ScaleDecorator>
          <View style={styles.listItem}>
            <WorkoutBox
              variant="box"
              workout={item}
              onDrag={drag}
              isDragging={isActive}
              lastTrainedLabel={
                lastLabel ? `${text.homeLastTrained}: ${lastLabel}` : null
              }
            />
          </View>
        </ScaleDecorator>
      );
    };

    const isEmpty = !workouts || workouts.length === 0;

    return (
        <AppContainer heading={text.workouts} isBar={true} headerRight={<StreakFlame />}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.subtitle}>{motivation}</Text>

                {isEmpty ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>{text.homeEmptyTitle}</Text>
                    <Text style={styles.emptyBody}>{text.homeEmptyBody}</Text>
                    <GradientButton title={text.createWorkout} onPress={addWorkout} />
                    <Text style={[styles.emptyBody, { marginTop: 20 }]}>{text.homeOrTemplate}</Text>
                    <View style={styles.templateRow}>
                      {DEFAULT_WORKOUT_TEMPLATES.map((tpl, i) => (
                        <TouchableOpacity
                          key={i}
                          style={styles.templateBtn}
                          onPress={() => addTemplate(i)}
                        >
                          <Text style={styles.templateText}>
                            {language === 'german' ? tpl.nameDe : tpl.nameEn}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ) : (
                  <>
                    {favorites.length > 0 && (
                      <>
                        <Text style={styles.sectionTitle}>{text.homeFavorites}</Text>
                        <DraggableFlatList
                          data={favorites}
                          keyExtractor={(item) => `fav-${item.id}`}
                          renderItem={renderWorkoutItem}
                          onDragEnd={handleFavoritesReorder}
                          scrollEnabled={false}
                        />
                      </>
                    )}
                    {regular.length > 0 && (
                      <>
                        {favorites.length > 0 && (
                          <Text style={styles.sectionTitle}>{text.homeAllWorkouts}</Text>
                        )}
                        <DraggableFlatList
                          data={regular}
                          keyExtractor={(item) => `reg-${item.id}`}
                          renderItem={renderWorkoutItem}
                          onDragEnd={handleRegularReorder}
                          scrollEnabled={false}
                        />
                      </>
                    )}
                    <CreateBox onPress={addWorkout} iconName='add' text={text.createWorkout} variant='accent' />
                  </>
                )}
                <View style={{ height: layouts.marginVertical * 12 }} />
            </ScrollView>
        </AppContainer>
    );
}
