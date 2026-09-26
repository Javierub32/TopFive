import DiaryEntity from '@/Diary/entity/diaryEntity';
import { useDiary } from '@/Diary/hooks/useDiary';
import { AppText } from 'components/AppText';
import {
  FontAwesome5,
  ScalableFavoriteIcon,
  ScalableMaterialCommunityIcons,
} from 'components/Icons';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ReturnButton } from 'components/ReturnButton';
import { Screen } from 'components/Screen';
import { useAuth } from 'context/AuthContext';
import { useTheme } from 'context/ThemeContext';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SectionList, TouchableOpacity, View } from 'react-native';

export default function DiaryScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { userId } = useLocalSearchParams<{ userId?: string }>();

  const { items, loadMore, loading, loadingMore, refresh, openReview, refreshing } = useDiary(
    userId || user?.id
  );
  const locale = i18n.resolvedLanguage ?? 'es';

  const sections = useMemo(() => {
    const groups = new Map<string, { title: string; data: DiaryEntity[] }>();

    items.forEach((item) => {
      const [year, month] = item.fecha_fin!.split('-').map(Number);
      const date = new Date(year, month - 1, 1);

      const key = `${year}-${String(month)}`;

      const title = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
        date
      );

      if (!groups.has(key)) {
        groups.set(key, { title, data: [] });
      }

      groups.get(key)!.data.push(item);
    });

    return Array.from(groups.values());
  }, [items, locale]);

  if (loading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ReturnButton route="back" title={`${t('diary.title')}`} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.recurso_id.toString() + item.fecha_fin}
        renderSectionHeader={({ section }) => renderHeader({ section, colors })}
        renderItem={({ item, index, section }) => (
          <TouchableOpacity onPress={() => openReview(item)} activeOpacity={0.8}>
            {renderItem({ item, colors, t, locale, isLast: index === section.data.length - 1 })}
          </TouchableOpacity>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <LoadingIndicator /> : <View className="h-20" />}
        refreshing={refreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <AppText style={{ color: colors.placeholderText, fontSize: 14 }}>
              {t('diary.empty')}
            </AppText>
          </View>
        }
        style={{ flex: 1, marginTop: 5 }}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const renderHeader = ({ section, colors }: { section: { title: string }; colors: any }) => {
  return (
    <View
      className="px-5 py-3"
      style={{
        backgroundColor: colors.surfaceButton,
        borderTopWidth: 1,
        borderTopColor: colors.borderButton,
      }}>
      <AppText
        className="tracking-widest"
        style={{ color: colors.primaryText, fontSize: 16 }}>
        {section.title.toLocaleUpperCase()}
      </AppText>
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
  const posterUrl = item.imagen_url;
  const rating = Number(item.calificacion ?? 0);
  const title = item.titulo.slice(0, 70) + (item.titulo.length > 70 ? ' ...' : '');
  const hasReview = item.comentario !== null && item.comentario !== '';
  const date = item.fecha_fin
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(`${item.fecha_fin}T00:00:00`)
      )
    : null;

  return (
    <View
      className="mx-4 flex-row px-1 py-4"
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.placeholderText,
      }}>
      <View className="mr-4 overflow-hidden rounded-sm" style={{ width: 55, aspectRatio: 2 / 3 }}>
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

      <View className="flex-1 justify-center">
        <AppText
          className="font-light"
          style={{ color: colors.primaryText, fontSize: 16 }}
          numberOfLines={2}>
          {title}
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
            <View className="ml-3 items-center justify-center rounded-full p-1">
              <ScalableFavoriteIcon size={20} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
