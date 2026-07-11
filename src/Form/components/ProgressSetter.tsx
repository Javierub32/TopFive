import { ScalableTimerIcon, ScalableMaterialCommunityIcons } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { ResourceType } from 'hooks/useResource';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from 'components/AppText';
import { AppTextInput } from 'components/AppTextInput';
import { useTranslation } from 'react-i18next';
interface Props {
  progress: any;
  setProgress: any;
  progressExtra?: any;
  setProgressExtra?: any;
  type: ResourceType;
}

export const ProgressSetter = ({
  progress,
  setProgress,
  progressExtra,
  setProgressExtra,
  type,
}: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const PlaceholderMap: Record<ResourceType, string> = {
    serie: '',
    videojuego: t('forms.hoursPlayedPlaceholder'),
    libro: t('forms.pagesReadedPlaceholder'),
    pelicula: '',
    cancion: '',
  };

  if (type === 'serie') {
    return (
      <View
        className="mx-4 flex justify-between gap-2 rounded-2xl p-4"
        style={{ backgroundColor: colors.surfaceButton }}>
        <View className="flex-row items-center gap-2">
          <ScalableTimerIcon color={colors.primary} />
          <AppText
            className="font-bold uppercase tracking-widest"
            style={{ color: colors.markerText, fontSize: 14 }}>
            {t('details.progress')}
          </AppText>
        </View>
        <View className="flex-row justify-between gap-6 pb-4">
          <View className="flex-1 gap-1" style={{ borderColor: colors.placeholderText }}>
            <AppText className="text-center font-semibold" style={{ color: colors.secondaryText, fontSize: 14 }}>
              {t('forms.currentSeason')}
            </AppText>
            <View className="flex-row items-center justify-center gap-3">
              <TouchableOpacity
                onPress={() => setProgress(Math.max(0, (progress as number) - 1))}
                className="items-center rounded-lg p-2">
                <ScalableMaterialCommunityIcons name="minus" size={16} color={colors.error} />
              </TouchableOpacity>

              <AppTextInput
                value={(progress || 1).toString()}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  const num = parseInt(numericText) || 0;
                  if (num <= 50 || numericText === '') {
                    setProgress(numericText);
                  }
                }}
                keyboardType="numeric"
                maxLength={4}
                className="w-12 border-b pb-0 text-center text-lg font-bold"
                style={{ color: colors.primaryText, borderBottomColor: colors.placeholderText, fontSize: 14 }}
                selectTextOnFocus={true}
              />

              <TouchableOpacity
                onPress={() => setProgress(Number(progress) + 1)}
                className="rounded-lg p-2">
                <ScalableMaterialCommunityIcons name="plus" size={16} color={colors.success} />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-1 gap-1">
            <AppText className="text-center font-semibold" style={{ color: colors.secondaryText, fontSize: 14 }}>
              {t('forms.currentEpisode')}
            </AppText>
            <View className="flex-row items-center justify-center gap-3">
              <TouchableOpacity
                onPress={() => setProgressExtra(Math.max(0, (progressExtra as number) - 1))}
                className="items-center rounded-lg p-2">
                <ScalableMaterialCommunityIcons name="minus" size={16} color={colors.error} />
              </TouchableOpacity>

              <AppTextInput
                value={(progressExtra || 1).toString()}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  const num = parseInt(numericText) || 0;
                  if (num <= 9999 || numericText === '') {
                    setProgressExtra(numericText);
                  }
                }}
                keyboardType="numeric"
                maxLength={4}
                className="w-12 border-b pb-0 text-center text-lg font-bold"
                style={{ color: colors.primaryText, borderBottomColor: colors.placeholderText, fontSize: 14 }}
                selectTextOnFocus={true}
              />

              <TouchableOpacity
                onPress={() => setProgressExtra(Number(progressExtra) + 1)}
                className="rounded-lg p-2">
                <ScalableMaterialCommunityIcons name="plus" size={16} color={colors.success} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    type && (
      <View className="px-4 pt-2">
        <AppTextInput
          value={progress}
          onChangeText={(text) => {
            // Solo permitir números y limitar a 2000
            const numericText = text.replace(/[^0-9]/g, '');
            const num = parseInt(numericText) || 0;
            if (num <= 9999 || numericText === '') {
              setProgress(numericText);
            }
          }}
          placeholder={`${PlaceholderMap[type]}`}
          placeholderTextColor={colors.placeholderText}
          keyboardType="numeric"
          maxLength={4}
          className="rounded-lg p-3 text-base"
          style={{
            backgroundColor: colors.surfaceButton,
            color: colors.primaryText,
            lineHeight: 17,
            fontSize: 14,
          }}
        />
      </View>
    )
  );
};
