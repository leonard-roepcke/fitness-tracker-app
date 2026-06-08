import { ColorPaletteId, getAccentColors } from './ColorPalettes';

const baseLight = {
    secondary: '#5856D6',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    background: '#F2F6FC',
    card: '#FFFFFF',
    text: '#0A1628',
    textSecondary: '#5C6B82',
};

const baseDark = {
    secondary: '#5856D6',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    background: '#0B1120',
    card: '#151D2E',
    text: '#F0F4FF',
    textSecondary: '#8A9BB8',
};

export const buildThemeColors = (palette: ColorPaletteId, isDark: boolean) => {
    const base = isDark ? baseDark : baseLight;
    const accent = getAccentColors(palette, isDark);
    return { ...base, ...accent };
};

export const Colors = buildThemeColors('blue', false);

export type ThemeColors = ReturnType<typeof buildThemeColors>;
