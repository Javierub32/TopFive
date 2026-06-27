import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from 'components/Icons';
import { Song } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { AddToCollectionButton } from '@/Details/components/AddToCollectionButton';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useContent } from '@/Details/hooks/useContent';
import { AdBanner } from 'components/AdBanner';
import { ContentHeader } from '@/Details/components/ContentHeader';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function SongDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'cancion');
  const song: Song = content as Song;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const getPath = () => {
    if (from === 'home') return 'back';
    return '/Add?initialCategory=cancion';
  };
  const path = getPath();

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
          <AppText className="mt-4 font-bold text-primaryText" style={{ fontSize: 18 }}>
            {t('details.loadingError.title')}
          </AppText>
          <AppText className="mt-2 text-center text-secondaryText" style={{ fontSize: 16 }}>
            {t('details.loadingError.albums')}
          </AppText>
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
