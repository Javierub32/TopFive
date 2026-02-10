import { useTheme } from "context/ThemeContext";
import { Text, View } from "react-native";
import { extraAdapter } from "@/Details/adapter/extraAdapter"

interface Props {
    extra : string[] | string | null;
    type : string;
}

export const ExtraCard = ({extra, type}: Props) => {
    const { colors } = useTheme();

    const getExtraText = () => {
        if (!!extra) {
            if (typeof extra === 'string') {
                return extra;
            }
            return extra.join(', ')
        }
        return null;     
    }

    const extraText = getExtraText();
    const extraTitle = extraAdapter.getTitle(type)
    const Icono = extraAdapter.getIcon(type);


    return(
        <View 
        className="justify-between rounded-2xl p-4 gap-2"
        style={{ backgroundColor: `${colors.accent}33` }}>
            <View className="flex-row items-center gap-2">
                <Icono color={colors.accent}/>
                <Text className="text-sm font-bold uppercase tracking-widest"
                style={{ color: colors.markerText }}>
                    {extraTitle}
                </Text>
            </View>
            <View className="flex-1 justify-center items-center">
                <Text className="text-base font-semibold" style={{ color: colors.secondaryText}}>
                    {extraText}
                </Text>
            </View>
        </View>
    )

}