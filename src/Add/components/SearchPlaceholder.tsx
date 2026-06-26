import React from 'react';
import { View } from 'react-native';
import { ResourceType } from 'hooks/useResource';
import { useTheme } from 'context/ThemeContext';
import { BookIcon, FilmIcon, ShowIcon, GameIcon, MusicIcon, WrenchIcon } from 'components/Icons';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface SearchPlaceholderProps {
  category: ResourceType;
  loading: boolean;
}

// Mapeo de iconos por categoría
const ICONOS_CATEGORIA: Record<ResourceType, React.ElementType> = {
  libro: BookIcon,
  pelicula: FilmIcon,
  serie: ShowIcon,
  videojuego: GameIcon,
  cancion: MusicIcon,
};

const CATEGORY_LABELS: Record<ResourceType, string> = {
  libro: 'categories.books',
  pelicula: 'categories.films',
  serie: 'categories.series',
  videojuego: 'categories.videogames',
  cancion: 'categories.albums',
} as const satisfies Record<ResourceType, string>;

export const SearchPlaceholder = ({ category, loading }: SearchPlaceholderProps) => {
  const IconComponent = ICONOS_CATEGORIA[category] || WrenchIcon;
  const categoryLabel = CATEGORY_LABELS[category] || 'contenido';
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
        className="mb-3 text-center text-3xl font-bold"
        style={{ color: colors.primaryText }}>
        {t(categoryLabel as any)}
      </AppText>

      {/* Texto Secundario (Instrucciones) */}
      <AppText className="px-4 text-center" style={{ color: colors.secondaryText }}>
        {t('search.description', { category: t(categoryLabel as any).toLowerCase() })}
      </AppText>
    </View>
  );
};
