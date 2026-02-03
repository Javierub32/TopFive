import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryKey } from '../hooks/useSearchContent';
import { useTheme } from 'context/ThemeContext';
import { BookIcon, FilmIcon, ShowIcon, GameIcon, MusicIcon, WrenchIcon } from 'components/Icons';

interface SearchPlaceholderProps {
  category: CategoryKey;
}

// Mapeo de iconos por categoría
const ICONOS_CATEGORIA: Record<CategoryKey, React.ElementType> = {
  'Libros': BookIcon,
  'Películas': FilmIcon, 
  'Series': ShowIcon,
  'Videojuegos': GameIcon,
  'Canciones': MusicIcon,
};

interface SearchPlaceholderProps {
  category: CategoryKey,
  loading: boolean
};

export const SearchPlaceholder = ({ category, loading }: SearchPlaceholderProps) => {
  const IconComponent = ICONOS_CATEGORIA[category] || WrenchIcon;
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
        {category}
      </Text>

      {/* Texto Secundario (Instrucciones) */}
      <Text className="px-4 text-center" style={{color: colors.secondaryText}}>
        Realiza una búsqueda para ver resultados de {category.toLowerCase()}.
      </Text>
    </View>
  );
};