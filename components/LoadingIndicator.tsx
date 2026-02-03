
import { useTheme } from 'context/ThemeContext';
import { ActivityIndicator, View } from 'react-native';

export const LoadingIndicator = () => {
  const { colors } = useTheme();
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator
        size="large"
        color={colors.secondary}
        className="flex-1 items-center justify-center"
      />
    </View>
  );
};
