//

import { TouchableOpacity, Image, View } from 'react-native';
import { ScalableMaterialCommunityIcons } from 'components/Icons';
import { collectionAdapter } from '../adapters/collectionAdapter';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'context/ThemeContext';
export const CollectionItem = ({ item, category, onPress }: any) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const title = collectionAdapter.getTitle(item, category, t);
  const image = collectionAdapter.getImage(item, category);
  const statusColor = collectionAdapter.getStatusColor(item.estado);
  const statusText = collectionAdapter.getStatusText(item.estado, category, t);

  return (
    <TouchableOpacity
      className="mb-3 flex-row overflow-hidden rounded-xl border border-borderButton bg-surfaceButton p-0 shadow-sm active:bg-borderButton"
      onPress={onPress}>
      <Image source={{ uri: image }} className="h-28 w-20 bg-background" resizeMode="cover" />
      <View className="flex-1 justify-between p-3">
        <View>
          <View className="flex-row items-start justify-between">
            <AppText className="mr-2 flex-1 font-bold text-primaryText" style={{ fontSize: 14 }} numberOfLines={1}>
              {title}
            </AppText>
            {item.favorito && (
              <ScalableMaterialCommunityIcons name="heart" size={16} color={colors.error} />
            )}
          </View>
          <AppText className="text-sm text-secondaryText" style={{ fontSize: 14 }}>
            {new Date(item.fechacreacion).toLocaleDateString()}
          </AppText>
        </View>
        <View className="mt-2 flex-row items-center justify-between">
          <View className="border-primary/20 flex-row items-center rounded border bg-marker px-2 py-1">
            <ScalableMaterialCommunityIcons name="star" size={12} color="#fbbf24" />
            <AppText className="ml-1 font-bold text-markerText" style={{ fontSize: 12 }}>
              {item.calificacion || 0}
            </AppText>
          </View>
          <View className={`rounded px-2 py-1 ${statusColor}`}>
            <AppText className="font-bold uppercase text-primaryText" style={{ fontSize: 12 }}>
              {statusText}
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
