// hooks/useTheme.ts
import { Colors } from '../constants/Colors';

export const useTheme = () => {
    
    const isDark = 0; // Später aus AsyncStorage oder Context
    
    return isDark ? Colors.dark : Colors;
};