import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResourceType } from 'hooks/useResource';
import { useTheme } from 'context/ThemeContext';
import { BookIcon, FilmIcon, ShowIcon, GameIcon, MusicIcon, WrenchIcon } from 'components/Icons';

interface SearchPlaceholderProps {
  category: ResourceType;
  loading: boolean;
}

// Mapeo de iconos por categoría
const ICONOS_CATEGORIA: Record<ResourceType, React.ElementType> = {
  'libro': BookIcon,
  'pelicula': FilmIcon, 
  'serie': ShowIcon,
  'videojuego': GameIcon,
  'cancion': MusicIcon,
};

const CATEGORY_LABELS: Record<ResourceType, string> = {
  libro: 'Libros',
  pelicula: 'Películas',
  serie: 'Series',
  videojuego: 'Videojuegos',
  cancion: 'Canciones',
};

export const SearchPlaceholder = ({ category, loading }: SearchPlaceholderProps) => {
  const IconComponent = ICONOS_CATEGORIA[category] || WrenchIcon;
  const categoryLabel = CATEGORY_LABELS[category] || 'contenido';
  const {colors} = useTheme();
  return (
    <View className={`-z-10 flex-1 items-center justify-center ${loading ? 'hidden' : ''}`}>
      {/* Contenedor del Icono  */}
      <View className="mb-6 h-32 w-32 items-center justify-center rounded-full" style={{backgroundColor: `${colors.primaryText}1A`}}>
        <View className="h-28 w-28 items-center justify-center rounded-full" style={{backgroundColor: colors.secondary}}>
          <IconComponent 
            size={64} 
            color={colors.primaryText}
          />
        </View>
      </View>

      {/* Texto Principal (Nombre de la categoría) */}
      <Text className="mb-3 text-center text-3xl font-bold" style={{color: colors.primaryText}}>
        {categoryLabel}
      </Text>

      {/* Texto Secundario (Instrucciones) */}
      <Text className="px-4 text-center" style={{color: colors.secondaryText}}>
        Realiza una búsqueda para ver resultados de {categoryLabel.toLowerCase()}.
      </Text>
    </View>
  );
};