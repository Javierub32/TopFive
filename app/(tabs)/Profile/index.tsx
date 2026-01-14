import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { Ionicons } from '@expo/vector-icons';

import { useProfile } from './hooks/useProfile';
import { ProfileAvatar } from './components/ProfileAvatar';
import { CategorySelector } from './components/CategorySelector';
import { StatsGrid } from './components/StatsGrid';
import { StatsChart } from './components/StatsChart';

export default function ProfileScreen() {
  const {
    user,
    username,
    avatarUrl,
    selectedCategory,
    isPressed,
    categoryData,
    setSelectedCategory,
    setIsPressed,
    pickImage,
    signOut,
  } = useProfile();

  if (!user) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-primaryText">Cargando perfil...</Text>
        </View>
      </Screen>
    );
  }

  const currentStats = categoryData[selectedCategory];

  return (
    <Screen>
      <StatusBar style="light" />
      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold text-primaryText">Perfil</Text>

        <Pressable
          className="absolute right-4 top-5 z-10 rounded-full bg-white/10 p-3"
          onPress={signOut}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </Pressable>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <ProfileAvatar
            username={username}
            avatarUrl={avatarUrl}
            isPressed={isPressed}
            onPickImage={pickImage}
            setIsPressed={setIsPressed}
          />

          <CategorySelector selected={selectedCategory} onSelect={setSelectedCategory} />

          <StatsGrid
            title={currentStats.title}
            total={currentStats.total}
            average={currentStats.average}
          />

          <StatsChart data={currentStats.chartData} />
        </ScrollView>
      </View>
    </Screen>
  );
}
