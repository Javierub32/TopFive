import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from 'context/ThemeContext';
import { useActivity } from '@/Home/hooks/useActivity';
import ActivityItem from '@/Home/components/RenderResource';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { SocialBubblesIcon } from 'components/Icons';
import { NativeAdCard } from 'components/NativeAdCard';
import { AppText } from 'components/AppText';
import Animated from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface Props {
  headerHeight: number;
  scrollHandler: any;
  isActive: boolean;
  translateY: any;
}

export default function SiguiendoFeed({ headerHeight, scrollHandler, isActive, translateY }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { activities, loading, refreshing, fetchActivities, refreshActivities, handleItemPress } =
    useActivity();
  const listRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && translateY && translateY.value < 0) {
      const headerHidden = Math.abs(translateY.value)
      setTimeout(() => {
        listRef.current?.scrollToOffset({
          offset: headerHidden,
          animated: false,
        });
      }, 0);
    }
  }, [isActive, translateY]);

  if (loading && activities.length === 0) return <LoadingIndicator />;

  return (
    <AnimatedFlatList
      ref={listRef}
      data={activities}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      keyExtractor={(item: any) =>
        [item.usuarioId, item.tipo_contenido, item.recurso_id, item.fecha_actividad ?? item.fechacreacion].join('-')
      }
      renderItem={({ item, index }: { item: any; index: number }) => (
        <>
          <ActivityItem item={item} onPress={() => handleItemPress(item)} />
          {(index + 1) % 4 === 0 && <NativeAdCard />}
        </>
      )}
      contentContainerStyle={
        activities.length === 0
          ? { flex: 1, paddingHorizontal: 16, paddingVertical: 150, paddingTop: headerHeight + 20 }
          : { paddingHorizontal: 16, paddingBottom: 16, paddingTop: headerHeight + 10 }
      }
      onEndReached={fetchActivities}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshActivities}
          tintColor={colors.primaryText}
          progressViewOffset={headerHeight}
        />
      }
      ListEmptyComponent={() => (
        <View className="flex-1 items-center px-4 ">
          <SocialBubblesIcon className="mb-4" size={100} color={colors.primaryText} />
          <AppText className="mb-4 text-center text-2xl font-bold" style={{ color: colors.primaryText }}>
            {t('home.noCompletedReviewsFromFriends')}
          </AppText>
          <AppText className="text-md mb-6 text-center" style={{ color: colors.primaryText }}>
            {t('home.addFriendsToSeeReviews')}
          </AppText>
          <TouchableOpacity
            onPress={() => router.push('/search')}
            className="rounded-3xl px-6 py-3"
            style={{ backgroundColor: colors.primary }}>
            <AppText className="text-base font-bold text-white">{t('home.searchFriends')}</AppText>
          </TouchableOpacity>
        </View>
      )}
      ListFooterComponent={() => (loading ? <LoadingIndicator /> : null)}
      showsVerticalScrollIndicator={false}
    />
  );
}