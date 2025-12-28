import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SearchResult } from '../adapters/searchResultsAdapter';

interface SearchResultItemProps {
  item: SearchResult;
  onPress: () => void;
}

export const SearchResultItem = ({ item, onPress }: SearchResultItemProps) => {
  return (
    <TouchableOpacity
      className="mb-3 flex-row overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-sm active:bg-slate-700"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Imagen de Portada */}
      <Image
        source={{ uri: item.cover || 'https://via.placeholder.com/150' }}
        className="h-36 w-24 bg-slate-900"
        resizeMode="cover"
      />

      {/* Información del Recurso */}
      <View className="flex-1 justify-center p-3">
        <Text className="mb-1 text-lg font-bold leading-tight text-white" numberOfLines={2}>
          {item.title}
        </Text>

        {/* Artista / Autor / Rating */}
        <Text className="mb-2 text-sm text-gray-400" numberOfLines={1}>
          {item.artist}
        </Text>

        {/* Badge de Género */}
        <View className="flex-row">
          <View className="rounded border border-purple-500/30 bg-purple-900/60 px-2 py-1">
            <Text className="text-xs font-bold uppercase tracking-wider text-purple-300">
              {item.genre}
            </Text>
          </View>
        </View>
      </View>

      {/* Icono de flecha lateral */}
      <View className="justify-center pr-3 opacity-50">
        <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};