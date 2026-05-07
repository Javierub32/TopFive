import { View, Text, ScrollView, Pressable, TouchableOpacity, Share} from 'react-native';
import { Screen } from 'components/Screen';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import { useProfile } from 'src/Profile/hooks/useProfile';
import { ProfileAvatar } from 'src/Profile/components/ProfileAvatar';
import { CategorySelector } from 'src/Profile/components/CategorySelector';
import { StatsGrid } from 'src/Profile/components/StatsGrid';
import { StatsChart } from 'src/Profile/components/StatsChart';
import { ProfileData } from '@/User/components/ProfileData';
import { TopFiveSelector } from 'src/Profile/components/TopFiveSelector';
import { router, useLocalSearchParams } from 'expo-router';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';
import { NotificationButton } from '@/Notifications/components/NotificationButton';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const { colors } = useTheme();

  const {
    userData,
    selectedCategory,
    isPressed,
    setSelectedCategory,
    setIsPressed,
    pickImage,
    selectedYear,
    setSelectedYear,
    loading,
    currentStats,
	statsLoading
  } = useProfile();

  const categoryLabels = {
    libro: 'Libros Completados',
    pelicula: 'Películas Completadas',
    serie: 'Series Completadas',
    videojuego: 'Videojuegos Completados',
    cancion: 'Albumes Completados',
  };

  const { t, i18n } = useTranslation();

  const handleShare = async () => {
    if (!userData?.username) return;
    try {
      const url = `https://www.topfive5.me/details/user?username=${userData?.username}&from=link`;
      await Share.share({
        message: `¡Echa un vistazo a mi perfil en TopFive!\n${url}`,
      });
    } catch (error) {
      console.error('Error al compartir', error);
    }
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
        <Text className="mb-4 text-3xl font-bold" style={{ color: colors.primaryText }}>
          {userData?.username || 'Usuario'}
        </Text>

        {/* Botones de configuración y notificaciones */}
        <View className="absolute right-4 top-5 z-10 flex-row gap-x-2">
          <NotificationButton from='Profile'/>
          <Pressable
            className="rounded-full p-3"
            onPress={() => router.push({ pathname: '/settings' , params: { username: userData?.username, description: userData?.description } })}>
            <Feather name="settings" size={24} color={colors.primaryText} />
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <ProfileData
            username={userData?.username || 'Usuario'}
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

          {/* EDITAR Y COMPARTIR PERFIL */}
          <View className="flex-row gap-x-2 mt-5">
            {/* Editar perfil */}
            <TouchableOpacity
              className="flex-1 items-center justify-center rounded-xl py-2.5 px-3"
              style={{ backgroundColor: `${colors.accent}33` }}
              activeOpacity={0.4}
              onPress={() =>
                router.push({ pathname: '/editProfile', params: { username: userData?.username, description: userData?.description } })
              }>
                <Text className="text-base font-semibold" style={{ color: colors.primaryText }}>
                  {t('settings.personalization.editProfile')}
                </Text>
            </TouchableOpacity>

            {/* Compartir perfil */}
            <TouchableOpacity
              className="flex-1 items-center justify-center rounded-xl py-2.5 px-3"
              style={{ backgroundColor: `${colors.accent}33` }}
              activeOpacity={0.4}
              onPress={handleShare}>
                <Text className="text-base font-semibold" style={{ color: colors.primaryText }}>
                  {t('settings.account.share')}
                </Text>
            </TouchableOpacity>
          </View>


          {userData?.id && <TopFiveSelector userId={userData.id} />}
          <CategorySelector selected={selectedCategory} onSelect={setSelectedCategory} />
		      {statsLoading ? (
          <View className="mb-4 flex items-center justify-center py-10">
            <LoadingIndicator />
          </View>
          ) : (
          <>
            <StatsGrid
              title={currentStats.title}
              total={currentStats.total}
              average={currentStats.average}
              /* router.push({
                pathname: '/group',
                params: { title: 'Completados', state: 'completados', category: selectedCategory, from: 'Profile' }
              })*/
            />

            <StatsChart
              data={currentStats.chartData}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          </>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
