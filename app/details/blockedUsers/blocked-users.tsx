import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from 'components/AppText';
import { ReturnButton } from 'components/ReturnButton';
import { Screen } from 'components/Screen';
import {
  ScalableBlockUserIcon,
  ScalableCancelIcon,
  ScalableMaterialCommunityIcons,
} from 'components/Icons';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { useNotification } from 'context/NotificationContext';
import { useTheme } from 'context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { BlockedUser } from '@/User/services/userService';
import { useBlockedUsers } from '@/User/hooks/useBlockedUsers';

export default function BlockedUsersScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { showNotification, hideNotification } = useNotification();
  const { blockedUsers, isLoading, isError, refetch, unblockUser, isUnblocking } =
    useBlockedUsers();

  const handleUnblockPress = (blockedUser: BlockedUser) => {
    showNotification({
      title: t('profile.unblockUser.title', { username: blockedUser.username }),
      description: t('profile.unblockUser.description', { username: blockedUser.username }),
      isChoice: true,
      delete: false,
      success: false,
      leftButtonText: t('common.cancel'),
      rightButtonText: t('profile.unblockUser.action'),
      onLeftPress: hideNotification,
      onRightPress: async () => {
        hideNotification();
        try {
          await unblockUser(blockedUser.id);
          showNotification({
            title: t('profile.unblockUser.successTitle'),
            description: t('profile.unblockUser.successDescription', {
              username: blockedUser.username,
            }),
            isChoice: false,
            delete: false,
            success: true,
          });
        } catch {
          showNotification({
            title: t('common.error'),
            description: t('profile.unblockUser.errorDescription', {
              username: blockedUser.username,
            }),
            isChoice: false,
            delete: false,
            success: false,
          });
        }
      },
    });
  };

  return (
    <Screen>
      <ReturnButton route="back" title={t('settings.privacy.blockedUsers.title')} />
      <View className="flex-1 px-4 pb-4">
        {isLoading ? (
          <LoadingIndicator />
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-3 px-4">
            <AppText className="text-center" style={{ color: colors.secondaryText, fontSize: 15 }}>
              {t('settings.privacy.blockedUsers.loadError')}
            </AppText>
            <TouchableOpacity
              className="rounded-xl px-4 py-2"
              style={{ backgroundColor: colors.primary }}
              activeOpacity={0.7}
              onPress={() => refetch()}>
              <AppText className="font-bold" style={{ color: colors.background, fontSize: 14 }}>
                {t('common.retry')}
              </AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={blockedUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                className="flex-row items-center gap-3 rounded-2xl p-3"
                style={{ backgroundColor: colors.surfaceButton }}>
                <TouchableOpacity
                  className="flex-1 flex-row items-center gap-3"
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: 'details/user/',
                      params: { username: item.username, from: 'user' },
                    })
                  }>
                  {item.avatar_url ? (
                    <Image source={{ uri: item.avatar_url }} className="h-12 w-12 rounded-full" />
                  ) : (
                    <View
                      className="h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.background }}>
                      <ScalableMaterialCommunityIcons
                        name="account-outline"
                        size={26}
                        color={colors.secondaryText}
                      />
                    </View>
                  )}
                  <AppText
                    className="flex-1 font-semibold"
                    style={{ color: colors.primaryText, fontSize: 16 }}>
                    {item.username}
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  className="items-center justify-center p-2"
                  style={{ opacity: isUnblocking ? 0.6 : 1 }}
                  activeOpacity={0.7}
                  disabled={isUnblocking}
                  accessibilityRole="button"
                  accessibilityLabel={`${t('profile.unblockUser.action')} ${item.username}`}
                  onPress={() => handleUnblockPress(item)}>
                  <ScalableCancelIcon color={colors.primaryText} size={24} />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ flexGrow: 1, gap: 10, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center px-6">
                <View
                  className="mb-6 h-32 w-32 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${colors.primaryText}1A` }}>
                  <View
                    className="h-28 w-28 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.secondary }}>
                    <ScalableBlockUserIcon size={64} color={colors.primaryText} />
                  </View>
                </View>
                <AppText
                  className="mt-4 text-center font-bold"
                  style={{ color: colors.primaryText, fontSize: 18 }}>
                  {t('settings.privacy.blockedUsers.emptyTitle')}
                </AppText>
                <AppText
                  className="mt-2 text-center"
                  style={{ color: colors.secondaryText, fontSize: 14 }}>
                  {t('settings.privacy.blockedUsers.emptyDescription')}
                </AppText>
              </View>
            }
          />
        )}
      </View>
    </Screen>
  );
}
