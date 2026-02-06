import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Activity } from '../hooks/useActivity';



export default function ActivityItem({ item}: { item: Activity }) {
	const { colors } = useTheme();
  
  const getRelativeTime = (date: string | Date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Ahora mismo';
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return minutes == 1 ? `Hace 1 minuto` : `Hace ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours == 1 ? `Hace 1 hora` : `Hace ${hours} horas`;
    const days = Math.floor(hours / 24);
    if (days < 7) return days == 1 ? `Hace 1 día` : `Hace ${days} días`;
	return then.toLocaleDateString(); // Si es más de una semana, mostrar fecha completa
  };

  return (
    <View className="max-w-xl p-4 rounded-2xl shadow-xl mb-4" style={{ backgroundColor: colors.surfaceButton, borderWidth: 1, borderColor: colors.borderButton }}>
      {/* Header: Usuario e info */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <Image 
            source={{ uri: item.avatar_url || 'https://via.placeholder.com/150' }}
            className="w-10 h-10 rounded-full"
            style={{ borderWidth: 1, borderColor: colors.borderButton }}
          />
          <View className="flex-col">
            <Text className="font-bold text-base" style={{ color: colors.primaryText }}>{item.username}</Text>
            <Text className="text-xs" style={{ color: colors.secondaryText }}>{getRelativeTime(item.fecha_actividad)}</Text>
          </View>
        </View>
        <Pressable>
          <Text className="text-xl" style={{ color: colors.secondaryText }}>...</Text>
        </Pressable>
      </View>

      {/* Contenido Principal */}
      <View className="flex-row gap-4">
        {/* Poster con Badge de Año */}
        <View className="relative flex-shrink-0">
          <Image 
            source={{ uri: item.imagen_url || 'https://via.placeholder.com/150' }}
            className="w-24 h-36 rounded-xl"
            style={{ borderWidth: 1, borderColor: colors.borderButton }}
          />
        </View>

        {/* Detalles del Recurso */}
        <View className="flex-col flex-1">
          <View className="flex-row justify-between items-start">
            <View className='flex-1'>
              <Text className="font-bold text-base leading-tight mr-2" style={{ color: colors.primaryText }}>{item.titulo}</Text>
              <Text className="text-xs mt-1 uppercase tracking-wider" style={{ color: colors.secondaryText }}>{item.tipo_contenido}</Text>
            </View>
            
            {/* Calificación */}
            <View className="flex-row items-center gap-1 bg-black/30 px-2 py-1 rounded-lg">
			  <View className="w-4 h-4 rounded-full items-center justify-center">
				<MaterialCommunityIcons name="star" size={16} color={colors.rating} />
			  </View>
              <Text className="font-bold text-sm" style={{ color: colors.primaryText }}>{item.calificacion}</Text>
            </View>
          </View>

          {/* Reseña */}
          <Text className="mt-3 text-sm leading-relaxed italic" numberOfLines={4} style={{ color: colors.secondaryText }}>
            "{item.comentario || 'Sin reseña'}"
          </Text>
        </View>
      </View>
    </View>
  );
};