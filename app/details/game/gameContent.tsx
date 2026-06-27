import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from 'components/Icons';
import { Game } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { DescriptionCard } from '@/Details/components/DescriptionCard';
import { AddToCollectionButton } from '@/Details/components/AddToCollectionButton';
import { ExtraCard } from '@/Details/components/ExtraCard';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useContent } from '@/Details/hooks/useContent';
import { ContentRating } from '@/Details/components/ContentRating';
import { AdBanner } from 'components/AdBanner';
import { ContentHeader } from '@/Details/components/ContentHeader';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function GameDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'videojuego');
  const game: Game = content as Game;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const getPath = () => {
    if (from === 'home') return 'back';
    return '/Add?initialCategory=videojuego';
  };
  const path = getPath(); 

  if (loading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  if (!game && !loading) {
    return (
      <Screen>
        <ThemedStatusBar />
        <ReturnButton route={path} title="Detalle del videojuego" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <AppText className="mt-4 text-xl font-bold" style={{ color: colors.primaryText }}>
            {t('details.loadingError.title')}
          </AppText>
          <AppText className="mt-2 text-center" style={{ color: colors.secondaryText }}>
            {t('details.loadingError.videogames')}
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
          imageUrl={game.image}
          returnRoute={path}
          content={game}
          type="videojuego"
          autor={game.autor}
        />

        <View className="flex-1 px-4 pb-6">
          <View className="mt-1 flex-col justify-between gap-3">
            <ContentRating content={game} type="libro" />
            <ExtraCard extra={game.gamemodes} type="videojuego" />
            <DescriptionCard description={game.description} />
          </View>
          <AddToCollectionButton content={game} type="videojuego" />
        </View>
        <View className="flex-1">
          <AdBanner />
        </View>
      </ScrollView>
    </Screen>
  );
}
