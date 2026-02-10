import { View, Text } from "react-native"
import { useTheme } from "context/ThemeContext"
import { CalendarIcon } from "components/Icons"
import { colorScheme } from "react-native-css-interop"

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
                    <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Última vez</Text>
                </View>
                <View className='flex-row items-baseline'>
                    <Text className='text-base ml-3' style={{ color: colors.secondaryText}}>
                    {formatDate(startDate)}
                    </Text>
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
                    <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.markerText }}>INICIO</Text>
                </View>
                <View>
                    <Text className="text-md font-semibold" style={{ color: colors.primaryText }}>
                        {formatDate(startDate)}
                    </Text>
                </View>
            </View>
            {/* CARD 5: Fecha Fin (48% width) */}
            <View className="flex-1 p-4 rounded-2xl space-y-2" style={{ backgroundColor: colors.surfaceButton }}>
                <View className="flex-row items-center gap-2">
                    <CalendarIcon/>
                    <Text className="text-sm font-bold uppercase tracking-widest" style={{ color: colors.markerText }}>FIN</Text>
                </View>
                <View>
                    <Text className="text-md font-semibold" style={{ color: colors.primaryText }}>
                        {formatDate(endDate)}
                    </Text>
                </View>
            </View>
        </View>
    )
}