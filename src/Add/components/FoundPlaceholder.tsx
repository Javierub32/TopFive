import React from 'react';
import { View } from 'react-native';
import { ResourceType } from 'hooks/useResource';
import { useTheme } from 'context/ThemeContext';
import { CrossIcon } from 'components/Icons';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface SearchPlaceholderProps {
  category: ResourceType;
  loading: boolean;
}

export const FoundPlaceholder = ({ category, loading }: SearchPlaceholderProps) => {
  const IconComponent = CrossIcon;
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View className={`-z-10 flex-1 items-center justify-center ${loading ? 'hidden' : ''}`}>
      {/* Contenedor del Icono  */}
      <View
        className="mb-6 h-32 w-32 items-center justify-center rounded-full"
        style={{ backgroundColor: `${colors.primaryText}1A` }}>
        <View
          className="h-28 w-28 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.secondary }}>
          <IconComponent size={64} color={colors.primaryText} />
        </View>
      </View>

      {/* Texto Principal (Nombre de la categoría) */}
      <AppText
        className="mb-3 text-center font-bold"
        style={{ color: colors.primaryText, fontSize: 28 }}>
        {t('search.noResults')}
      </AppText>
    </View>
  );
};
