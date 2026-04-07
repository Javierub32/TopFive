import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Book } from 'app/types/Content';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { DescriptionCard } from '@/Details/components/DescriptionCard';
import { AddToCollectionButton } from '@/Details/components/AddToCollectionButton';
import { useContent } from '@/Details/hooks/useContent';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ContentHeader } from '@/Details/components/ContentHeader';
import { AdBanner } from 'components/AdBanner';

export default function BookDetail() {
  const { id, from } = useLocalSearchParams();
  const { content, loading } = useContent(id as string | number, 'libro');
  const book: Book = content as Book;
  const { colors } = useTheme();
  const path = from === 'search' ? '/Add?initialCategory=libro' : '/(tabs)/Home';

  if (loading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  if (!content && !loading) {
    return (
      <Screen>
        <ThemedStatusBar />
        <ReturnButton route={path} title="Detalle del libro" />
        <View className="flex-1 items-center justify-center px-4">
          <MaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <Text className="mt-4 text-xl font-bold" style={{ color: colors.primaryText }}>
            Error al cargar
          </Text>
          <Text className="mt-2 text-center" style={{ color: colors.secondaryText }}>
            No se pudo cargar la información del libro
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
          imageUrl={book.imageFull || book.image}
          returnRoute={path}
          content={book}
          type="libro"
          autor={book.autor}
        />

        <View className="flex-1 px-4 pb-6">
          <View className="mt-1 flex-col justify-between gap-3">
            <DescriptionCard description={book.description} />
          </View>
          <AddToCollectionButton content={book} type="libro" />
        </View>
        <View className="flex-1">
          <AdBanner />
        </View>
      </ScrollView>
    </Screen>
  );
}
