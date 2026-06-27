import { useTheme } from 'context/ThemeContext';
import { Text, TextInput, View } from 'react-native';
import {AppText} from 'components/AppText';
import {AppTextInput} from 'components/AppTextInput';
interface DescriptionInputProps {
  description: string;
  onChange: (text: string) => void;
  title?: string;
  placeholder?: string;
  numberOfLines?: number;
  maxLength?: number;
  hasError?: boolean;
}

export const FormInput = ({
  description,
  onChange,
  title = 'Descripción',
  placeholder = "Escribe tu opinión sobre el libro...",
  numberOfLines = 1,
  maxLength = 10,
  hasError = false,
}: DescriptionInputProps)  => {
  const { colors } = useTheme();

  return (
    <View>
      <AppText className="mb-3 font-semibold text-primaryText" style={{ fontSize: 16 }}>{title}</AppText>
      <AppTextInput
        value={description}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholderText}
        multiline
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        className=" rounded-lg bg-surfaceButton p-3 text-base text-primaryText"
        textAlignVertical="top"
        style={{
          borderColor:  hasError ? colors.error : null,
          borderWidth: hasError ? 1 : 0,
          fontSize: 14,
        }}
      />
      <View className="flex-row justify-between">
        <AppText className="mt-1 text-left text-secondaryText"
            style={{ color: colors.error, fontSize: 14 }}>
            {hasError ? 'El nombre de usuario ya está en uso.' : null}
        </AppText>
        <AppText className="mt-1 text-right text-xs text-secondaryText" style={{ fontSize: 14 }}>
          {description.length}/{maxLength}
        </AppText>
      </View>
      
      
    </View>
  );
};
