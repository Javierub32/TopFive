import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SearchResult } from '../../Add/adapters/searchResultsAdapter';
import { useTheme } from 'context/ThemeContext';

interface SearchResultItemProps {
  item: SearchResult;
  onPress: () => void;
}

export const SearchResultItem = ({ item, onPress }: SearchResultItemProps) => {

  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      className="mb-6 flex-row overflow-hidden "
      onPress={onPress}
      activeOpacity={0.7}
      
    >
      {/* Imagen de Portada */}
      <Image
        source={{ uri: item.cover || 'https://via.placeholder.com/150' }}
        className="h-36 w-24 bg-background rounded-xl"
        resizeMode="cover"
      />

      {/* Información del Recurso */}
      <View className="flex-1 justify-center p-3 ">
        <Text className="mb-1 text-lg font-bold leading-tight" style={{color: colors.primaryText}} numberOfLines={2}>
          {item.title}
        </Text>

        <Text className="mb-2 text-sm" style={{color: colors.secondaryText}} numberOfLines={1}>
          {item.artist}
        </Text>

        {/* Fecha/Rating */}
        {!item.date || !item.rating ? (
          <Text className="mb-2 text-sm" style={{color: colors.secondaryText}} numberOfLines={1}>
            {item.date}  {item.rating}
          </Text>
        ):(
          <Text className="mb-2 text-sm" style={{color: colors.secondaryText}} numberOfLines={1}>
          {item.date} | {item.rating}
        </Text>
        )}
        
        {/* Badge de Género */}
       
            {item.genre ? (
               <View className="flex-row">
                <View className="mr-2 rounded-lg px-3 py-1.5" style={{ backgroundColor: colors.surfaceButton }}>
                  <Text className="font-semibold text-xs" style={{ color: colors.markerText }}>
                    {item.genre}
                  </Text>
                </View>
              </View>
            ) : null}
      </View>

      {/* Icono de flecha lateral */}
      <View className="justify-center pr-3 opacity-50">
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.secondaryText} />
      </View>
    </TouchableOpacity>
  );
};