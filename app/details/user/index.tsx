import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';

export default function UserDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <Screen>
      <ReturnButton route='/(tabs)/Search' title='Detalles del Usuario' />
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl text-primaryText">
          User ID: {id}
        </Text>
      </View>
    </Screen>
  );
}
