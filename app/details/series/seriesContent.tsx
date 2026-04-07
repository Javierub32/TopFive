import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Series } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { DescriptionCard } from '@/Details/components/DescriptionCard';
import { AddToCollectionButton } from '@/Details/components/AddToCollectionButton';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { useContent } from '@/Details/hooks/useContent';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ContentHeader } from '@/Details/components/ContentHeader';
import { ContentRating } from '@/Details/components/ContentRating';
import { AdBanner } from 'components/AdBanner';

export default function SeriesDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'serie');
  const series: Series = content as Series;
  const { colors } = useTheme();
  const path = from === 'search' ? '/Add?initialCategory=serie' : '/(tabs)/Home';

  if (loading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  if (!series && !loading) {
    return (
      <Screen>
        <StatusBar style="light" />
        <ReturnButton route={path} title="Detalle de la serie" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} style={{ color: colors.error }} />
          <Text className="mt-4 text-xl font-bold text-primaryText">Error al cargar</Text>
          <Text className="mt-2 text-center text-secondaryText">
            No se pudo cargar la información de la serie
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
          imageUrl={series.imageFull || series.image}
          returnRoute={path}
          content={series}
          type="serie"
          autor={null}
        />

        <View className="flex-1 px-4 pb-6">
          <View className="mt-1 flex-col justify-between gap-3">
            <ContentRating content={series} type="serie" />
            <DescriptionCard description={series.description} />
          </View>
          <AddToCollectionButton content={series} type="serie" />
        </View>
        <View className="flex-1">
          <AdBanner />
        </View>
      </ScrollView>
    </Screen>
  );
}
