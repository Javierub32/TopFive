import { TouchableOpacity, Image, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collectionAdapter } from '../adapters/collectionAdapter';

export const CollectionItem = ({ item, category, onPress }: any) => {
  const title = collectionAdapter.getTitle(item, category);
  const image = collectionAdapter.getImage(item, category);
  const statusColor = collectionAdapter.getStatusColor(item.estado);
  const statusText = collectionAdapter.getStatusText(item.estado, category);

  return (
    <TouchableOpacity className="mb-3 flex-row overflow-hidden rounded-xl border border-slate-700 bg-slate-800 p-0 shadow-sm active:bg-slate-700" onPress={onPress}>
      <Image source={{ uri: image }} className="h-28 w-20 bg-slate-900" resizeMode="cover" />
      <View className="flex-1 p-3 justify-between">
        <View>
          <View className="flex-row justify-between items-start">
            <Text className="text-white font-bold text-lg flex-1 mr-2" numberOfLines={1}>{title}</Text>
            {item.favorito && <MaterialCommunityIcons name="heart" size={16} color="#ef4444" />}
          </View>
          <Text className="text-gray-400 text-sm">{new Date(item.fechacreacion).toLocaleDateString()}</Text>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center bg-purple-900/40 px-2 py-1 rounded border border-purple-500/20">
            <MaterialCommunityIcons name="star" size={12} color="#fbbf24" />
            <Text className="text-purple-200 text-xs font-bold ml-1">{item.calificacion || 0}</Text>
          </View>
          <View className={`px-2 py-1 rounded ${statusColor}`}>
            <Text className="text-[10px] text-white font-bold uppercase">{statusText}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};