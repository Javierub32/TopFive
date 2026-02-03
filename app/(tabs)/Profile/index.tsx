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
import { useTheme } from 'context/ThemeContext';
import { ThemedStatusBar } from 'components/ThemedStatusBar';

export default function ProfileScreen() {
  const { colors } = useTheme();
  
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

  if (loading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }
  
  const currentStats = categoryData[selectedCategory];

  return (
    <Screen>
      <ThemedStatusBar/>
        <View className="flex-1 px-4 pt-6">
          <Text className="mb-4 text-3xl font-bold" style={{color: colors.primaryText}}>
            {userData?.username || 'Usuario'}
          </Text>

          {/* Botones de configuración y notificaciones */}
          <View className="absolute right-4 top-5 z-10 flex-row gap-x-2">
            <Pressable
              className="rounded-full p-3"
              style= {{backgroundColor: `${colors.primaryText}30`}}
              onPress={() => router.push('/notifications')}>
              <MaterialIcons name="notifications-none" size={24} color={colors.primaryText} />
            </Pressable>
            <Pressable
              className="rounded-full p-3"
              style= {{backgroundColor: `${colors.primaryText}30`}}
              onPress={() => router.push('/settings')}>
              <Feather name="settings" size={24} color={colors.primaryText} />
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
    </Screen>
  );
}