import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collectionAdapter } from '../adapters/collectionAdapter';

export const CollectionGroup = ({ item, category, onPress }: any) => {
  const title = collectionAdapter.getTitle(item, category);
  const image = collectionAdapter.getImage(item, category);
  const year = item.fechacreacion ? new Date(item.fechacreacion).getFullYear() : '';
  const statusColor = collectionAdapter.getStatusColor(item.estado); 
  const statusText = collectionAdapter.getStatusText(item.estado, category);

  return (
    <TouchableOpacity 
      className="flex-col mb-2" 
      style={{ width: 130, marginRight: 12 }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Imagen */}
      <View className="relative w-full h-[190px] rounded-lg overflow-hidden bg-surfaceButton border border-borderButton shadow-sm">
        <Image 
          source={{ uri: image }} 
          className="w-full h-full bg-background" 
          resizeMode="cover" 
        />
        

        {/* Año (Arriba Izquierda) */}
        {year ? (
          <View className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded">
            <Text className="text-white text-[10px] font-bold">{year}</Text>
          </View>
        ) : null}

        {/* Rating (Arriba Derecha - Estrella siempre) */}
        <View className="absolute top-2 right-2 flex-row items-center bg-black/30 px-1 rounded-sm">
            <MaterialCommunityIcons name="star" size={12} color="#fbbf24" />
            <Text className="text-white text-xs font-bold ml-1">
                {item.calificacion || "0"}
            </Text>
        </View>

      </View>

      {/* Título */}
      <View className="mt-2 pl-1">
        <Text className="text-primaryText text-sm font-semibold leading-4" numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};