import { generateId } from '../utils/generateId';
import { Workout } from '../types/workout';

export type DefaultWorkoutTemplate = {
  nameDe: string;
  nameEn: string;
  exercises: { nameDe: string; nameEn: string; sets: number }[];
};

export const DEFAULT_WORKOUT_TEMPLATES: DefaultWorkoutTemplate[] = [
  {
    nameDe: 'Push',
    nameEn: 'Push',
    exercises: [
      { nameDe: 'Bankdrücken', nameEn: 'Bench Press', sets: 3 },
      { nameDe: 'Schulterdrücken', nameEn: 'Shoulder Press', sets: 3 },
      { nameDe: 'Trizeps-Drücken', nameEn: 'Tricep Pushdown', sets: 3 },
    ],
  },
  {
    nameDe: 'Pull',
    nameEn: 'Pull',
    exercises: [
      { nameDe: 'Klimmzüge', nameEn: 'Pull-ups', sets: 3 },
      { nameDe: 'Rudern', nameEn: 'Rows', sets: 3 },
      { nameDe: 'Bizeps-Curls', nameEn: 'Bicep Curls', sets: 3 },
    ],
  },
  {
    nameDe: 'Ganzkörper',
    nameEn: 'Full Body',
    exercises: [
      { nameDe: 'Kniebeugen', nameEn: 'Squats', sets: 3 },
      { nameDe: 'Bankdrücken', nameEn: 'Bench Press', sets: 3 },
      { nameDe: 'Kreuzheben', nameEn: 'Deadlift', sets: 3 },
    ],
  },
];

export const createWorkoutFromTemplate = (
  template: DefaultWorkoutTemplate,
  language: 'german' | 'english',
  nextId: number
): Workout => {
  return {
    id: nextId,
    name: language === 'german' ? template.nameDe : template.nameEn,
    exercises: template.exercises.map((ex) => ({
      id: generateId(),
      name: language === 'german' ? ex.nameDe : ex.nameEn,
      sets: ex.sets,
      last_reps: Array(ex.sets).fill(8),
      last_weight: Array(ex.sets).fill(20),
      trackWeight: true,
      trackReps: true,
    })),
    createdAt: Date.now(),
    isFavorite: false,
  };
};
