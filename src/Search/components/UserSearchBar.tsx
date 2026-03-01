import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';    
import { useTheme } from 'context/ThemeContext';

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

  const { colors } = useTheme();

  return (
    <View className="relative z-50">
      <View className="h-12 flex-row items-center rounded-lg border shadow-lg" style={{ borderColor: colors.borderButton, backgroundColor: colors.surfaceButton }} >
        {/* Icono Lupa */}
        <View className="justify-center pl-3">
          <MaterialCommunityIcons name="magnify" size={20} color={colors.secondaryText} />
        </View>

        {/* Input de texto */}
        <TextInput
          className="h-full flex-1 px-3 text-base"
          style={{ color: colors.primaryText }}
          placeholder={`Busca un usuario...`}
          placeholderTextColor={colors.placeholderText}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}
