import { View, TouchableOpacity } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { ScalableSearchIcon } from 'components/Icons';
import { AppTextInput } from 'components/AppTextInput';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
}

export function UserSearchBar({ value, onChangeText, onSearch }: SearchBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="relative z-50">
      <View
        className="h-14 flex-row items-center rounded-lg border shadow-lg"
        style={{ borderColor: colors.accent, backgroundColor: colors.surfaceButton }}>
        {/* Icono Lupa */}
        {
          <TouchableOpacity
            className="justify-center py-2 pl-3"
            onPress={onSearch}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <ScalableSearchIcon color={colors.secondaryText} />
          </TouchableOpacity>
        }

        {/* Input de texto */}
        <AppTextInput
          className="h-full flex-1 overflow-hidden px-3 text-base"
          style={{ color: colors.primaryText, lineHeight: 17, fontSize: 14 }}
          placeholder={t('search.userSearchBarPlaceholder')}
          placeholderTextColor={colors.placeholderText}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}
