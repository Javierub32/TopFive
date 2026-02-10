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
  const { inputBusqueda, setInputBusqueda, handleSearch, categoriaActual, setCategoriaActual, menuCategoriaAbierto, setMenuCategoriaAbierto} = useCollection();
  const { colors } = useTheme();
  return (
    <View className="relative z-50 mb-3">
      <View className="h-12 flex-row items-center rounded-lg border border-borderButton bg-surfaceButton shadow-lg">
        {/* Icono Lupa */}
        <View className="justify-center pl-3">
          <MaterialCommunityIcons name="magnify" size={20} color={colors.secondaryText} />
        </View>

        {/* Input */}
        <TextInput
          className="h-full flex-1 px-3 text-base text-primaryText"
          placeholder={`Buscar en ${resourceTypeMap[categoriaActual as ResourceType]}...`}
          placeholderTextColor={colors.placeholderText}
          value={inputBusqueda}
          onChangeText={setInputBusqueda}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <View className="h-6 w-[1px] bg-borderButton" />

        {/* Selector de Categoría */}
        <TouchableOpacity
          className="h-full flex-row items-center justify-center px-3"
          activeOpacity={0.7}
          onPress={() => {
            setMenuCategoriaAbierto(!menuCategoriaAbierto);
          }}>
          <View className="max-w-[90px]">
            <Text className="mr-1 font-medium text-xs text-secondaryText" numberOfLines={1}>
              {resourceTypeMap[categoriaActual as ResourceType]}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={menuCategoriaAbierto ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#94a3b8"
          />
        </TouchableOpacity>

      </View>

      {/* Desplegable de Categorías */}
      {menuCategoriaAbierto && (
        <View className="absolute right-0 top-14 z-50 w-48 overflow-hidden rounded-lg border border-borderButton bg-surfaceButton shadow-xl">
          {OPCIONES_CATEGORIA.map((opcion, index) => (
            <TouchableOpacity
              key={opcion}
              className={`flex-row items-center justify-between p-3 ${index !== OPCIONES_CATEGORIA.length - 1 ? 'border-b border-borderButton' : ''} ${categoriaActual === categoryToResourceMap[opcion] ? 'bg-borderButton' : 'active:bg-borderButton/50'}`}
              onPress={() => {
                setCategoriaActual(categoryToResourceMap[opcion]);
                setMenuCategoriaAbierto(false);
              }}>
              <Text className={`text-sm ${categoriaActual === categoryToResourceMap[opcion] ? 'font-bold text-white' : 'text-secondaryText'}`}>
                {opcion}
              </Text>
              {categoriaActual === categoryToResourceMap[opcion] && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};