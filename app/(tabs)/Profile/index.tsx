import { View, Text, ScrollView, Pressable, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { Feather, MaterialIcons } from '@expo/vector-icons';

import { useProfile } from 'src/Profile/hooks/useProfile';
import { ProfileAvatar } from 'src/Profile/components/ProfileAvatar';
import { CategorySelector } from 'src/Profile/components/CategorySelector';
import { StatsGrid } from 'src/Profile/components/StatsGrid';
import { StatsChart } from 'src/Profile/components/StatsChart';
import { ProfileData } from '@/User/components/ProfileData';
import { TopFiveSelector } from 'src/Profile/components/TopFiveSelector';
import { router } from 'expo-router';
import { LoadingIndicator } from 'components/LoadingIndicator';

export default function ProfileScreen() {
  const {
    user,
    userData,
    selectedCategory,
    isPressed,
    categoryData,
    setSelectedCategory,
    setIsPressed,
    pickImage,
    selectedYear,
    setSelectedYear,
    loading,
  } = useProfile();

  // En lugar de retornar fuera, renderiza condicionalmente DENTRO del componente principal
  // Esto mantiene la jerarquía de componentes estable para el Navigator
  
  const currentStats = categoryData[selectedCategory];

  return (
    <Screen>
      <StatusBar style="light" />
      {loading ? (
        <LoadingIndicator />
      ) : (
        <View className="flex-1 px-4 pt-6">
          <Text className="mb-4 text-3xl font-bold text-primaryText">
            {userData?.username || 'Usuario'}
          </Text>

          {/* Botones de configuración y notificaciones */}
          <View className="absolute right-4 top-5 z-10 flex-row gap-x-2">
            <Pressable
              className="rounded-full bg-primaryText/10 p-3"
              onPress={() => router.push('/notifications')}>
              <MaterialIcons name="notifications-none" size={24} color="white" />
            </Pressable>
            <Pressable
              className="rounded-full bg-primaryText/10 p-3"
              onPress={() => router.push('/settings')}>
              <Feather name="settings" size={24} color="white" />
            </Pressable>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <ProfileData
              username={userData?.username || 'Usuario'}
              description={userData?.description}
              followersCount={userData?.followers_count || 0}
              followingCount={userData?.following_count || 0}>
              <ProfileAvatar
                avatarUrl={userData?.avatar_url || null}
                isPressed={isPressed}
                onPickImage={pickImage}
                setIsPressed={setIsPressed}
              />
            </ProfileData>
            
            <TopFiveSelector />
            <CategorySelector selected={selectedCategory} onSelect={setSelectedCategory} />

            {/* Asegúrate de que currentStats exista antes de pasarlo */}
            {currentStats && (
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
              </>
            )}
          </ScrollView>
        </View>
      )}
    </Screen>
  );
}