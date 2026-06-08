export type ColorPaletteId = 'blue' | 'teal' | 'purple' | 'orange';

type AccentColors = {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    shadow: string;
    overlay: string;
    surface: string;
    border: string;
};

export const ColorPaletteOptions: { id: ColorPaletteId; labelDe: string; labelEn: string }[] = [
    { id: 'blue', labelDe: 'Blau', labelEn: 'Blue' },
    { id: 'teal', labelDe: 'Türkis', labelEn: 'Teal' },
    { id: 'purple', labelDe: 'Violett', labelEn: 'Purple' },
    { id: 'orange', labelDe: 'Orange', labelEn: 'Orange' },
];

const lightAccents: Record<ColorPaletteId, AccentColors> = {
    blue: {
        primary: '#007AFF',
        primaryLight: '#4DA3FF',
        primaryDark: '#0056B3',
        shadow: '#007AFF',
        overlay: 'rgba(0, 122, 255, 0.08)',
        surface: '#E8F1FF',
        border: '#C5D9F0',
    },
    teal: {
        primary: '#00A896',
        primaryLight: '#4ECDC4',
        primaryDark: '#007A6E',
        shadow: '#00A896',
        overlay: 'rgba(0, 168, 150, 0.08)',
        surface: '#E6F7F5',
        border: '#B8E6E0',
    },
    purple: {
        primary: '#7C4DFF',
        primaryLight: '#B388FF',
        primaryDark: '#5E35B1',
        shadow: '#7C4DFF',
        overlay: 'rgba(124, 77, 255, 0.08)',
        surface: '#F0EBFF',
        border: '#D4C4FF',
    },
    orange: {
        primary: '#FF8C00',
        primaryLight: '#FFB347',
        primaryDark: '#CC7000',
        shadow: '#FF8C00',
        overlay: 'rgba(255, 140, 0, 0.08)',
        surface: '#FFF4E6',
        border: '#FFD9A8',
    },
};

const darkAccents: Record<ColorPaletteId, AccentColors> = {
    blue: {
        primary: '#0A84FF',
        primaryLight: '#409CFF',
        primaryDark: '#0066CC',
        shadow: '#0A84FF',
        overlay: 'rgba(10, 132, 255, 0.12)',
        surface: '#1E2D4A',
        border: '#2A3F66',
    },
    teal: {
        primary: '#2DD4BF',
        primaryLight: '#5EEAD4',
        primaryDark: '#0F766E',
        shadow: '#2DD4BF',
        overlay: 'rgba(45, 212, 191, 0.12)',
        surface: '#14302C',
        border: '#1F4A44',
    },
    purple: {
        primary: '#A78BFA',
        primaryLight: '#C4B5FD',
        primaryDark: '#7C3AED',
        shadow: '#A78BFA',
        overlay: 'rgba(167, 139, 250, 0.12)',
        surface: '#251B3D',
        border: '#3D2E66',
    },
    orange: {
        primary: '#FB923C',
        primaryLight: '#FDBA74',
        primaryDark: '#EA580C',
        shadow: '#FB923C',
        overlay: 'rgba(251, 146, 60, 0.12)',
        surface: '#2E1F14',
        border: '#4A3220',
    },
};

export const getAccentColors = (palette: ColorPaletteId, isDark: boolean): AccentColors =>
    isDark ? darkAccents[palette] : lightAccents[palette];
