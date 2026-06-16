import { View, Text } from "react-native"
import { useTheme } from "context/ThemeContext"
import { CalendarIcon } from "components/Icons"
import { colorScheme } from "react-native-css-interop"
import {AppText} from 'components/AppText';
interface Props {
    startDate : string | Date | null | undefined
    endDate? : string | Date | null | undefined
    isRange : boolean
}

export const DateCard = ({startDate, endDate, isRange} : Props) => {

    const { colors } = useTheme();

    const formatDate = (fecha : string | Date | null | undefined) => {
        if (!fecha) return '-'

        return new Date(fecha).toLocaleDateString('es-ES', {
            day : 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    if(!isRange) {
        return(
            <View className='flex-1 p-4 rounded-2xl flex justify-between gap-2' style={{backgroundColor: `${colors.primary}1A`}}>
                <View className='flex-row items-center gap-2'>
                    <CalendarIcon color={colors.primary}/>
                    <AppText className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Última vez</AppText>
                </View>
                <View className='flex-row items-baseline'>
                    <AppText className='text-base ml-3' style={{ color: colors.secondaryText}}>
                    {formatDate(startDate)}
                    </AppText>
                </View>
            </View>
        )
    }

    return(     
        <View className="flex-row gap-2">
        {/* CARD 4: Fecha Inicio (48% width) */}
            <View className="flex-1 p-4 rounded-2xl space-y-2" style={{ backgroundColor: colors.surfaceButton }}>
                <View className="flex-row items-center gap-2">
                    <CalendarIcon/>
                    <AppText className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.markerText }}>INICIO</AppText>
                </View>
                <View>
                    <AppText className="text-md font-semibold" style={{ color: colors.primaryText }}>
                        {formatDate(startDate)}
                    </AppText>
                </View>
            </View>
            {/* CARD 5: Fecha Fin (48% width) */}
            <View className="flex-1 p-4 rounded-2xl space-y-2" style={{ backgroundColor: colors.surfaceButton }}>
                <View className="flex-row items-center gap-2">
                    <CalendarIcon/>
                    <AppText className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.markerText }}>FIN</AppText>
                </View>
                <View>
                    <AppText className="text-md font-semibold" style={{ color: colors.primaryText }}>
                        {formatDate(endDate)}
                    </AppText>
                </View>
            </View>
        </View>
    )
}