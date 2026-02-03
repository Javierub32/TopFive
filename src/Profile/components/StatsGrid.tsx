import { useTheme } from 'context/ThemeContext';
import { View, Text } from 'react-native';

interface Props {
  title: string;
  total: number;
  average: number;
}

export const StatsGrid = ({ title, total, average }: Props) => {
  const { colors } = useTheme();

  return (
    <View className="mb-2 flex-row px-1">
      <View className="mx-2 my-2 flex-1 rounded-xl border-2 p-5" style={{borderColor: colors.borderButton, backgroundColor: colors.surfaceButton}}>
        <Text className="mb-3 text-xl" style={{ color: colors.title }}>{title}</Text>
        <View className="flex-1 justify-end">
          <Text className="text-right text-2xl" style={{ color: colors.primaryText }}>{total}</Text>
        </View>
      </View>
      <View className="mx-2 my-2 flex-1 rounded-xl border-2 p-5" style={{borderColor: colors.borderButton, backgroundColor: colors.surfaceButton}}>
        <Text className="mb-3 text-xl" style={{ color: colors.title }}>Promedio/Mes</Text>
        <View className="flex-1 justify-end">
          <Text className="text-right text-2xl" style={{ color: colors.primaryText }}>{average}</Text>
        </View>
      </View>
    </View>
  );

};