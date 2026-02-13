import { useTheme } from "context/ThemeContext"
import { useState } from "react";
import { StateType } from "hooks/useResource";
import { View, TouchableOpacity, Text } from "react-native";

interface Props {
    resource : any
    inProgressLabel?: string}

export const StateSetter = ({resource, inProgressLabel} : Props) => {
    const { colors } = useTheme();
    const [estado, setEstado] = useState<'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO'>(resource?.estado || 'COMPLETADO');
    const options: StateType[] = ['PENDIENTE'];

    if(inProgressLabel) {
        options.push('EN_CURSO');
    }

    options.push('COMPLETADO');

    const getLabel = (estado: StateType) => {
        switch (estado) {
            case 'PENDIENTE': return 'Pendiente';
            case 'COMPLETADO' : return 'Completado';
            case 'EN_CURSO': return inProgressLabel;
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
        case 'PENDIENTE': return colors.warning;
        case 'EN_CURSO': return colors.accent;
        case 'COMPLETADO': return colors.success;
        default: return colors.surfaceButton;
        }
    };

    return ( 
        <View className="flex-row px-4 pt-2 rounded-lg">
            {options.map((est) => {
                const isSelected = estado === est;
                    return ( 
                        <TouchableOpacity
                            key={est}
                            onPress={() => setEstado(est)}
                            className={`flex-1 py-3 ${est == options[0] ? 'rounded-l-lg': ''} ${est == options[options.length-1] ? 'rounded-r-lg': '' }`}
                            style = { isSelected ? {backgroundColor: `${getStatusColor(est)}1A`} : {backgroundColor: colors.surfaceButton}}
                            activeOpacity={0.7}
                        >
                            <Text className="text-center text-sm font-semibold" style={isSelected? {color: getStatusColor(est)} : {color: colors.secondaryText}}>
                                {getLabel(est)}
                            </Text>
                        </TouchableOpacity>
                    )
            })}
        </View>
    )
}