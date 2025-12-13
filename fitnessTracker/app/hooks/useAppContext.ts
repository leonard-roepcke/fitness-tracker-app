import Layouts from '../constants/Layouts'
import { useText } from './useText';
import { useTheme } from './useTheme'
import { useNavigation, useRouter } from 'expo-router';
export function useAppContext(){
  const colors = useTheme();
  const layouts = Layouts;
  const nav = useNavigation();
  const text = useText();
  return{layouts, useRouter, nav, colors, text};
}
