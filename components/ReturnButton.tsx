import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { LeftArrowIcon } from './Icons';

interface ReturnButtonProps {
  route: string;
  title: string;
}

export const ReturnButton = ({ route, title }: ReturnButtonProps) => {
  return (
    <View className="flex-row items-center px-4 pb-4 pt-2">
      <TouchableOpacity
        onPress={() => route == 'back' ? router.back() : router.push(route)}
        className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-borderButton bg-surfaceButton"
        activeOpacity={0.7}>
        <LeftArrowIcon />
      </TouchableOpacity>
      <Text className="flex-1 text-xl font-bold text-primaryText" numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};
