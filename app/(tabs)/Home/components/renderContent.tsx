import { Text } from 'react-native';
import { Image } from 'react-native';
import { View } from 'react-native';


interface MediaItemProps {
  item: { id: string; title: string; image: string; type?: string };
  variant: 'horizontal' | 'vertical';
}

export default function RenderContent({ item, variant }: MediaItemProps) {
  const isVertical = variant === 'vertical';
  const containerWidth = isVertical ? 'w-40' : 'w-72';
  const imageHeight = isVertical ? 'h-60' : 'h-40';

  return (
    <View className={`mr-4 ${containerWidth}`}>
      <View className={`${imageHeight} w-full items-center justify-center overflow-hidden rounded-lg bg-gray-700`}>
        <Image
          source={{ uri: item.image }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>
      <Text className="mt-2 text-white" numberOfLines={isVertical ? 2 : undefined}>
        {item.title} {!isVertical && item.type ? ` (${item.type})` : ''}
      </Text>
    </View>
  );
}

export function RenderSong({ song }: { song: { id: string; title: string; artist: string; image: string } }) {
  return (
    <View
      key={song.id}
      className="mr-4 h-24 w-72 flex-row items-center overflow-hidden rounded-xl bg-gray-800 shadow-sm">
      <View className="h-full w-24 items-center justify-center overflow-hidden bg-gray-700">
        <Image
          source={{ uri: song.image }}
          className="h-full w-full"
          resizeMode="cover"
          onLoad={() => console.log(`Canción cargada: ${song.title}`)}
        />
      </View>
      <View className="flex-1 justify-center p-3">
        <Text className="text-base font-bold text-white" numberOfLines={2}>
          {song.title}
        </Text>
        <Text className="mt-1 text-xs text-gray-400">{song.artist}</Text>
      </View>
    </View>
  );
}
