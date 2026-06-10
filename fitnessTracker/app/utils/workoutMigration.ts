import { v4 as uuidv4 } from 'uuid';
import { Exercise, Workout } from '../types/workout';

export const ensureExerciseId = (exercise: Exercise): Exercise => {
  if (exercise.id) return exercise;
  return { ...exercise, id: uuidv4() };
};

export const normalizeWorkout = (workout: Workout): Workout => ({
  ...workout,
  exercises: workout.exercises.map(ensureExerciseId),
});

export const normalizeWorkouts = (workouts: Workout[]): Workout[] =>
  workouts.map(normalizeWorkout);
