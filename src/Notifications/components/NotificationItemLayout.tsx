import { ReactNode } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { AppText } from 'components/AppText';

interface NotificationItemLayoutProps {
  imageUrl?: string | null;
  imageFallback?: ReactNode;
  highlight: string;
  textBefore?: string;
  textAfter?: string;
  subtitle?: string;
  onPress?: () => void;
  actions?: ReactNode;
  rounded?: boolean;
}

export function NotificationItemLayout({
  imageUrl,
  imageFallback,
  highlight,
  textBefore,
  textAfter,
  subtitle,
  onPress,
  actions,
  rounded = true,
}: NotificationItemLayoutProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center py-2">
      <TouchableOpacity
        className="flex-1 flex-row items-center px-1 py-3"
        onPress={onPress}
        activeOpacity={0.7}>
        <View className="mr-3">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className={`h-20 w-20 ${rounded ? 'rounded-full' : 'rounded-3xl'}`}
            />
          ) : (
            <View
              className="h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.surfaceButton }}>
              {imageFallback}
            </View>
          )}
        </View>

        <View className="flex-1">
          <AppText className="text-base" style={{ color: colors.primaryText, fontSize: 16 }}>
            {textBefore && <AppText className="font-normal">{textBefore}</AppText>}
            <AppText className="font-bold">{highlight}</AppText>
            {textAfter && <AppText className="font-normal">{textAfter}</AppText>}
          </AppText>
          {subtitle && (
            <AppText style={{ color: colors.secondaryText, fontSize: 12 }} numberOfLines={3}>
              {subtitle}
            </AppText>
          )}
        </View>
      </TouchableOpacity>

      {actions}
    </View>
  );
}
