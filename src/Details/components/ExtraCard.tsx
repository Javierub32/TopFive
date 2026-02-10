import { useTheme } from "context/ThemeContext";
import { Text, View } from "react-native";
import { iconAdapter } from "src/Details/adapter/iconAdapter"

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

    const Icono = iconAdapter.getIcon(type);


    return(
        <View 
        className="justify-between rounded-2xl p-4 gap-2"
        style={{ backgroundColor: colors.surfaceButton }}>
            <View className="flex-row items-center gap-2">
                <Icono/>
                <Text className="text-sm font-bold uppercase tracking-widest"
                style={{ color: colors.markerText }}>
                Modos de Juego
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