import { FlatList } from 'react-native';

import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useNotification } from '@/Notifications/hooks/useNotification';
import { NotificationItem } from '@/Notifications/components/NotificationItems';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  const { loading, notifications, handleAcceptNotification, handleDeclineNotification } =
    useNotification();

  if (loading) {
    return (
      <Screen>
        <ReturnButton route="/(tabs)/Profile" title="Notificaciones del Usuario" />
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ReturnButton route="/(tabs)/Profile" title="Notificaciones del Usuario" />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem
            user={item.user}
            handleAccept={() =>
              handleAcceptNotification(item.id, item.follower_id, item.following_id)
            }
            handleDecline={() =>
              handleDeclineNotification(item.id, item.follower_id, item.following_id)
            }
            onUserPress={() =>
              router.push({
                pathname: 'details/user/',
                params: { id: item.user.id },
              })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </Screen>
  );
}
