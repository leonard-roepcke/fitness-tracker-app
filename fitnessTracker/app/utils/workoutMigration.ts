import { generateId } from './generateId';
import { Exercise, Workout } from '../types/workout';

export const ensureExerciseId = (exercise: Exercise): Exercise => {
  if (exercise.id) return exercise;
  return { ...exercise, id: generateId() };
};

export const normalizeWorkout = (workout: Workout): Workout => ({
  ...workout,
  exercises: workout.exercises.map(ensureExerciseId),
});

export const normalizeWorkouts = (workouts: Workout[]): Workout[] =>
  workouts.map(normalizeWorkout);
