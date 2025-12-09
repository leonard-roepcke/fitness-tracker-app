import Layouts from '../constants/Layouts'
import { useTheme } from './useTheme'
export function useAppContext(){
  const colors = useTheme();
  const layouts = Layouts;
  return{layouts, colors};
}
