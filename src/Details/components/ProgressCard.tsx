import { View, Text } from 'react-native';
import { useTheme } from 'context/ThemeContext';
import { ProgressIcon } from 'components/Icons';

interface Props {
  progress: string | number;
  unit?: string;
}

export const ProgressCard = ({ progress, unit }: Props) => {
  const { colors } = useTheme();

  const splitProgress = () =>{
    if((typeof progress) === "string") {
        return progress.split('-',2);
    }
    return '-'
  }

  if (!!unit) {
    return (
      <View
        className="flex flex-1 justify-between gap-2 rounded-2xl p-4"
        style={{ backgroundColor: `${colors.primary}1A` }}>
        <View className="flex-row items-center gap-2">
          <ProgressIcon />
          <Text
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: colors.markerText }}>
            Progreso
          </Text>
        </View>
        <View className="flex-row items-baseline">
          <Text className="text-xl font-bold" style={{ color: colors.primaryText }}>
            {progress || 0}
          </Text>
          <Text className="ml-1 text-xs" style={{ color: colors.markerText }}>
            {unit}
          </Text>
        </View>
      </View>
    );
  }

  const newProgress = splitProgress();
  return (
    <View
      className="flex flex-1 justify-between gap-2 rounded-2xl p-4"
      style={{ backgroundColor: `${colors.primary}1A` }}>
      <View className="flex-row items-center gap-2">
        <ProgressIcon />
        <Text
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: colors.markerText }}>
          Progreso
        </Text>
      </View>
      <View className="flex-row items-baseline">
        <Text className="text-xl font-bold" style={{ color: colors.primaryText }}>
          T{newProgress[0]} - E{newProgress[1]}
        </Text>
      </View>
    </View>
  );
};
