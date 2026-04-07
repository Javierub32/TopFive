import { TouchableOpacity, Image, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collectionAdapter } from '../adapters/collectionAdapter';
import { FallbackCover } from 'components/FallbackCover';
import { useTheme } from 'context/ThemeContext';

export const CollectionGroup = ({
  item,
  category,
  onPress,
  posterWidth,
  posterHeight,
  showStatus,
  onLongPress,
}: any) => {
  const { colors } = useTheme();
  const title = collectionAdapter.getTitle(item, category);
  const image = collectionAdapter.getImage(item, category);
  const year = item.fechaFin
    ? new Date(item.fechaFin).getFullYear()
    : item.fechaVisionado
      ? new Date(item.fechaVisionado).getFullYear()
      : item.fechaEscucha
        ? new Date(item.fechaEscucha).getFullYear()
        : '';
  const statusColor = collectionAdapter.getStatusColor(item.estado);
  const statusText = collectionAdapter.getStatusText(item.estado, category);
  const finalWidth = posterWidth || 125;
  const finalHeight = posterHeight || (category === 'cancion' ? 125 : 190);
  const marginRight = posterWidth ? 0 : 12;

  return (
    <TouchableOpacity
      className="mb-2 flex-col"
      style={{ width: finalWidth, marginRight: marginRight, marginBottom: 24, marginTop: 10 }}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}>
      {/* Imagen */}
      <View
        className="relative w-full overflow-hidden rounded-lg bg-surfaceButton shadow-sm"
        style={{ height: finalHeight, backgroundColor: colors.surfaceButton }}>
        {image ? (
          <Image
            source={{ uri: image }}
            className="h-full w-full bg-background"
            resizeMode="cover"
            style={{ height: finalHeight }}
          />
        ) : (
          <FallbackCover
            type={category}
            fullSize={false}
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          />
        )}

        {/* Año de Completado (Arriba Izquierda) */}
        {year ? (
          <View className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5">
            <Text className="text-[10px] font-bold text-white">{year}</Text>
          </View>
        ) : null}

        {/* Rating (Arriba Derecha) */}
        {item.estado !== 'PENDIENTE' && item.calificacion > 0 ? (
          <View className="absolute right-2 top-2 flex-row items-center rounded-sm bg-black/30 px-1">
            <MaterialCommunityIcons name="star" size={12} color="#fbbf24" />
            <Text className="ml-1 text-xs font-bold text-white">{item.calificacion || '0'}</Text>
          </View>
        ) : null}

        {/* Estado (Abajo Derecha) - Solo en búsqueda */}
        {showStatus && statusText ? (
          <View
            className="absolute bottom-2 right-2 rounded px-2 py-1"
            style={{ backgroundColor: statusColor + '90' }}>
            <Text className="text-[7px] font-bold text-white">{statusText}</Text>
          </View>
        ) : null}
      </View>

      {/* Título */}
      <View className="mt-2 pl-1">
        <Text className="text-sm font-semibold leading-4 text-primaryText" numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
