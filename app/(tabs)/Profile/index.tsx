import { useState } from 'react';
import { View, ScrollView, Pressable, TouchableOpacity, Share, useWindowDimensions } from 'react-native';
import { Screen } from 'components/Screen';
import { Feather } from '@expo/vector-icons';
import { TabView } from 'react-native-tab-view';

import { useProfile } from 'src/Profile/hooks/useProfile';
import { ProfileAvatar } from 'src/Profile/components/ProfileAvatar';
import { CategorySelector } from 'src/Profile/components/CategorySelector';
import { StatsGrid } from 'src/Profile/components/StatsGrid';
import { StatsChart } from 'src/Profile/components/StatsChart';
import { ProfileData } from '@/User/components/ProfileData';
import { TopFiveSelector } from 'src/Profile/components/TopFiveSelector';
import { router } from 'expo-router';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { NotificationButton } from '@/Notifications/components/NotificationButton';
import { useTranslation } from 'react-i18next';
import { AppText } from 'components/AppText';
import { ResourceType } from 'hooks/useResource';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuth } from 'context/AuthContext';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const layout = useWindowDimensions();

  const {
    userData,
    selectedCategory,
    setSelectedCategory,
    pickImage,
    selectedYear,
    setSelectedYear,
    loading,
    currentStats,
    statsLoading,
  } = useProfile();

  const { t } = useTranslation();

  const [isChanging, setIsChanging] = useState(false);

  // Mismo orden y claves que en Collection
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
        message: t('profile.shareMessage', { url }),
      });
    } catch (error) {
      console.error('Error al compartir', error);
    }
  };

  const renderScene = ({ route }: any) => {
    if (isChanging || route.key !== selectedCategory) {
      return (
        <View className="flex-1 items-center justify-center py-10">
          <LoadingIndicator />
        </View>
      );
    }

    return (
      <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)} style={{ flex: 1, paddingTop: 16 }}>
        {statsLoading ? (
          <View className="flex-1 items-center justify-center py-10">
            <LoadingIndicator />
          </View>
        ) : (
          <>
            <StatsGrid
              title={t(currentStats.titleKey as any)}
              total={currentStats.total}
              average={currentStats.average}
            />

            <StatsChart
              data={currentStats.chartData}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </>
        )}
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedStatusBar />
      <View className="flex-1 px-4 pt-6">
        <AppText className="mb-4 font-bold" style={{ color: colors.primaryText, fontSize: 28 }}>
          {userData?.username || t('profile.user')}
        </AppText>

        <View className="absolute right-4 top-5 z-10 flex-row gap-x-2">
          <NotificationButton from="Profile" />
          <Pressable
            className="rounded-full p-3"
            onPress={() =>
              router.push({
                pathname: '/settings',
                params: {
                  username: userData?.username,
                  description: userData?.description,
                  avatar_url: userData?.avatar_url || null,
                  frame: userData?.frame || 'none',
                  from: 'Profile',
                },
              })
            }>
            <Feather name="settings" size={24} color={colors.primaryText} />
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <ProfileData
            username={userData?.username || t('profile.user')}
            description={userData?.description}
            followersCount={userData?.followers_count || 0}
            followingCount={userData?.following_count || 0}
            reviewsCount={userData?.reviews_count || 0}>
            <ProfileAvatar
              avatarUrl={userData?.avatar_url || null}
              onPickImage={pickImage}
              frame={userData?.frame || 'none'}
            />
          </ProfileData>

          <View className="mt-5 flex-row gap-x-2">
            <TouchableOpacity
              className="flex-1 items-center justify-center rounded-xl px-3 py-2"
              style={{ backgroundColor: `${colors.accent}33` }}
              activeOpacity={0.4}
              onPress={() =>
                router.push({
                  pathname: '/editProfile',
                  params: {
                    username: userData?.username,
                    description: userData?.description,
                    from: 'Profile',
                  },
                })
              }>
              <AppText className="text-base font-semibold" style={{ fontSize: 14, color: colors.primaryText }}>
                {t('settings.personalization.editProfile.title')}
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

          {userData?.id && <TopFiveSelector userId={userData.id} />}

          {/* TabView implementado para poder deslizar horizontalmente */}
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
        </ScrollView>
      </View>
    </Screen>
  );
}