import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useUser } from '@/User/hooks/useUser';
import { ProfileData } from '@/User/components/ProfileData';
import { UserAvatar } from '@/User/components/UserAvatar';
import { FollowButton } from '@/User/components/FollowButton';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { View, Text } from 'react-native';

export default function UserDetailsScreen() {
  const { username } = useLocalSearchParams();
  const {loading, userData, handleFollow, cancelRequest} = useUser(username as string);
  console.log("Rendering UserDetailsScreen with userData:", userData);

  if (loading) {
    return (
      <Screen>
        <ReturnButton route='/(tabs)/Search' title='Detalles del Usuario' />
        <LoadingIndicator />
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
	  {userData?.following_status === 'accepted' &&
	  	<View className="mt-4 px-4">
			<Text className="text-center text-sm text-gray-500">
				¡Sois amigos!, ¡Podrás ver los Top 5 que este usuario ha compartido contigo en una futura actualización!
			</Text>
		</View>
	  }
    </Screen>
  );
}
