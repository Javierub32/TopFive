import { View, FlatList, RefreshControl } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { useForYou } from '@/Home/hooks/useForYou';
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

export default function ForYouFeed({ headerHeight, scrollHandler, isActive, translateY }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { activities, loading, handleLoadMore, handleItemPress, refreshing, refreshForYou } = useForYou();
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
      keyExtractor={(item: any, index: number) =>
        [item.usuarioId, item.tipo_contenido, item.recurso_id, index].join('-')
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
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshForYou}
          tintColor={colors.primaryText}
          progressViewOffset={headerHeight}
        />
      }
      ListEmptyComponent={() => (
        <View className="flex-1 items-center px-4 ">
          <SocialBubblesIcon className="mb-4" size={100} color={colors.primaryText} />
          <AppText className="mb-4 text-center text-2xl font-bold" style={{ color: colors.primaryText }}>
            {'No hay contenido para mostrar en este momento. Vuelve más tarde o sigue a más usuarios para ver sus actividades.'}
          </AppText>
        </View>
      )}
      ListFooterComponent={() => (loading ? <LoadingIndicator /> : null)}
      showsVerticalScrollIndicator={false}
    />
  );
}