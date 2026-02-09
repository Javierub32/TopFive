import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { LeftArrowIcon } from './Icons';
import { useTheme } from 'context/ThemeContext';

interface ReturnButtonProps {
  route: string;
  title: string;
  style?: string;
  params?: Record<string, any>;
}

export const ReturnButton = ({ route, title, style, params }: ReturnButtonProps) => {
  const { colors } = useTheme();
  style = style ? style : 'px-4 pt-5 pb-2';
  return (
    <View className={`flex-row items-center ${style}`}>
      <TouchableOpacity
        onPress={() => route == 'back' ? router.back() : router.push({ pathname: route, params })}
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.accent}}
        activeOpacity={0.7}>
        <LeftArrowIcon color={colors.background} />
      </TouchableOpacity>
      <Text className="flex-1 text-xl font-bold" style={{ color: colors.primaryText }} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};
