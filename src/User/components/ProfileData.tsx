import { View, Pressable } from 'react-native';
import { ReactNode } from 'react';
import { router } from 'expo-router';
import { useTheme } from 'context/ThemeContext';
import { AppText } from 'components/AppText';
import { useTranslation } from 'react-i18next';
interface Props {
  children: ReactNode;
  username: string;
  description?: string;
  followersCount: number;
  followingCount: number;
  reviewsCount: number;
  showStats?: boolean;
  showDescription?: boolean;
  disableSocialNavigation?: boolean;
}

export function ProfileData({
  children,
  username,
  description,
  followersCount,
  followingCount,
  reviewsCount,
  showStats = true,
  showDescription = true,
  disableSocialNavigation = false,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="p-4 pb-1">
      {/* Se le pasa por props el avatar porque así podemos mostrar las estadísticas del usuario tanto con el perfil (puede actualizar su foto), como en la página de búsqueda (no se permite modificar la foto de otros usuarios) */}
      <View className="flex-row items-center">
        <View className="mb-4 items-center justify-center justify-self-start">{children}</View>
        {(showStats || (showDescription && !!description)) && (
          <View className="ml-4 flex-1">
            {showStats && (
              <View className="mb-4 flex-row items-center justify-around">
                <View className="mr-4 items-center">
                  <AppText className=" font-bold" style={{ color: colors.primaryText, fontSize: 14 }}>
                    {reviewsCount}
                  </AppText>
                  <AppText style={{ color: colors.secondaryText, fontSize: 10 }}>
                    {t('profile.reviews')}
                  </AppText>
                </View>
                <View className="mr-4 items-center">
                  <Pressable
                    disabled={disableSocialNavigation}
                    onPress={() => {
                      router.push(`/followers?username=${username}&page=followers`);
                    }}
                    className="items-center">
                    <AppText className=" font-bold" style={{ color: colors.primaryText, fontSize: 14 }}>
                      {followersCount}
                    </AppText>
                    <AppText style={{ color: colors.secondaryText, fontSize: 10 }}>
                      {t('profile.followers')}
                    </AppText>
                  </Pressable>
                </View>
                <View className="items-center">
                  <Pressable
                    disabled={disableSocialNavigation}
                    onPress={() => {
                      router.push(`/followers?username=${username}&page=following`);
                    }}
                    className="items-center">
                    <AppText className=" font-bold" style={{ color: colors.primaryText, fontSize: 14 }}>
                      {followingCount}
                    </AppText>
                    <AppText style={{ color: colors.secondaryText, fontSize: 10 }}>
                      {t('profile.following')}
                    </AppText>
                  </Pressable>
                </View>
              </View>
            )}

            {showDescription && description && (
              <AppText className="leading-tight" style={{ color: colors.secondaryText, fontSize: 12 }}>
                {description}
              </AppText>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
