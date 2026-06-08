import { ViewStyle } from 'react-native';

type ShadowColors = {
    shadow: string;
};

export const cardShadow = (colors: ShadowColors): ViewStyle => ({
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
});

export const elevatedShadow = (colors: ShadowColors): ViewStyle => ({
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
});

export const subtleShadow = (colors: ShadowColors): ViewStyle => ({
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
});
