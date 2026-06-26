import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TimesWatchedIcon } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from 'components/AppText';
import { AppTextInput } from 'components/AppTextInput';
import { useTranslation } from 'react-i18next';
interface Props {
  views: any;
  setViews: any;
}

export const ViewsSetter = ({ views, setViews }: Props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      className="mx-4 flex flex-1 gap-2 rounded-2xl p-4"
      style={{ backgroundColor: `${colors.accent}33` }}>
      <View className="flex-row items-center gap-2">
        <TimesWatchedIcon color={colors.accent} />
        <AppText
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: colors.markerText }}>
          {t('forms.views')}
        </AppText>
      </View>
      <View className="flex-1 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => setViews(Math.max(0, views - 1))}
          className="items-center rounded-lg p-2"
          style={{ backgroundColor: colors.accent }}>
          <MaterialCommunityIcons name="minus" size={16} color="white" />
        </TouchableOpacity>

        <AppTextInput
          value={(views || 0).toString()}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            const num = parseInt(numericText) || 0;
            if (num <= 50 || numericText === '') {
              setViews(numericText);
            }
          }}
          keyboardType="numeric"
          maxLength={4}
          className="w-12 border-b pb-0 text-center text-lg font-bold"
          style={{ color: colors.primaryText, borderBottomColor: colors.placeholderText }}
          selectTextOnFocus={true}
        />

        <TouchableOpacity
          onPress={() => setViews(views + 1)}
          className="rounded-lg p-2"
          style={{ backgroundColor: colors.accent }}>
          <MaterialCommunityIcons name="plus" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
