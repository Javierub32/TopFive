import DiaryEntity from '@/Diary/entity/diaryEntity';
import { useDiary } from '@/Diary/hooks/useDiary';
import { FontAwesome5 } from '@expo/vector-icons';
import { ScalableFavoriteIcon, ScalableMaterialCommunityIcons } from 'components/Icons';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ReturnButton } from 'components/ReturnButton';
import { Screen } from 'components/Screen';
import { useAuth } from 'context/AuthContext';
import { useTheme } from 'context/ThemeContext';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SectionList, Text, TouchableOpacity, View } from 'react-native';

export default function DiaryScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const { items, loadMore, loading, loadingMore, hasNextPage, refresh, openReview } = useDiary(
    user?.id
  );

  const sections = useMemo(() => {
    const groups = new Map<string, { title: string; data: any[] }>();

    items.forEach((item) => {
      const [year, month, day] = item.fecha_fin!.split('-').map(Number);

      const date = new Date(year, month - 1, day);

      const key = `${year}-${String(month)}`;

      const locale = i18n.resolvedLanguage ?? 'es';

      const title = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
        .format(date)
        .toLocaleUpperCase(locale);

      if (!groups.has(key)) {
        groups.set(key, { title, data: [] });
      }

      groups.get(key)!.data.push(item);
    });

    return Array.from(groups.values());
  }, [items]);

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
        keyExtractor={(item) => item.recurso_id.toString()}
        renderSectionHeader={({ section }) => renderHeader({ section, colors })}
        renderItem={({ item, index, section }) => (
          <TouchableOpacity onPress={() => openReview(item)} activeOpacity={0.8}>
            {renderItem({ item, colors, t, isLast: index === section.data.length - 1 })}
          </TouchableOpacity>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <LoadingIndicator /> : <View className="h-20" />}
        refreshing={loading}
        onRefresh={refresh}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Text style={{ color: colors.placeholderText }}>{t('diary.empty')}</Text>
          </View>
        }
        style={{ flex: 1 }}
      />
    </Screen>
  );
}

const renderHeader = ({ section, colors }: { section: { title: string }; colors: any }) => {
  return (
    <View
      className="px-4 py-2"
      style={{
        backgroundColor: colors.surfaceButton,
        borderTopWidth: 1,
        borderTopColor: colors.borderButton,
      }}>
      <Text className="text-xl font-light tracking-widest" style={{ color: colors.primaryText }}>
        {section.title.toUpperCase()}
      </Text>
    </View>
  );
};
const renderItem = ({
  item,
  colors,
  t,
  isLast,
}: {
  item: DiaryEntity;
  colors: any;
  t: any;
  isLast: boolean;
}) => {
  const day = new Date(`${item.fecha_fin}T00:00:00`).getDate();
  const year = new Date(`${item.anio_lanzamiento}T00:00:00`).getFullYear();

  const posterUrl = item.imagen_url;

  const rating = Number(item.calificacion ?? 0);

  const titulo = item.titulo.slice(0, 35) + (item.titulo.length > 35 ? ' ...' : '');

  const hasReview = item.comentario !== null && item.comentario !== '';

  return (
    <View
      className="flex-row border-b px-5 py-5"
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.placeholderText,
      }}>
      {/* Día */}
      <View
        className="mr-5 h-14 w-14 items-center justify-center self-center rounded-xl border "
        style={{ borderColor: colors.placeholderText }}>
        <Text className="text-2xl font-light" style={{ color: colors.secondaryText }}>
          {day}
        </Text>
      </View>

      {/* Póster */}
      <View
        className="mr-5 overflow-hidden border"
        style={{ width: 55, aspectRatio: 2 / 3, borderColor: colors.surfaceButton }}>
        {posterUrl ? (
          <Image source={{ uri: posterUrl }} className="h-full w-full" resizeMode="cover" />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Text className="text-center text-xs" style={{ color: colors.placeholderText }}>
              {t('diary.noImage')}
            </Text>
          </View>
        )}
      </View>

      {/* Información */}
      <View className="flex-1 justify-center">
        <Text
          className="text-lg font-light"
          style={{ color: colors.primaryText }}
          numberOfLines={2}>
          {titulo}{' '}
          <Text className="text-base font-normal" style={{ color: colors.secondaryText }}>
            {year}
          </Text>
        </Text>

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
                name="feather"
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
