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

export const DiaryPreview = ({ userId }: { userId: string } ) => {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { items, loading, openReview } = useDiary(userId);
  const recentItems = items.slice(0, 5);

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View className="mt-3">
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push({ pathname: '/diary', params: { userId } })} >
        <View className="mb-1 flex-row items-center px-0">
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
              isLast: index === recentItems.length, // If you want to delete last border, add "- 1"
            })}
          </TouchableOpacity>
        ))
      )}
      {recentItems.length > 0 && (
        <TouchableOpacity
          style={{}}
          className="self-center border-red-50 px-14  pb-8 "
          activeOpacity={0.7}
          onPress={() => router.push({ pathname: '/diary', params: { userId } })}>
          <AppText className="font-bold " style={{ color: colors.placeholderText, fontSize: 30 }}>
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
  isLast,
}: {
  item: DiaryEntity;
  colors: any;
  t: any;
  locale: string;
  isLast: boolean;
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
      className="flex-row border-b px-4 py-5"
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.placeholderText,
      }}>
      {/* Póster */}
      <View
        className="mr-5 overflow-hidden border"
        style={{ width: 55, aspectRatio: 2 / 3, borderColor: colors.surfaceButton }}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <AppText
              className="text-center"
              style={{ color: colors.placeholderText, fontSize: 12 }}>
              {t('diary.noImage')}
            </AppText>
          </View>
        )}
      </View>

      {/* Información */}
      <View className="flex-1 justify-center">
        <AppText
          className="font-light"
          style={{ color: colors.primaryText, fontSize: 16 }}
          numberOfLines={2}>
          {titulo}{' '}
        </AppText>

        {date && (
          <AppText className="mt-1" style={{ color: colors.secondaryText, fontSize: 10 }}>
            {date}
          </AppText>
        )}

        <View className="mt-2 flex-row flex-wrap items-center">
          <View className="flex-row gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome5
                key={star}
                name={rating === star - 0.5 ? 'star-half-alt' : 'star'}
                size={16}
                color={rating >= star - 0.5 ? colors.rating : colors.placeholderText}
                solid={rating >= star - 0.5}
              />
            ))}
          </View>

          {hasReview && (
            <View className="ml-3 items-center justify-center rounded-full p-1">
              <ScalableMaterialCommunityIcons
                name="card-text-outline"
                size={18}
                color={colors.secondaryText}
              />
            </View>
          )}

          {item.favorito && (
            <View className="ml-3 items-center justify-center rounded-full p-1" style={{}}>
              <ScalableFavoriteIcon size={20} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
