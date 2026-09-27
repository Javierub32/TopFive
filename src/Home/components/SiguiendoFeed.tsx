import { View, RefreshControl } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { useActivity } from '@/Home/hooks/useActivity';
import ActivityItem from '@/Home/components/RenderResource';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { SocialBubblesIcon } from 'components/Icons';
import { NativeAdCard } from 'components/NativeAdCard';
import { AppText } from 'components/AppText';
import { Tabs } from 'react-native-collapsible-tab-view';
import { useTranslation } from 'react-i18next';

export default function SiguiendoFeed() {
  const { colors } = useTheme();
  const { activities, loading, fetchActivities, handleItemPress, refreshing, refreshActivities } = useActivity();
  const { t } = useTranslation();
  if (loading && activities.length === 0 ) return <LoadingIndicator />;

  return (
    <Tabs.FlatList
      data={activities}
      keyExtractor={(item: any, index: number) =>
        [item.usuarioId, item.tipo_contenido, item.recurso_id, index].join('-')
      }
      renderItem={({ item, index }: { item: any; index: number }) => (
        <>
          <ActivityItem item={item} onPress={(params) => handleItemPress(item, params)} />
          {(index + 1) % 4 === 0 && <NativeAdCard />}
        </>
      )}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
      onEndReached={fetchActivities}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshActivities}
          tintColor={colors.primaryText}
        />
      }
      ListEmptyComponent={() => (
        <View className="flex-1 items-center px-4 pt-10">
          <SocialBubblesIcon className="mb-4" size={100} color={colors.primaryText} />
          <AppText className="mb-4 text-center text-2xl font-bold" style={{ color: colors.primaryText }}>
            {t('home.noCompletedReviewsFromFriends')}
          </AppText>
        </View>
      )}
      ListFooterComponent={() => (loading ? <LoadingIndicator /> : null)}
      showsVerticalScrollIndicator={false}
    />
  );
}
