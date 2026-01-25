import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';

export default function NotificationsScreen() {
  return (
	<Screen>
	  <ReturnButton route='/(tabs)/Profile' title='Notificaciones del Usuario' />
	</Screen>
  );
}
