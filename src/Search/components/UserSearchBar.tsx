import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';    
import { useTheme } from 'context/ThemeContext';
import { SearchIcon } from 'components/Icons';

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
      <View className="h-12 flex-row items-center rounded-lg border shadow-lg" style={{ borderColor: colors.accent, backgroundColor: colors.surfaceButton }} >
        {/* Icono Lupa */}
        {<TouchableOpacity 
          className="justify-center pl-3 py-2"
          onPress={onSearch}
          activeOpacity={0.7}
          hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}
        >
          <SearchIcon color={colors.secondaryText}/>
        </TouchableOpacity>}

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
