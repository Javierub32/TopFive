import { FormInput } from '@/Settings/components/DescriptionInput';
import { useSettings } from '@/Settings/hooks/useSettings';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ReturnButton } from 'components/ReturnButton';
import { Screen } from 'components/Screen';
import { ProfileAvatar } from 'src/Profile/components/ProfileAvatar';
import { useProfile } from 'src/Profile/hooks/useProfile';
import { useTheme } from 'context/ThemeContext';
import { TouchableOpacity, View, Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from 'components/AppText';
import { useState, useRef, useEffect } from 'react';

export default function EditProfileScreen() {
  const { pickImage, userData } = useProfile();
  const {
    uname,
    udesc,
    uprivate, 
    setPrivate, 
    handleUsernameChange,
    setDescription,
    usernameAlreadyExists,
    handleSubmit,
    loading,
  } = useSettings(userData);
  
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Usar datos actualizados de userData (que se refrescan al volver del focus)
  const avatarUrlString = userData?.avatar_url;
  const frameString = userData?.frame || 'none';

  const slideAnim = useRef(new Animated.Value(uprivate ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: uprivate ? 1 : 0,
      duration: 200,
      useNativeDriver: false, 
    }).start();
  }, [uprivate]);

  const position = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  if (loading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  return (
    <Screen>
      <ReturnButton
        route={'back'}
        title={t('profile.editProfile.title')}
      />

      <View className="flex-col gap-2 px-6 py-4">
        <ProfileAvatar
          avatarUrl={avatarUrlString || null}
          onPickImage={pickImage}
          frame={frameString}
        />

        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => {
            router.push({
              pathname: '/frameSelector',
              params: { avatarUrl: avatarUrlString || '', currentFrame: frameString || 'none' },
            });
          }}>
          <AppText
            className="mb-3 mt-3 text-base font-bold"
            style={{ color: colors.primaryText, textAlign: 'center', fontSize: 18 }}>
            {t('settings.personalization.editPhoto')}
          </AppText>
        </TouchableOpacity>

        <FormInput
          description={uname}
          onChange={handleUsernameChange}
          title={t('profile.editProfile.username')}
          placeholder={t('profile.editProfile.usernamePlaceholder')}
          maxLength={20}
          numberOfLines={1}
          hasError={usernameAlreadyExists}
        />
        <FormInput
          description={udesc}
          onChange={setDescription}
          title={t('profile.editProfile.description')}
          placeholder={t('profile.editProfile.descriptionPlaceholder')}
          maxLength={110}
          numberOfLines={4}
        />
        
        <View className="flex-row items-center justify-between">
          <AppText
            className="font-semibold"
            style={{ fontSize: 16, color: colors.primaryText }}
          >
            {t('profile.editProfile.profileType')}
          </AppText>
        </View>

        <View
          className="relative flex-row mt-2 mb-2 rounded-full"
          style={{ backgroundColor: colors.surfaceButton, padding: 4 }}
        >
          <View className="absolute top-1 bottom-1 left-1 right-1">
            <Animated.View
              className="h-full rounded-full shadow-sm"
              style={{
                width: '50%',
                left: position,
                backgroundColor: colors.background,
              }}
            />
          </View>

          <TouchableOpacity
            className="z-10 flex-1 items-center justify-center py-2"
            activeOpacity={0.7}
            onPress={() => setPrivate(false)}
          >
            <AppText
              className="font-semibold"
              style={{ 
                fontSize: 14, 
                color: !uprivate ? colors.primaryText : colors.secondaryText 
              }}
            >
              {t('profile.editProfile.profilePublic')}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            className="z-10 flex-1 items-center justify-center py-2"
            activeOpacity={0.7}
            onPress={() => setPrivate(true)}
          >
            <AppText
              className="font-semibold"
              style={{ 
                fontSize: 14, 
                color: uprivate ? colors.primaryText : colors.secondaryText 
              }}
            >
              {t('profile.editProfile.profilePrivate')}
            </AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mt-2 w-full items-center rounded-xl py-3"
          style={{ backgroundColor: colors.primary }}
          onPress={() => handleSubmit(uname.trim(), udesc.trim(), uprivate)}>
          <AppText className="font-bold" style={{ color: colors.background, fontSize: 18 }}>
            {t('common.saveChanges')}
          </AppText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}