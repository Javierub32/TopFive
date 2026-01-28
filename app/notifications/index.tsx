import { FlatList } from 'react-native';

import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useNotification } from '@/Notifications/hooks/useNotification';
import { NotificationButton } from '@/Notifications/components/NotificationButton';
import { LoadingIndicator } from 'components/LoadingIndicator';

export default function NotificationsScreen() {
  const { loading, notifications, handleAcceptNotification, handleDeclineNotification } = useNotification();
  console.log('Notifications:', notifications);
  
  if (loading) {
	return (
		<Screen>
		  <ReturnButton route='/(tabs)/Profile' title='Notificaciones del Usuario' />
		  <LoadingIndicator />
		</Screen>
	);
  }

  return (
	<Screen>
	  <ReturnButton route='/(tabs)/Profile' title='Notificaciones del Usuario' />
	  <FlatList
	  	data={notifications}
		keyExtractor={(item) => item.id.toString()}
		renderItem={({ item }) => (
		  <NotificationButton 
		    user={item.user}
			handleAccept={() => handleAcceptNotification(item.id, item.follower_id, item.following_id)}
			handleDecline={() => handleDeclineNotification(item.id, item.follower_id, item.following_id)}
		  />
		)}
		contentContainerStyle={{ paddingBottom: 20 }}
	  />
	</Screen>
  );
}
