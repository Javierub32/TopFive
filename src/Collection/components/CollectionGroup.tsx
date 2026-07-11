import { TouchableOpacity, Image, View } from 'react-native';
import { ScalableMaterialCommunityIcons } from 'components/Icons';
import { collectionAdapter } from '../adapters/collectionAdapter';
import { FallbackCover } from 'components/FallbackCover';
import { useTheme } from 'context/ThemeContext';
import { AppText } from 'components/AppText';
import { useFontSize } from 'context/FontSizeContext';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const title = collectionAdapter.getTitle(item, category, t);
  const image = collectionAdapter.getImage(item, category);
  const year = item.fechaFin
    ? new Date(item.fechaFin).getFullYear()
    : item.fechaVisionado
      ? new Date(item.fechaVisionado).getFullYear()
      : item.fechaEscucha
        ? new Date(item.fechaEscucha).getFullYear()
        : '';
  const statusColor = collectionAdapter.getStatusColor(item.estado);
  const statusText = collectionAdapter.getStatusText(item.estado, category, t);
  const { fontSizeMultiplier } = useFontSize();
  const finalWidth = posterWidth || 125 * fontSizeMultiplier;
  const finalHeight = posterHeight || (category === 'cancion' ? 125 : 190) * fontSizeMultiplier;
  const marginRight = posterWidth ? 0 : 12 * fontSizeMultiplier;

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
        style={{
          height: finalHeight,
          backgroundColor: colors.surfaceButton,
        }}>
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
          <View className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5">
            <AppText className="font-bold text-white" style={{ fontSize: 10 }}>
              {year}
            </AppText>
          </View>
        ) : null}

        {/* Rating (Arriba Derecha) */}
        {item.estado !== 'PENDIENTE' && item.calificacion > 0 ? (
          <View className="absolute right-2 top-2 flex-row items-center rounded-sm bg-black/50 px-1">
            <ScalableMaterialCommunityIcons name="star" size={10} color={colors.rating} />
            <AppText className="ml-1  font-bold text-white" style={{ fontSize: 10 }}>
              {item.calificacion || '0'}
            </AppText>
          </View>
        ) : null}

        {item.favorito && (
          <View className="absolute bottom-2 right-2 items-center rounded-sm bg-black/50 px-1">
            <ScalableMaterialCommunityIcons name="heart" size={16} color={colors.error} />
          </View>
        )}

        {/* Estado (Abajo Derecha) - Solo en búsqueda */}
        {showStatus && statusText ? (
          <View
            className="absolute bottom-2 right-2 rounded px-2 py-1"
            style={{ backgroundColor: statusColor + '90' }}>
            <AppText className=" font-bold text-white" style={{ fontSize: 10 }}>
              {statusText}
            </AppText>
          </View>
        ) : null}
      </View>

      {/* Título */}
      <View className="mt-2 pl-1">
        <AppText
          className=" font-semibold leading-4"
          numberOfLines={2}
          style={{ color: colors.primaryText, fontSize: 14 }}>
          {title}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};
