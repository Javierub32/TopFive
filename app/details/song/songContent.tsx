import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Song } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { AddToCollectionButton } from '@/Details/components/AddToCollectionButton';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useContent } from '@/Details/hooks/useContent';
import { AdBanner } from 'components/AdBanner';
import { ContentHeader } from '@/Details/components/ContentHeader';

export default function SongDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'cancion');
  const song: Song = content as Song;
  const { colors } = useTheme();
  const path = from === 'search' ? '/Add?initialCategory=cancion' : '/(tabs)/Home';

  if (loading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  if (!song && !loading) {
    return (
      <Screen>
        <StatusBar style="light" />
        <ReturnButton route={path} title="Detalle de la canción" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold text-primaryText">Error al cargar</Text>
          <Text className="mt-2 text-center text-secondaryText">
            No se pudo cargar la información de la canción
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedStatusBar />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ContentHeader
          imageUrl={song.imageFull || song.image}
          returnRoute={path}
          content={song}
          type="cancion"
          autor={song.autor}
        />
        <View className="mt-1 flex-1 gap-3 px-4 pb-6">
          <AddToCollectionButton content={song} type="cancion" />
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0">
        <AdBanner />
      </View>
    </Screen>
  );
}
