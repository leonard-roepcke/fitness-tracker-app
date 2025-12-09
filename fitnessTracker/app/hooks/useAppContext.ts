import Layouts from '../constants/Layouts'
import { useTheme } from './useTheme'
import { useNavigation, useRouter } from 'expo-router';
export function useAppContext(){
  const colors = useTheme();
  const layouts = Layouts;
  const nav = useNavigation();

  return{layouts, useRouter, nav, colors};
}
