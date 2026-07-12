import { FlatList, View } from 'react-native';

import { Screen } from 'components/Screen';
import { ReturnButton } from 'components/ReturnButton';
import { useNotification } from '@/Notifications/hooks/useNotification';
import { NotificationItem } from '@/Notifications/components/NotificationItems';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from 'context/ThemeContext';
import { ScalableMaterialIcons } from 'components/Icons';
import { useUser } from '@/User/hooks/useUser';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
export default function NotificationsScreen() {
  const {
    loading,
    notifications,
    fetchNotifications,
    refreshNotifications,
    refreshing,
    handleAcceptNotification,
    handleDeclineNotification,
  } = useNotification();
  const { from } = useLocalSearchParams();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const { handleFollow } = useUser('');

  if (loading && notifications.length === 0) {
    return (
      <Screen>
        <ReturnButton route={`/(tabs)/${from}`} title={t('notifications.title')} />
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ReturnButton route={`/(tabs)/${from}`} title={t('notifications.title')} />
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
            followBack={() => handleFollow(item.follower_id)}
          />
        )}
        onEndReached={fetchNotifications}
        onEndReachedThreshold={0.5}
        onRefresh={refreshNotifications}
        refreshing={refreshing}
        ListFooterComponent={() =>
          loading && !refreshing ? (
            <View className="py-4">
              <LoadingIndicator />
            </View>
          ) : null
        }
        contentContainerStyle={
          notifications.length === 0
            ? { flexGrow: 1, justifyContent: 'center' }
            : { paddingBottom: 20 }
        }
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center px-6 pb-20">
            <View
              className="mb-6 h-28 w-28 items-center justify-center rounded-full"
              style={{ backgroundColor: `${colors.secondary}20` }}>
              <ScalableMaterialIcons name="notifications-off" size={56} color={colors.secondary} />
            </View>

            <AppText
              className="mb-3 text-center font-bold"
              style={{ color: colors.primaryText, fontSize: 24 }}>
              {t('notifications.noNotifications')}
            </AppText>
            <AppText
              className="px-12 text-center text-base"
              style={{ color: colors.secondaryText, fontSize: 16 }}>
              {t('notifications.noNotificationsDescription')}
            </AppText>
          </View>
        )}
      />
    </Screen>
  );
}
