import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useUser } from '@/User/hooks/useUser';
import { ProfileData } from '@/User/components/ProfileData';
import { UserAvatar } from '@/User/components/UserAvatar';
import { FollowButton } from '@/User/components/FollowButton';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { View, Text, ScrollView } from 'react-native';
import { TopFiveSelector } from '@/Profile/components/TopFiveSelector';
import { StatsChart } from '@/Profile/components/StatsChart';
import { StatsGrid } from '@/Profile/components/StatsGrid';
import { CategorySelector } from '@/Profile/components/CategorySelector';

export default function UserDetailsScreen() {
  const { username } = useLocalSearchParams();
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
    statsLoading
  } = useUser(username as string);

  const canViewStats = userData?.following_status === 'accepted';

  if (loading) {
    return (
      <Screen>
        <ReturnButton route='/search' title='' />
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ReturnButton route='/search' title={userData?.username || 'Detalles del Usuario'}  />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-6"> 
          <ProfileData 
            username={userData?.username || 'Usuario'} 
            followersCount={userData?.followers_count || 0} 
            followingCount={userData?.following_count || 0} 
            description={userData?.description || ''}
          >
            <UserAvatar avatarUrl={userData?.avatar_url || null} />
          </ProfileData>

          <FollowButton 
            isFollowed={userData?.following_status === 'accepted' || false}
            isRequested={userData?.is_requested || false}
            handleFollow={handleFollow}
            cancelRequest={cancelRequest}
          />
          {canViewStats && userData?.id && (
            <>
                <TopFiveSelector userId={userData.id} />
                
                <View className="mt-4">
                    <CategorySelector
                        selected={selectedCategory} 
                        onSelect={setSelectedCategory} 
                    />

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
                            />
                            <StatsChart
                                data={currentStats.chartData}
                                selectedYear={selectedYear}
                                setSelectedYear={setSelectedYear}
                            />
                        </>
                    )}
                </View>
            </>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
