import { View } from 'react-native';
import { useTheme } from 'context/ThemeContext';

interface Props {
  style?: object;
  className?: string;
}

export function SeparatorLine({ style, className }: Props) {
  const { colors } = useTheme();

  return (
    <View className={`mx-2 h-[1px] ${className}`} style={{ backgroundColor: colors.placeholderText, ...style }} />
  );
}