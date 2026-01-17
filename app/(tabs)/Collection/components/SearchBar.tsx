import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryType } from '../hooks/useCollection';
import { COLORS } from 'constants/colors';

interface Props {
  busqueda: string;
  setBusqueda: (val: string) => void;
  categoriaActual: CategoryType;
  setCategoriaActual: (cat: CategoryType) => void;
  menuAbierto: boolean;
  setMenuAbierto: (val: boolean) => void;
  filtrosAbiertos: boolean;
  setFiltrosAbiertos: (val: boolean) => void;
  isFilterActive: boolean;
}

const OPCIONES_CATEGORIA: CategoryType[] = ['Libros', 'Películas', 'Series', 'Videojuegos', 'Canciones'];

export const SearchBar = ({
  busqueda,
  setBusqueda,
  categoriaActual,
  setCategoriaActual,
  menuAbierto,
  setMenuAbierto,
  filtrosAbiertos,
  setFiltrosAbiertos,
  isFilterActive
}: Props) => {
  return (
    <View className="relative z-50 mb-3">
      <View className="h-12 flex-row items-center rounded-lg border border-borderButton bg-surfaceButton shadow-lg">
        {/* Icono Lupa */}
        <View className="justify-center pl-3">
          <MaterialCommunityIcons name="magnify" size={20} color={COLORS.secondaryText} />
        </View>

        {/* Input */}
        <TextInput
          className="h-full flex-1 px-3 text-base text-primaryText"
          placeholder={`Buscar en ${categoriaActual}...`}
          placeholderTextColor={COLORS.placeholderText}
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <View className="h-6 w-[1px] bg-borderButton" />

        {/* Selector de Categoría */}
        <TouchableOpacity
          className="h-full flex-row items-center justify-center px-3"
          activeOpacity={0.7}
          onPress={() => {
            setMenuAbierto(!menuAbierto);
            setFiltrosAbiertos(false);
          }}>
          <View className="max-w-[90px]">
            <Text className="mr-1 font-medium text-xs text-gray-300" numberOfLines={1}>
              {categoriaActual}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={menuAbierto ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#94a3b8"
          />
        </TouchableOpacity>

        {/* Botón de Filtros */}
        <TouchableOpacity
          className={`h-full w-12 items-center justify-center rounded-r-lg border-l border-borderButton ${filtrosAbiertos || isFilterActive ? 'bg-primary/30' : 'bg-transparent'}`}
          onPress={() => {
            setFiltrosAbiertos(!filtrosAbiertos);
            setMenuAbierto(false);
          }}
        >
          <MaterialCommunityIcons 
            name="tune-vertical" 
            size={20} 
            color={filtrosAbiertos || isFilterActive ? '#a855f7' : '#94a3b8'} 
          />
        </TouchableOpacity>
      </View>

      {/* Desplegable de Categorías */}
      {menuAbierto && (
        <View className="absolute right-12 top-14 z-50 w-48 overflow-hidden rounded-lg border border-borderButton bg-surfaceButton shadow-xl">
          {OPCIONES_CATEGORIA.map((opcion, index) => (
            <TouchableOpacity
              key={opcion}
              className={`flex-row items-center justify-between p-3 ${index !== OPCIONES_CATEGORIA.length - 1 ? 'border-b border-borderButton' : ''} ${categoriaActual === opcion ? 'bg-borderButton' : 'active:bg-borderButton/50'}`}
              onPress={() => {
                setCategoriaActual(opcion);
                setMenuAbierto(false);
              }}>
              <Text className={`text-sm ${categoriaActual === opcion ? 'font-bold text-primaryText' : 'text-secondaryText'}`}>
                {opcion}
              </Text>
              {categoriaActual === opcion && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};