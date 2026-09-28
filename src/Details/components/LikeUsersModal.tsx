import { View, Modal, Pressable, FlatList, Image, TouchableOpacity } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { useLikeUsers } from '../hooks/useLikeUsers';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { LikeUser } from '../services/likeServices';
interface Props {
  visible: boolean;
  onClose: () => void;
  resourceId?: number;
  resourceType?: string;
}

export function LikeUsersModal({ visible, onClose, resourceType, resourceId }: Props) {
  const { colors } = useTheme();
  const { users, loading, isError } = useLikeUsers(resourceId, resourceType, visible);
  const { t } = useTranslation();

  const handleUserPress = (username: string) => {
    onClose();
    router.push({
      pathname: 'details/user/',
      params: {
        username,
        from: 'details',
      },
    });
  };

  const renderUser = ({ item }: { item: LikeUser }) => (
    <TouchableOpacity
      className="flex-row items-center gap-3 rounded-lg p-3"
      activeOpacity={0.7}
      onPress={() => handleUserPress(item.username)}>
      {item.avatar_url ? (
        <Image source={{ uri: item.avatar_url }} className="h-12 w-12 rounded-full" />
      ) : (
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primary }}>
          <AppText className="font-bold" style={{ color: colors.primaryText, fontSize: 18 }}>
            {item.username.charAt(0).toUpperCase()}
          </AppText>
        </View>
      )}

      <AppText className="flex-1 font-semibold" style={{ color: colors.primaryText, fontSize: 16 }}>
        {item.username}
      </AppText>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: `${colors.background}80` }}
        onPress={onClose}>
        <Pressable
          className="max-h-[60%] w-full rounded-t-3xl p-6 shadow-2xl"
          style={{ backgroundColor: colors.surfaceButton }}
          onPress={(e) => e.stopPropagation()}>
          <AppText className="mb-4 font-bold" style={{ color: colors.primaryText, fontSize: 20 }}>
            {t('details.likedBy')}
          </AppText>

          {loading ? (
            <View className="h-20">
              <LoadingIndicator />
            </View>
          ) : isError ? (
            <AppText className="p-4 text-center" style={{ color: colors.error, fontSize: 14 }}>
              {t('common.error')}
            </AppText>
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={renderUser}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <View className="items-center p-4">
                  <AppText style={{ color: colors.primaryText, fontSize: 18 }}>
                    {t('details.noLikes')}
                  </AppText>
                  <AppText
                    className="mt-1 text-center"
                    style={{ color: colors.secondaryText, fontSize: 14 }}>
                    {t('details.noLikesDescription')}
                  </AppText>
                </View>
              }
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
