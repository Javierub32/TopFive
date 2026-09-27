import { forwardRef } from 'react';
import { View, Image } from 'react-native';
import { AppText } from 'components/AppText';
import { TopFiveItem } from 'src/Profile/services/topFiveServices';
import { useTheme } from 'context/ThemeContext';
import { ScalableRatingStarIcon } from 'components/Icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  username: string;
  topFiveItems: TopFiveItem[];
}

export const ShareProfileCard = forwardRef<View, Props>(function ShareProfileCard(
  { username, topFiveItems },
  ref
) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const firstRow = [1, 2, 3];
  const secondRow = [4, 5];

  const renderTopFiveItem = (position: number) => {
    const item = topFiveItems.find((topFiveItem) => topFiveItem.posicion === position);
    const imageUrl = item?.resourceData?.contenido?.imagenUrl;

    return (
      <View key={position} style={{ flexDirection: 'row' }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: 76, aspectRatio: 2 / 3, borderRadius: 8 }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: 76,
              aspectRatio: 2 / 3,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.surfaceButton,
            }}></View>
        )}
      </View>
    );
  };

  return (
    <View
      ref={ref}
      collapsable={false}
      style={{
        width: 360,
        height: 640,
        aspectRatio: 9 / 16,
        backgroundColor: colors.accent,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <LinearGradient
        colors={['#00587c', '#1b7589', '#369b99', '#52c4a6', '#69ecb6']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />

      <View
        style={{
          width: '100%',
          height: 480,
          borderRadius: 28,
          paddingHorizontal: 24,
          paddingVertical: 24,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: `${colors.background}B3`,
        }}>
        <View style={{ gap: 8 }}>
          <AppText style={{ color: colors.primaryText, fontWeight: 'bold', fontSize: 30 }}>
            {t('profile.myTopFive')}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
            }}>
            <ScalableRatingStarIcon size={20} />
            <ScalableRatingStarIcon size={20} />
            <ScalableRatingStarIcon size={20} />
            <ScalableRatingStarIcon size={20} />
            <ScalableRatingStarIcon size={20} />
          </View>
        </View>
        <View style={{ gap: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 12,
            }}>
            {firstRow.map((position) => renderTopFiveItem(position))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 12,
            }}>
            {secondRow.map((position) => renderTopFiveItem(position))}
          </View>
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}>
            <Image
              source={require('../../../assets/icon.png')}
              style={{
                width: 24,
                height: 24,
                borderRadius: 8,
              }}
              resizeMode="contain"
            />
            <AppText style={{ color: colors.primaryText, fontSize: 14 }}>
              {t('common.appName')}
            </AppText>
          </View>
          <AppText style={{ color: colors.primaryText, fontSize: 14 }}>{`@${username}`}</AppText>
        </View>
      </View>
    </View>
  );
});
