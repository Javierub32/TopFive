import { useTheme } from 'context/ThemeContext';
import { Text, TextInput, View } from 'react-native';
import {AppText} from 'components/AppText';
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
      <AppText className="mb-3 text-lg font-semibold text-primaryText">{title}</AppText>
      <TextInput
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
        }}
      />
      <View className="flex-row justify-between">
        <AppText className="mt-1 text-left text-sm text-secondaryText"
            style={{ color: colors.error }}>
            {hasError ? 'El nombre de usuario ya está en uso.' : null}
        </AppText>
        <AppText className="mt-1 text-right text-xs text-secondaryText">{description.length}/{maxLength}</AppText>
      </View>
      
      
    </View>
  );
};
