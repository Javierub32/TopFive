import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryKey } from '../hooks/useSearchContent';
import { COLORS } from 'constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  selectedCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
  menuAbierto: boolean;
  setMenuAbierto: (abierto: boolean) => void;
}

const OPCIONES: CategoryKey[] = ['Libros', 'Películas', 'Series', 'Videojuegos', 'Canciones'];

export const SearchBar = ({
  value,
  onChangeText,
  onSearch,
  selectedCategory,
  onCategoryChange,
  menuAbierto,
  setMenuAbierto,
}: SearchBarProps) => {
  return (
    <View className="relative z-50">
      <View className="h-12 flex-row items-center rounded-lg border border-borderButton bg-surfaceButton shadow-lg">
        {/* Icono Lupa */}
        <View className="justify-center pl-3">
          <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" />
        </View>

        {/* Input de texto */}
        <TextInput
          className="h-full flex-1 px-3 text-base text-primaryText"
          placeholder={`Buscar ${selectedCategory}...`}
          placeholderTextColor={COLORS.placeholderText}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />

        {/* Separador vertical */}
        <View className="h-6 w-[1px] bg-borderButton" />

        {/* Botón Selector de Categoría */}
        <TouchableOpacity
          className="h-full flex-row items-center justify-center px-4"
          activeOpacity={0.7}
          onPress={() => setMenuAbierto(!menuAbierto)}
        >
          <View className="max-w-[80px]">
            <Text className="mr-1 font-medium text-secondaryText" numberOfLines={1}>
              {selectedCategory}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={menuAbierto ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#94a3b8"
          />
        </TouchableOpacity>
      </View>

      {/* Menú Desplegable */}
      {menuAbierto && (
        <View className="absolute right-0 top-14 z-50 w-48 overflow-hidden rounded-lg border border-borderButton bg-surfaceButton shadow-xl">
          {OPCIONES.map((opcion, index) => (
            <TouchableOpacity
              key={opcion}
              className={`flex-row items-center justify-between p-3 
                ${index !== OPCIONES.length - 1 ? 'border-b border-borderButton' : ''} 
                ${selectedCategory === opcion ? 'bg-borderButton' : 'active:bg-borderButton/50'}`}
              onPress={() => onCategoryChange(opcion)}
            >
              <Text className={`text-base ${selectedCategory === opcion ? 'font-bold text-primaryText' : 'text-secondaryText'}`}>
                {opcion}
              </Text>
              {selectedCategory === opcion && (
                <MaterialCommunityIcons name="check" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};