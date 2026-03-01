import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CategoryType, useCollection } from 'context/CollectionContext';
import { useTheme } from 'context/ThemeContext';
import { ResourceType } from 'hooks/useResource';

const OPCIONES_CATEGORIA: string[] = ['Libros', 'Películas', 'Series', 'Videojuegos', 'Canciones'];

export const resourceTypeMap: Record<ResourceType, string> = {
  'pelicula': 'Películas',
  'serie': 'Series',
  'videojuego': 'Videojuegos',
  'libro': 'Libros',
  'cancion': 'Canciones',
};

export const categoryToResourceMap: Record<string, ResourceType> = {
  'Libros': 'libro',
  'Películas': 'pelicula',
  'Series': 'serie',
  'Videojuegos': 'videojuego',
  'Canciones': 'cancion',
};



export const SearchBar = () => {
  const { inputBusqueda, setInputBusqueda, handleSearch, categoriaActual} = useCollection();
  const { colors } = useTheme();
  return (
    <View className="relative z-50 mb-3">
      <View className="h-12 flex-row items-center rounded-lg border border-borderButton bg-surfaceButton shadow-lg">
        {/* Icono Lupa */}
        <View className="justify-center pl-3">
          <MaterialCommunityIcons name="magnify" size={20} color={colors.secondaryText} />
        </View>
        <TextInput
          className="h-full flex-1 px-3 text-base text-primaryText"
          placeholder={`Buscar en ${resourceTypeMap[categoriaActual as ResourceType]}...`}
          placeholderTextColor={colors.placeholderText}
          value={inputBusqueda}
          onChangeText={setInputBusqueda}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
    </View>
  );
};