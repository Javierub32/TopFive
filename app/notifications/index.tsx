import { FlatList, Text, View } from 'react-native';

import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useNotification } from '@/Notifications/hooks/useNotification';
import { NotificationItem } from '@/Notifications/components/NotificationItems';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from "context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useUser } from '@/User/hooks/useUser';
import { useAuth } from 'context/AuthContext';

export default function NotificationsScreen() {
  const { 
    loading, 
    notifications, 
    fetchNotifications,    
    refreshNotifications,  
    refreshing,            
    handleAcceptNotification, 
    handleDeclineNotification 
  } = useNotification();
  const { from } = useLocalSearchParams();
  const {user} = useAuth();
  const {colors} = useTheme();

    const { handleFollow } = useUser('');


  if (loading && notifications.length === 0) {
    return (
      <Screen>
        <ReturnButton route={`/(tabs)/${from}`} title="Notificaciones del Usuario" />
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ReturnButton route={`/(tabs)/${from}`} title="Notificaciones del Usuario" />
      <FlatList
        data={notifications}
        className="px-3"
        keyExtractor={(item) => item.id.toString()}
		showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <NotificationItem
            user={item.user}
            status={item.status}
            myFollowStatus={item.myFollowStatus} 
            handleAccept={() =>
              handleAcceptNotification(item.id, item.follower_id, item.following_id)
            }
            handleDecline={() =>
              handleDeclineNotification(item.id, item.follower_id, item.following_id)
            }
            onUserPress={() =>
              router.push({
                pathname: 'details/user/',
                params: { username: item.user.username },
              })
            }
            followBack={() =>
              handleFollow(item.follower_id)
            }
          />
        )}
        onEndReached={fetchNotifications}
        onEndReachedThreshold={0.5}
        onRefresh={refreshNotifications}
        refreshing={refreshing}
        ListFooterComponent={() => (
          loading && !refreshing ? <View className="py-4"><LoadingIndicator /></View> : null
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
