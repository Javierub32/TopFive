import { Text } from 'react-native';
import { Image } from 'react-native';
import { View } from 'react-native';
import {AppText} from 'components/AppText';

interface MediaItemProps {
  item: { id: string; title: string; image: string; type?: string };
  variant: 'horizontal' | 'vertical';
}

export function RenderContent({ item, variant }: MediaItemProps) {
  const isVertical = variant === 'vertical';
  const containerWidth = isVertical ? 'w-40' : 'w-72';
  const imageHeight = isVertical ? 'h-60' : 'h-40';

  return (
    <View className={`mr-4 ${containerWidth}`}>
      <View className={`${imageHeight} w-full items-center justify-center overflow-hidden rounded-lg bg-borderButton`}>
        <Image
          source={{ uri: item.image }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>
      <AppText className="mt-2 text-primaryText" style={{ fontSize: 18 }}numberOfLines={isVertical ? 2 : undefined}>
        {item.title} {!isVertical && item.type ? ` (${item.type})` : ''}
      </AppText>
    </View>
  );
}

export function RenderSong({ song }: { song: { id: string; title: string; artist: string; image: string } }) {
  return (
    <View
      key={song.id}
      className="mr-4 h-24 w-72 flex-row items-center overflow-hidden rounded-xl bg-surfaceButton shadow-sm">
      <View className="h-full w-24 items-center justify-center overflow-hidden bg-borderButton">
        <Image
          source={{ uri: song.image }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>
      <View className="flex-1 justify-center p-3">
        <AppText className="text-base font-bold text-primaryText" style={{ fontSize: 18 }} numberOfLines={2}>
          {song.title}
        </AppText>
        <AppText className="mt-1 text-xs text-secondaryText" style={{ fontSize: 12 }}>
          {song.artist}
        </AppText>
      </View>
    </View>
  );
}
