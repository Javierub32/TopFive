import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryType } from '../hooks/useCollection';

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
      <View className="h-12 flex-row items-center rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
        {/* Icono Lupa */}
        <View className="justify-center pl-3">
          <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" />
        </View>

        {/* Input */}
        <TextInput
          className="h-full flex-1 px-3 text-base text-white"
          placeholder={`Buscar en ${categoriaActual}...`}
          placeholderTextColor="#64748b"
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <View className="h-6 w-[1px] bg-slate-600" />

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
          className={`h-full w-12 items-center justify-center rounded-r-lg border-l border-slate-600 ${filtrosAbiertos || isFilterActive ? 'bg-purple-900/30' : 'bg-transparent'}`}
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
        <View className="absolute right-12 top-14 z-50 w-48 overflow-hidden rounded-lg border border-slate-600 bg-slate-800 shadow-xl">
          {OPCIONES_CATEGORIA.map((opcion, index) => (
            <TouchableOpacity
              key={opcion}
              className={`flex-row items-center justify-between p-3 ${index !== OPCIONES_CATEGORIA.length - 1 ? 'border-b border-slate-700' : ''} ${categoriaActual === opcion ? 'bg-slate-700' : 'active:bg-slate-700/50'}`}
              onPress={() => {
                setCategoriaActual(opcion);
                setMenuAbierto(false);
              }}>
              <Text className={`text-sm ${categoriaActual === opcion ? 'font-bold text-white' : 'text-gray-400'}`}>
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