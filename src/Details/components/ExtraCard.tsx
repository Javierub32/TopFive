import { useTheme } from "context/ThemeContext";
import { Text, View } from "react-native";
import { extraAdapter } from "@/Details/adapter/extraAdapter"
import {AppText} from 'components/AppText';

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
                <AppText className="text-sm font-bold uppercase tracking-widest"
                style={{ color: colors.markerText }}>
                    {extraTitle}
                </AppText>
            </View>
            <View className="flex-1 justify-center items-center">
                <AppText className="text-base font-semibold" style={{ color: colors.secondaryText}}>
                    {extraText}
                </AppText>
            </View>
        </View>
    )

}