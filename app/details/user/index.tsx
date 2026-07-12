import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useUser } from '@/User/hooks/useUser';
import { ProfileData } from '@/User/components/ProfileData';
import { UserAvatar } from '@/User/components/UserAvatar';
import { FollowButton } from '@/User/components/FollowButton';
import { LoadingIndicator } from 'components/LoadingIndicator';
import {
  View,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Share,
  RefreshControl,
} from 'react-native';
import { TopFiveSelector } from '@/Profile/components/TopFiveSelector';
import { StatsChart } from '@/Profile/components/StatsChart';
import { StatsGrid } from '@/Profile/components/StatsGrid';
import { CategorySelector } from '@/Profile/components/CategorySelector';
import { useTranslation } from 'react-i18next';
import { TabView } from 'react-native-tab-view';
import { ResourceType } from 'hooks/useResource';
import { useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppText } from 'components/AppText';
import { useTheme } from 'context/ThemeContext';
import { useNotification } from 'context/NotificationContext';

export default function UserDetailsScreen() {
  const { colors } = useTheme();
  const { username, from } = useLocalSearchParams();
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [isChanging, setIsChanging] = useState(false);
  const { showNotification, hideNotification } = useNotification();

  const {
    loading,
    userData,
    handleFollow,
    cancelRequest,
    selectedCategory,
    setSelectedCategory,
    selectedYear,
    setSelectedYear,
    currentStats,
    statsLoading,
    refreshing,
    refreshUserData,
  } = useUser(username as string);

  const canViewStats = userData?.following_status === 'accepted';
  const getPath = () => {
    if (from === 'home') return 'back';
    if (from === 'link') return '/Home';
    return '/Home';
  };
  const route = getPath();

  const routes = [
    { key: 'libro', title: t('category.book') },
    { key: 'serie', title: t('category.serie') },
    { key: 'pelicula', title: t('category.film') },
    { key: 'videojuego', title: t('category.videogame') },
    { key: 'cancion', title: t('category.album') },
  ];

  const index = routes.findIndex((r) => r.key === selectedCategory);
  const safeIndex = index === -1 ? 0 : index;

  const handleIndexChange = (i: number) => {
    setIsChanging(true);
    setSelectedCategory(routes[i].key as ResourceType);
    setTimeout(() => {
      setIsChanging(false);
    }, 350);
  };

  const handleShare = async () => {
    if (!userData?.username) return;
    try {
      const url = `https://www.topfive5.me/details/user?username=${userData?.username}&from=link`;
      await Share.share({
        message: t('profile.shareUserMessage', { url }),
      });
    } catch (error) {
      console.error('Error al compartir', error);
    }
  };

  const handleUnfollowPress = () => {
    showNotification({
      title: t('profile.deleteFollowing.title'),
      description: t('profile.deleteFollowing.description', { username: userData?.username || '' }),
      leftButtonText: t('common.cancel'),
      rightButtonText: t('profile.deleteFollowing.title'),
      isChoice: true,
      delete: true,
      success: false,
      onLeftPress: () => hideNotification(),
      onRightPress: () => {
        hideNotification();
        cancelRequest(); 
      },
    });
  };
  

  const renderScene = ({ route: tabRoute }: any) => {
    if (isChanging || tabRoute.key !== selectedCategory) {
      return (
        <View className="flex-1 items-center justify-center py-10">
          <LoadingIndicator />
        </View>
      );
    }

    const currentCategoryTitle = routes.find(r => r.key === selectedCategory)?.title || '';


    return (
      <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1, paddingTop: 16 }}>
        {statsLoading ? (
          <View className="flex-1 items-center justify-center py-10">
            <LoadingIndicator />
          </View>
        ) : (
          <>
            <StatsGrid
              title={currentStats.title}
              total={currentStats.total}
              average={currentStats.average}
            />
            <StatsChart
              data={currentStats.chartData}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />

            <TouchableOpacity
              className="rounded-lg p-4 mb-6 mx-1" // Le he puesto un mt-4 para separarlo un poco
              style={{ backgroundColor: colors.accent, marginTop: -10 }}
              activeOpacity={0.7}
              onPress={() => router.push({
                pathname: '/group',
                params: { 
                  title: 'Completados', 
                  state: 'completados', 
                  category: selectedCategory,
                  targetUserId: userData?.id
                }
              })}
            >
              <AppText className="text-center font-semibold" style={{ color: colors.primaryText, fontSize: 16 }}>
                {t(`profile.viewCompleted.${selectedCategory}`)}
              </AppText>
            </TouchableOpacity>

          </>
        )}
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <Screen>
        <ReturnButton route={route} title="" />
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ReturnButton route={route} title={userData?.username || t('details.userDetails')} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshUserData}
            tintColor={colors.primaryText}
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        >
        <View className="px-4 pb-6">
          <ProfileData
            username={userData?.username || t('details.user')}
            followersCount={userData?.followers_count || 0}
            followingCount={userData?.following_count || 0}
            reviewsCount={userData?.reviews_count || 0}
            description={userData?.description || ''}>
            <UserAvatar
              avatarUrl={userData?.avatar_url || null}
              frame={userData?.frame || 'none'}
            />
          </ProfileData>

          <FollowButton
            isFollowed={userData?.following_status === 'accepted' || false}
            isRequested={userData?.is_requested || false}
            handleFollow={handleFollow}
            cancelRequest={cancelRequest}
          />
          {canViewStats && userData?.id && (
            <>
              <View className="mt-6 flex-row gap-x-2">
                <TouchableOpacity
                  className="flex-1 items-center justify-center rounded-xl px-3 py-2"
                  style={{ backgroundColor: `${colors.accent}33` }}
                  activeOpacity={0.4}
                  onPress={handleUnfollowPress}>
                  <AppText className="text-base font-semibold" style={{ fontSize: 14, color: colors.primaryText }}>
                    {t('profile.deleteFollowing.title')}
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 items-center justify-center rounded-xl px-3 py-2"
                  style={{ backgroundColor: `${colors.accent}33` }}
                  activeOpacity={0.4}
                  onPress={handleShare}>
                  <AppText className="text-base font-semibold" style={{ fontSize: 14, color: colors.primaryText }}>
                    {t('settings.account.share.title')}
                  </AppText>
                </TouchableOpacity>

              </View>

              <TopFiveSelector userId={userData.id} />

              <View className="mt-4">
                <TabView
                  navigationState={{ index: safeIndex, routes }}
                  renderScene={renderScene}
                  renderTabBar={() => (
                    <CategorySelector
                      selected={selectedCategory}
                      onSelect={(cat) => {
                        const newIndex = routes.findIndex(r => r.key === cat);
                        handleIndexChange(newIndex);
                      }}
                    />
                  )}
                  onIndexChange={handleIndexChange}
                  initialLayout={{ width: layout.width }}
                  swipeEnabled={true}
                  style={{ height: 600 }}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
