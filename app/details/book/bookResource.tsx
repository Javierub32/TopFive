import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { ScalableMaterialCommunityIcons } from 'components/Icons';
import { BookResource } from 'app/types/Resources';
import { ReturnButton } from 'components/ReturnButton';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { RatingCard } from '@/Details/components/RatingCard';
import { ProgressCard } from '@/Details/components/ProgressCard';
import { ReviewCard } from '@/Details/components/ReviewCard';
import { DateCard } from '@/Details/components/DateCard';
import { TimeCard } from '@/Details/components/TimeCard';
import { useAuth } from 'context/AuthContext';
import { AdBanner } from 'components/AdBanner';
import { ResourceHeader } from '@/Details/components/ResourceHeader';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';

export default function BookDetail() {
  const { item, from } = useLocalSearchParams();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();

  const getPath = () => {
    if (from === 'profile') return '/(tabs)/Profile';
    if (from === 'user' || from === 'list' || from === 'group' || from === 'home') return 'back';
    return '/(tabs)/Collection';
  };
  const path = getPath();

  let bookResource: BookResource | null = null;

  try {
    bookResource = item ? JSON.parse(item as string) : null;
  } catch (error) {
    console.error('Error parsing item:', error);
  }

  const isOwner = bookResource?.usuarioId === user?.id;

  const isPending = bookResource?.estado === 'PENDIENTE';
  const isCompleted = bookResource?.estado === 'COMPLETADO';

  if (!bookResource) {
    return (
      <Screen>
        <ThemedStatusBar />
        <ReturnButton route={path} title={t('forms.book.bookDetails')} />
        <View className="flex-1 items-center justify-center px-4">
          <ScalableMaterialCommunityIcons name="alert-circle" size={64} color={colors.error} />
          <AppText className="mt-4 font-bold" style={{ color: colors.primaryText, fontSize: 18 }}>
            {t('details.loadingError.title')}
          </AppText>
          <AppText
            className="mt-2 text-center"
            style={{ color: colors.secondaryText, fontSize: 16 }}>
            {t('details.loadingError.books')}
          </AppText>
        </View>
      </Screen>
    );
  }

  const { contenido } = bookResource;

  return (
    <Screen>
      <ThemedStatusBar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ResourceHeader
          imageUrl={contenido.imagenUrl}
          resource={bookResource}
          type="libro"
          returnRoute={path}
          from={from}
          isOwner={isOwner}
        />
        <View className="flex-1 px-4 pb-6">
          {!isPending && (
            <View className="flex-col justify-between gap-3">
              <View className="flex-row gap-2">
                {bookResource?.calificacion > 0 && (
                  <RatingCard rating={bookResource.calificacion} />
                )}
                {!isCompleted && (
                  <ProgressCard
                    progress={bookResource.paginasLeidas}
                    unit={t('details.progressUnits.books')}
                  />
                )}
              </View>
              <ReviewCard review={bookResource.reseña} />
              <DateCard
                startDate={bookResource.fechaInicio}
                endDate={bookResource.fechaFin}
                isRange={true}
              />
            </View>
          )}

          <TimeCard resource={bookResource} />
        </View>
        {!isPending && (
          <View className="flex-1">
            <AdBanner />
          </View>
        )}
      </ScrollView>
      {isPending && <AdBanner />}
    </Screen>
  );
}
