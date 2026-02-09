import { View, Text } from "react-native";
import { useTheme } from "context/ThemeContext";
import { ProgressIcon } from "components/Icons";

interface Props {
    progress: string | number;
    unit?: string;
}

export const ProgressCard = ({progress, unit}: Props) => {
    const { colors } = useTheme();

    return (
        <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2' style={{backgroundColor: `${colors.primary}1A`}}>
            <View className='flex-row items-center gap-2'>
                <ProgressIcon/>
                <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Progreso</Text>
            </View>
            <View className='flex-row items-baseline'>
                <Text className='text-xl font-bold' style={{color: colors.primaryText}}>
                {progress || 0}
                </Text>
                <Text className='text-xs ml-1' style={{color: colors.markerText}}>{unit}</Text>
            </View>
        </View>
    )
}