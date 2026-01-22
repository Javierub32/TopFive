import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from 'constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
}

export function UserSearchBar({
  value,
  onChangeText,
  onSearch,
}: SearchBarProps) {
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
          placeholder={`Busca un usuario...`}
          placeholderTextColor={COLORS.placeholderText}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />

        {/* Separador vertical */}
        <View className="h-6 w-[1px] bg-borderButton" />
      </View>
    </View>
  );
}
