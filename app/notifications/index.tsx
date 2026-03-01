import { FlatList, Text, View } from 'react-native';

import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useNotification } from '@/Notifications/hooks/useNotification';
import { NotificationItem } from '@/Notifications/components/NotificationItems';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { router } from 'expo-router';
import { useTheme } from "context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function NotificationsScreen() {
  const { loading, notifications, handleAcceptNotification, handleDeclineNotification } =
    useNotification();
  
  const {colors} = useTheme();

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
        contentContainerStyle={
          notifications.length === 0 
          ? {flexGrow: 1, justifyContent: 'center'}
          : { paddingBottom: 20 }
        }
        ListEmptyComponent={() => (
    
          <View 
            className="flex-1 items-center justify-center px-6 pb-20"
          >
            <View className="mb-6 h-28 w-28 items-center justify-center rounded-full" style={{backgroundColor: `${colors.secondary}20`}}>
              <MaterialIcons name="notifications-off" size={56} color={colors.secondary} />
            </View>
            
          
          <Text
            className="mb-3 text-center text-2xl font-bold"
            style={{color: colors.primaryText}}
          >
            Sin Notificaciones
          </Text>
          <Text
            className="text-center text-base px-12"
            style={{color: colors.secondaryText}}
          >
            No tienes notifiaciones pendientes en este momento. ¡Vuelve más tarde!
          </Text>
          </View>
          
        )}
      />
    </Screen>
  );
}
