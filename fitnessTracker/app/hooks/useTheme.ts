import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { buildThemeColors } from "../constants/Colors";

export const useTheme = () => {
  const { isDark, colorPalette } = useContext(ThemeContext);
  return buildThemeColors(colorPalette, isDark);
};
