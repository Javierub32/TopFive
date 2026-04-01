import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { BackHandler, Text, TouchableOpacity, View } from 'react-native';
import { LeftArrowIcon } from './Icons';
import { useTheme } from 'context/ThemeContext';
import { useSearch } from 'context/SearchContext';
import { useCallback, useEffect, useRef } from "react";

interface ReturnButtonProps {
  route: string;
  title: string;
  style?: string;
  params?: Record<string, any>;
  deleteSearchResults?: boolean;
}

export const ReturnButton = ({ route, title, style, params, deleteSearchResults }: ReturnButtonProps) => {
  const { colors } = useTheme();
  const { clearUserSearch} = useSearch();
  const navigation = useNavigation();
  const isNavigating = useRef(false);


  const onBackPress = useCallback(() => {
    isNavigating.current = true
    if(route === 'back') {
      router.back();
    } else {
      router.navigate({pathname: route, params})
    }
    if(deleteSearchResults) {
      clearUserSearch();
    }
    return true
  }, [clearUserSearch, deleteSearchResults, params, route])

  useEffect(
    useCallback(() => {
      const action = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      const unsuscribe = navigation.addListener('beforeRemove', (e) => {
        if(!isNavigating.current && e.data.action.type === 'GO_BACK') {
          e.preventDefault();
          onBackPress();
        }
      })

      return () => {
        action.remove();
        unsuscribe()
      } 
    }, [onBackPress, navigation])
  );
  
  style = style ? style : 'px-4 pt-5 pb-2';
  return (
    <View className={`flex-row items-center ${style}`}>
      <TouchableOpacity
        onPress={onBackPress}
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
