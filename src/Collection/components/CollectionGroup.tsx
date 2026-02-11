import { TouchableOpacity, Image, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collectionAdapter } from '../adapters/collectionAdapter';

export const CollectionGroup = ({ item, category, onPress, posterWidth, posterHeight, showStatus, onLongPress }: any) => {
  const title = collectionAdapter.getTitle(item, category);
  const image = collectionAdapter.getImage(item, category);
  const year = item.fechacreacion ? new Date(item.fechacreacion).getFullYear() : '';
  const statusColor = collectionAdapter.getStatusColor(item.estado); 
  const statusText = collectionAdapter.getStatusText(item.estado, category);
  const finalWidth = posterWidth || 125;
  const finalHeight = posterHeight || 190;
  const marginRight = posterWidth ? 0 : 12; 

  return (
    <TouchableOpacity 
      className="flex-col mb-2" 
      style={{ width: finalWidth, marginRight: marginRight, marginBottom: 24 , marginTop: 10}}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      {/* Imagen */}
      <View className="relative w-full rounded-lg overflow-hidden bg-surfaceButton border border-borderButton shadow-sm" style={{ height: finalHeight }}>
        <Image 
          source={{ uri: image }} 
          className="w-full h-full bg-background" 
          resizeMode="cover" 
          style={{ height: finalHeight }}
        />
        

        {/* Año (Arriba Izquierda) */}
        {year ? (
          <View className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded">
            <Text className="text-white text-[10px] font-bold">{year}</Text>
          </View>
        ) : null}

        {/* Rating (Arriba Derecha) */}
        {item.estado !== 'PENDIENTE' ? (
          <View className="absolute top-2 right-2 flex-row items-center bg-black/30 px-1 rounded-sm">
            <MaterialCommunityIcons name="star" size={12} color="#fbbf24" />
            <Text className="text-white text-xs font-bold ml-1">
              {item.calificacion || "0"}
            </Text>
          </View>
        ) : null}

        {/* Estado (Abajo Derecha) - Solo en búsqueda */}
        {showStatus && statusText ? (
          <View className="absolute bottom-2 right-2 px-2 py-1 rounded" style={{ backgroundColor: statusColor + '90' }}>
            <Text className="text-white text-[7px] font-bold">{statusText}</Text>
          </View>
        ) : null}

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