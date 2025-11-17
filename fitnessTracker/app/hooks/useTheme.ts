// hooks/useTheme.ts
import { Colors } from '../constants/Colors';

export const useTheme = () => {
    
    const isDark = false; // Später aus AsyncStorage oder Context
    
    return isDark ? Colors.dark : Colors;
};