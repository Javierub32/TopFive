import { useTheme } from 'context/ThemeContext';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTopFive } from '../hooks/useTopFive';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { CategorySelectorModal } from 'components/CategorySelectorModal';
import { useAuth } from 'context/AuthContext';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
export const TopFiveSelector = ({ userId }: { userId: string }) => {
  const slots = Array.from({ length: 5 });
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    topFiveItems,
    loading,
    handlePress,
    handleCategorySelect,
    modalVisible,
    setModalVisible,
    handleLongPress,
  } = useTopFive(userId);

  const isOwnProfile = user?.id === userId;

  if (loading) {
    return (
      <View className="mb-4 flex items-center justify-center py-10">
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View className="mb-4 mt-4">
      <AppText className="mb-2 font-bold" style={{ color: colors.primaryText, fontSize: 18 }}>
        {t('profile.myTopFive')}
      </AppText>

      {/* Grid de Slots */}
      <View className="flex-row gap-2">
        {slots.map((_, index) => {
          const position = index + 1;
          const item = topFiveItems?.find((i: any) => i.posicion === position);
          const imageUrl = item?.resourceData?.contenido?.imagenUrl;

          if (!item) {
            return (
              <View
                key={`empty-slot-${position}`}
                className="flex-1 rounded-lg"
                style={{ backgroundColor: colors.surfaceButton }}>
                <TouchableOpacity
                  disabled={!isOwnProfile}
                  onPress={() => isOwnProfile && handlePress(position, item)}
                  onLongPress={() => isOwnProfile && handleLongPress(position, item)}
                  activeOpacity={0.7}>
                  <View
                    className="aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-lg border"
                    style={{
                      backgroundColor: colors.surfaceButton,
                      borderColor: colors.borderButton,
                    }}>
                    <AppText  style={{ color: colors.secondaryText, fontSize: 14 }}>
                      +
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <View
              key={`slot-${position}-${item.id || index}`}
              className="flex-1 rounded-lg"
              style={{ backgroundColor: colors.surfaceButton }}>
              <TouchableOpacity
                onPress={() => handlePress(position, item)}
                onLongPress={() => isOwnProfile && handleLongPress(position, item)}
                activeOpacity={0.7}>
                <View
                  className="aspect-[2/3] w-full items-center justify-center overflow-hidden rounded-lg "
                  style={{
                    backgroundColor: colors.surfaceButton,
                  }}>
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <AppText style={{ color: colors.secondaryText, fontSize: 14}}>Sin imagen</AppText>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <CategorySelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCategory={(category) => handleCategorySelect(category)}
      />
    </View>
  );
};
