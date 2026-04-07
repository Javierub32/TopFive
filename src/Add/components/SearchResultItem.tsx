import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { SearchResult } from '../../Add/adapters/searchResultsAdapter';
import { useTheme } from 'context/ThemeContext';
import { ResourceType } from 'hooks/useResource';
import { FallbackCover } from 'components/FallbackCover';

interface SearchResultItemProps {
  item: SearchResult;
  onPress: () => void;
  type: ResourceType;
}

export const SearchResultItem = ({ item, onPress, type }: SearchResultItemProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="mb-6 flex-row overflow-hidden "
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Imagen de Portada */}
      {item.cover ? (
        <Image
          source={{ uri: item.cover || 'https://via.placeholder.com/150' }}
          className={`h-${type === 'cancion' ? 24 : 32} mt-3 w-24 items-center rounded-xl`}
          style={{ backgroundColor: colors.surfaceButton }}
          resizeMode="cover"
        />
      ) : (
        <FallbackCover
          type={type}
          fullSize={false}
          style={{
            height: type === 'cancion' ? 96 : 128,
            width: 96,
            marginTop: 12,
            alignItems: 'center',
            borderRadius: 12,
          }}
        />
      )}

      {/* Información del Recurso */}
      <View className="flex-1 justify-center p-3 ">
        <Text
          className="mb-1 text-lg font-bold leading-tight"
          style={{ color: colors.primaryText }}
          numberOfLines={2}>
          {item.title}
        </Text>

        <Text className="mb-2 text-sm" style={{ color: colors.secondaryText }} numberOfLines={1}>
          {item.artist}
        </Text>

        {/* Fecha/Rating */}
        {item.date && item.rating && (
          <Text className="mb-2 text-sm" style={{ color: colors.secondaryText }} numberOfLines={1}>
            {item.date} | <FontAwesome5 name="star" size={16} color={colors.rating} solid={true} />{' '}
            {item.rating}
          </Text>
        )}
        {item.date && !item.rating && (
          <Text className="mb-2 text-sm" style={{ color: colors.secondaryText }} numberOfLines={1}>
            {item.date}
          </Text>
        )}
        {!item.date && item.rating && (
          <Text className="mb-2 text-sm" style={{ color: colors.secondaryText }} numberOfLines={1}>
            <FontAwesome5 name="star" size={16} color={colors.rating} solid={true} /> {item.rating}
          </Text>
        )}

        {/* Badge de Género */}

        {item.genre ? (
          <View className="flex-row">
            <View
              className="mr-2 rounded-lg px-3 py-1.5"
              style={{ backgroundColor: colors.surfaceButton }}>
              <Text className="text-xs font-semibold" style={{ color: colors.markerText }}>
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
