import { TouchableOpacity, Image, View, Text } from 'react-native';
import { MaterialCommunityIcons } from 'components/Icons';
import { collectionAdapter } from '../adapters/collectionAdapter';
import {AppText} from 'components/AppText';
export const CollectionItem = ({ item, category, onPress }: any) => {
  const title = collectionAdapter.getTitle(item, category);
  const image = collectionAdapter.getImage(item, category);
  const statusColor = collectionAdapter.getStatusColor(item.estado);
  const statusText = collectionAdapter.getStatusText(item.estado, category);

  return (
    <TouchableOpacity className="mb-3 flex-row overflow-hidden rounded-xl border border-borderButton bg-surfaceButton p-0 shadow-sm active:bg-borderButton" onPress={onPress}>
      <Image source={{ uri: image }} className="h-28 w-20 bg-background" resizeMode="cover" />
      <View className="flex-1 p-3 justify-between">
        <View>
          <View className="flex-row justify-between items-start">
            <AppText className="text-primaryText font-bold text-lg flex-1 mr-2" numberOfLines={1}>{title}</AppText>
            {item.favorito && <MaterialCommunityIcons name="heart" size={16} color="#ef4444" />}
          </View>
          <AppText className="text-secondaryText text-sm">{new Date(item.fechacreacion).toLocaleDateString()}</AppText>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center bg-marker px-2 py-1 rounded border border-primary/20">
            <MaterialCommunityIcons name="star" size={12} color="#fbbf24" />
            <AppText className="text-markerText text-xs font-bold ml-1">{item.calificacion || 0}</AppText>
          </View>
          <View className={`px-2 py-1 rounded ${statusColor}`}>
            <AppText className="text-[10px] text-primaryText font-bold uppercase">{statusText}</AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};