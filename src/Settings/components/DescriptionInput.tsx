import { useTheme } from 'context/ThemeContext';
import { Text, TextInput, View } from 'react-native';

interface DescriptionInputProps {
  description: string;
  onChange: (text: string) => void;
  title?: string;
  placeholder?: string;
  numberOfLines?: number;
  maxLength?: number;
}

export const FormInput = ({
  description,
  onChange,
  title = 'Descripción',
  placeholder = "Escribe tu opinión sobre el libro...",
  numberOfLines = 4,
  maxLength = 500,
}: DescriptionInputProps)  => {
  const { colors } = useTheme();
  return (
    <View>
      <Text className="mb-3 text-lg font-semibold text-primaryText">{title}</Text>
      <TextInput
        value={description}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholderText}
        multiline
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        className="min-h-[100px] rounded-lg border border-borderButton bg-surfaceButton p-3 text-base text-primaryText"
        textAlignVertical="top"
      />
      <Text className="mt-1 text-right text-xs text-secondaryText">{description.length}/{maxLength}</Text>
    </View>
  );
};
