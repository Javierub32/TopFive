import DiaryEntity from '@/Diary/entity/diaryEntity';
import { useDiary } from '@/Diary/hooks/useDiary';
import { AppText } from 'components/AppText';
import {
  FontAwesome5,
  ScalableFavoriteIcon,
  ScalableMaterialCommunityIcons,
} from 'components/Icons';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useTheme } from 'context/ThemeContext';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';

export const DiaryPreview = ({ userId }: { userId: string }) => {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { items, loading, openReview } = useDiary(userId);
  const recentItems = items.slice(0, 5);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View className="mt-3">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/diary', params: { userId } })}>
        <View className="mb-3 flex-row items-center px-0">
          <AppText className="font-bold" style={{ color: colors.primaryText, fontSize: 18 }}>
            {t('diary.profileTitle')}
          </AppText>

          <View className="ml-0.5" style={{ transform: [{ translateY: 1.5 }] }}>
            <ScalableMaterialCommunityIcons
              name="chevron-right"
              size={17}
              color={colors.secondaryText}
            />
          </View>
        </View>
      </TouchableOpacity>

      {recentItems.length === 0 ? (
        <View className="items-center justify-center py-6">
          <AppText style={{ color: colors.placeholderText, fontSize: 14 }}>
            {t('diary.empty')}
          </AppText>
        </View>
      ) : (
        recentItems.map((item, index) => (
          <TouchableOpacity
            key={`${item.recurso_id}-${index}`}
            onPress={() => openReview(item)}
            activeOpacity={0.8}>
            {renderItem({
              item,
              colors,
              t,
              locale: i18n.resolvedLanguage ?? 'es',
            })}
          </TouchableOpacity>
        ))
      )}

      {recentItems.length > 0 && (
        <TouchableOpacity
          className="self-center px-14 pb-8 pt-0"
          activeOpacity={0.7}
          onPress={() => router.push({ pathname: '/diary', params: { userId } })}>
          <AppText className="font-bold" style={{ color: colors.placeholderText, fontSize: 30 }}>
            . . .
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const renderItem = ({
  item,
  colors,
  t,
  locale,
}: {
  item: DiaryEntity;
  colors: any;
  t: any;
  locale: string;
}) => {
  const date = item.fecha_fin
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(`${item.fecha_fin}T00:00:00`)
      )
    : null;
  const posterUrl = item.imagen_url;
  const rating = Number(item.calificacion ?? 0);
  const titulo = item.titulo.slice(0, 70) + (item.titulo.length > 70 ? ' ...' : '');
  const hasReview = item.comentario !== null && item.comentario !== '';

  return (
    <View
      className="mb-3 flex-row p-3.5 rounded-2xl shadow-sm"
      style={{
        backgroundColor: colors.surfaceButton || '#1e293b',
        borderWidth: 0,
        borderColor: `${colors.borderButton || colors.primary}33`,
      }}>
      {/* Póster */}
      <View
        className="mr-3.5 overflow-hidden rounded-xl"
        style={{
          width: 58,
          aspectRatio: 2 / 3,
          backgroundColor: colors.background,
        }}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <View className="h-full w-full items-center justify-center p-1">
            <AppText
              className="text-center"
              style={{ color: colors.placeholderText, fontSize: 10 }}>
              {t('diary.noImage')}
            </AppText>
          </View>
        )}
      </View>

      {/* Información */}
      <View className="flex-1 justify-center">
        <AppText
          className="font-bold leading-tight"
          style={{ color: colors.primaryText, fontSize: 15 }}
          numberOfLines={2}>
          {titulo}
        </AppText>

        {date && (
          <AppText className="mt-1" style={{ color: colors.secondaryText, fontSize: 11 }}>
            {date}
          </AppText>
        )}

        <View className="mt-2 flex-row flex-wrap items-center">
          <View className="flex-row gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome5
                key={star}
                name={rating === star - 0.5 ? 'star-half-alt' : 'star'}
                size={13}
                color={rating >= star - 0.5 ? colors.rating : colors.placeholderText}
                solid={rating >= star - 0.5}
              />
            ))}
          </View>

          {hasReview && (
            <View className="ml-3 items-center justify-center">
              <ScalableMaterialCommunityIcons
                name="card-text-outline"
                size={16}
                color={colors.secondaryText}
              />
            </View>
          )}

          {item.favorito && (
            <View className="ml-2.5 items-center justify-center">
              <ScalableFavoriteIcon size={17} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};