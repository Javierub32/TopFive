import { useEffect, type PropsWithChildren } from 'react';
import { Linking, Platform, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'context/ThemeContext';
import { Screen } from 'components/Screen';
import { AppText } from 'components/AppText';
import { useAppVersion } from '../hooks/useAppVersion';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { SplashScreen } from 'expo-router';

type StartupGateMessageProps = {
  title: string;
  description: string;
  buttonLabel?: string;
  onPress?: () => void;
};

const StartupGateMessage = ({
  title,
  description,
  buttonLabel,
  onPress,
}: StartupGateMessageProps) => {
  const { colors } = useTheme();

  return (
    <Screen>
      <View className="flex-1 items-center justify-center px-6">
        <AppText
          className="mb-3 text-center font-bold"
          style={{ color: colors.primaryText, fontSize: 24 }}>
          {title}
        </AppText>

        <AppText className="text-center" style={{ color: colors.secondaryText, fontSize: 16 }}>
          {description}
        </AppText>

        {buttonLabel && onPress && (
          <TouchableOpacity
            className="mt-6 rounded-xl px-5 py-3"
            style={{ backgroundColor: colors.surfaceButton }}
            onPress={onPress}>
            <AppText
              className="text-center font-bold"
              style={{ color: colors.accent, fontSize: 16 }}>
              {buttonLabel}
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </Screen>
  );
};

export const StartupGate = ({ children }: PropsWithChildren) => {
  const { t, i18n } = useTranslation();
  const { appVersion, isLoading, error, refetch, compareVersions } = useAppVersion({
    refetchOnMount: 'always',
  });
  const isAndroid = Platform.OS === 'android';
  const installedVersion = Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';
  const minimumVersion = isAndroid ? appVersion?.min_version_android : appVersion?.min_version;
  const language = i18n.resolvedLanguage ?? i18n.language;
  const maintenanceMessage = language.toLowerCase().startsWith('es')
    ? appVersion?.maintenance_message_es
    : appVersion?.maintenance_message_en;
  const mustUpdate = Boolean(
    minimumVersion && compareVersions(installedVersion, minimumVersion) < 0
  );
  const shouldHideSplash =
    Platform.OS !== 'web' &&
    !isLoading &&
    (Boolean(error) || !appVersion || Boolean(appVersion.maintenance_enabled) || mustUpdate);

  useEffect(() => {
    if (shouldHideSplash) {
      void SplashScreen.hideAsync().catch((hideError) => {
        console.error('Error ocultando el splash screen:', hideError);
      });
    }
  }, [shouldHideSplash]);

  if (Platform.OS === 'web') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <Screen>
        <LoadingIndicator />
      </Screen>
    );
  }

  if (error || !appVersion) {
    return (
      <StartupGateMessage
        title={t('layout.startupErrorTitle')}
        description={t('layout.startupErrorDescription')}
        buttonLabel={t('common.retry')}
        onPress={() => void refetch()}
      />
    );
  }

  if (appVersion.maintenance_enabled) {
    return (
      <StartupGateMessage
        title={t('layout.maintenanceTitle')}
        description={maintenanceMessage ?? t('layout.maintenanceDescription')}
      />
    );
  }

  if (mustUpdate) {
    const storeUrl = isAndroid
      ? 'https://play.google.com/store/apps/details?id=com.leftjoiners.topfive'
      : 'https://apps.apple.com/es/app/topfive/id6761102319';

    return (
      <StartupGateMessage
        title={t('layout.updateRequiredTitle')}
        description={t('layout.updateRequiredDescription', {
          version: minimumVersion,
        })}
        buttonLabel={t('common.update')}
        onPress={() => void Linking.openURL(storeUrl)}
      />
    );
  }

  return <>{children}</>;
};
