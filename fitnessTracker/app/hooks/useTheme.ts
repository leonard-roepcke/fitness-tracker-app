import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext"
import { Colors } from "../constants/Colors";

export const useTheme = () => {
  const { isDark } = useContext(ThemeContext);
  return isDark ? Colors.dark : Colors;
};