import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useUser } from '@/User/hooks/useUser';
import { COLORS } from 'constants/colors';
import { ProfileData } from '@/User/components/ProfileData';
import { UserAvatar } from '@/User/components/UserAvatar';
import { FollowButton } from '@/User/components/FollowButton';

export default function UserDetailsScreen() {
  const { id } = useLocalSearchParams();
  const {loading, userData, handleFollow, cancelRequest} = useUser(id as string);
  console.log("Rendering UserDetailsScreen with userData:", userData);

  if (loading) {
    return (
      <Screen>
        <ReturnButton route='/(tabs)/Search' title='Detalles del Usuario' />
        <ActivityIndicator size="large" color={COLORS.secondary} className="flex-1 items-center justify-center" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ReturnButton route='/(tabs)/Search' title='Detalles del Usuario' />
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
    </Screen>
  );
}
