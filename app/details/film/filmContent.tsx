import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Film } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { DescriptionCard } from '@/Details/components/DescriptionCard';
import { AddToCollectionButton } from '@/Details/components/AddToCollectionButton';
import { useContent } from '@/Details/hooks/useContent';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ContentRating } from '@/Details/components/ContentRating';
import { AdBanner } from 'components/AdBanner';
import { ContentHeader } from '@/Details/components/ContentHeader';

export default function FilmDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'pelicula');
  const film: Film = content as Film;
  const { colors } = useTheme();
  const path = from === 'search' ? '/Add?initialCategory=pelicula' : '/(tabs)/Home';

  if (loading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  if (!film && !loading) {
    return (
      <Screen>
        <ThemedStatusBar />
        <ReturnButton route={path} title="Detalle de la película" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold" style={{ color: colors.primaryText }}>
            Error al cargar
          </Text>
          <Text className="mt-2 text-center" style={{ color: colors.secondaryText }}>
            No se pudo cargar la información de la película
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
          imageUrl={film.image}
          returnRoute={path}
          content={film}
          type="pelicula"
          autor={null}
        />

        <View className="flex-1 px-4 pb-6">
          <View className="mt-1 flex-col justify-between gap-3">
            <ContentRating content={film} type="pelicula" />
            <DescriptionCard description={film.description} />
          </View>
          <AddToCollectionButton content={film} type="pelicula" />
        </View>
        <View className="flex-1">
          <AdBanner />
        </View>
      </ScrollView>
    </Screen>
  );
}
