import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryKey } from '../hooks/useSearchContent';

interface SearchPlaceholderProps {
  category: CategoryKey;
}

// Mapeo de iconos por categoría
const ICONOS_CATEGORIA: Record<CategoryKey, keyof typeof MaterialCommunityIcons.glyphMap> = {
  'Libros': 'book-open-page-variant',
  'Películas': 'movie-open', 
  'Series': 'television-classic',
  'Videojuegos': 'google-controller',
  'Canciones': 'music',
};

interface SearchPlaceholderProps {
  category: CategoryKey,
  loading: boolean
};

export const SearchPlaceholder = ({ category, loading }: SearchPlaceholderProps) => {
  const iconName = ICONOS_CATEGORIA[category] || 'hammer-wrench';
  return (
    <View className={`-z-10 flex-1 items-center justify-center ${loading ? 'hidden' : ''}`}>
      {/* Contenedor del Icono  */}
      <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-white/5">
        <View className="h-28 w-28 items-center justify-center rounded-full bg-primary">
          <MaterialCommunityIcons 
            name={iconName} 
            size={64} 
            color="#fff" 
          />
        </View>
      </View>

      {/* Texto Principal (Nombre de la categoría) */}
      <Text className="mb-3 text-center text-3xl font-bold text-primaryText">
        {category}
      </Text>

      {/* Texto Secundario (Instrucciones) */}
      <Text className="px-4 text-center text-secondaryText">
        Realiza una búsqueda para ver resultados de {category.toLowerCase()}.
      </Text>
    </View>
  );
};