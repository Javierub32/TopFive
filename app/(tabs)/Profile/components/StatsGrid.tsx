import { View, Text } from 'react-native';

interface Props {
  title: string;
  total: number;
  average: number;
}

export const StatsGrid = ({ title, total, average }: Props) => (
  <View className="mb-2 flex-row px-1">
    <View className="mx-2 my-2 flex-1 rounded-xl border-2 border-slate-700 bg-gray-800 p-5">
      <Text className="mb-3 text-xl text-purple-400">{title}</Text>
      <View className="flex-1 justify-end">
        <Text className="text-right text-2xl text-white">{total}</Text>
      </View>
    </View>
    <View className="mx-2 my-2 flex-1 rounded-xl border-2 border-slate-700 bg-gray-800 p-5">
      <Text className="mb-3 text-xl text-purple-400">Promedio/Mes</Text>
      <View className="flex-1 justify-end">
        <Text className="text-right text-2xl text-white">{average}</Text>
      </View>
    </View>
  </View>
);