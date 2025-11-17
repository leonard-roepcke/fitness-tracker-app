// hooks/useTheme.ts
import { Colors } from '../constants/Colors';

export const useTheme = () => {
    
    const isDark = true; // Später aus AsyncStorage oder Context
    
    return isDark ? Colors.dark : Colors;
};