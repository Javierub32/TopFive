import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useUser } from '@/User/hooks/useUser';
import { COLORS } from 'constants/colors';

export default function UserDetailsScreen() {
  const { id } = useLocalSearchParams();
  const {loading, userData} = useUser(id as string);

  return (
    <Screen>
      <ReturnButton route='/(tabs)/Search' title='Detalles del Usuario' />

	  {loading ? (
		<ActivityIndicator size="large" color={COLORS.secondary} className="flex-1 items-center justify-center" />
	  ) : 
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl text-primaryText">
          User ID URL: {id} <br />
		  User ID Cargado: {userData?.id} <br />
		  Username: {userData?.username} <br />
		  Description: {userData?.description || 'N/A'} <br />
        </Text>
      </View>
	  }
    </Screen>
  );
}
