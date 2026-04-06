import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CategoryType, useCollection } from 'context/CollectionContext';
import { useTheme } from 'context/ThemeContext';
import { ResourceType } from 'hooks/useResource';
import { SearchIcon } from 'components/Icons';

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
      <View className="h-14 flex-row items-center rounded-lg border shadow-lg"
	  		style={{ borderColor: colors.accent, backgroundColor: colors.surfaceButton, shadowColor: colors.shadow }}>
        {/* Icono Lupa */}
        <TouchableOpacity 
          className="justify-center pl-3 py-2"
          onPress={handleSearch}
          activeOpacity={0.7}
          hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}
        >
          <SearchIcon color={colors.secondaryText}/>
        </TouchableOpacity>
        
        <TextInput
          className="h-full flex-1 px-3 text-base text-primaryText"
          style={{color: colors.primaryText, lineHeight: 17}}
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