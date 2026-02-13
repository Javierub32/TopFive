import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TimerIcon, TimesWatchedIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext"
import { ResourceType } from "hooks/useResource";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
    resource : any;
    type : ResourceType;
}

interface ProgressConfig {
    progressValue: string ;
    progressValue2?: string ;
    placeholderProgress: string;
    setProgressMethod: any;
    setProgresMethod2?: any;
}

export const ProgressSetter = ({resource, type} : Props) => {
    const { colors } = useTheme();

    const [paginasLeidas, setPaginasLeidas] = useState(resource?.paginasLeidas?.toString() || '' );
    const [horasJugadas, setHorasJugadas] = useState(resource?.horasJugadas?.toString() || '');
    const [temporadaActual, setTemporadaActual] = useState(resource?.temporadaActual?.toString() || 0);
    const [episodioActual, setEpisodioActual] = useState(resource?.episodioActual?.toString() || 0);

    const ProgressMap : Record<ResourceType, ProgressConfig | null> = {
        serie: {progressValue: temporadaActual, progressValue2: episodioActual, placeholderProgress: '', setProgressMethod: setTemporadaActual, setProgresMethod2: setEpisodioActual},
        videojuego: {progressValue: horasJugadas, placeholderProgress: 'Horas jugadas...', setProgressMethod: setHorasJugadas},
        libro: {progressValue: paginasLeidas, placeholderProgress: 'Número de páginas...', setProgressMethod: setPaginasLeidas},
        pelicula: null,
        cancion: null
    }; 

    if(type == 'serie'){
        return ( 
            <View className="mx-4 flex-1 p-4 rounded-2xl flex justify-between gap-2" style={{backgroundColor: colors.surfaceButton}}>
                <View className="flex-row items-center gap-2">
                    <TimerIcon color={colors.primary}/>
                    <Text className="text-sm font-bold uppercase tracking-widest" style={{color: colors.markerText}}>Progreso</Text>
                </View>
                <View className="flex-row justify-between gap-6 pb-4">
                    <View className="flex-1 gap-1" style={{borderColor: colors.placeholderText}}>
                        <Text className="font-semibold text-center" style={{color: colors.secondaryText}}>Temporada Actual</Text>
                        <View className="flex-row justify-center gap-6">
                            <TouchableOpacity
                            onPress={() => setTemporadaActual(Math.max(0, temporadaActual - 1))}
                            className="rounded-lg p-2 items-center"
                            style= {{backgroundColor: colors.error}}>
                                <MaterialCommunityIcons name="minus" size={16} color="white" />
                            </TouchableOpacity>

                            <Text className="text-lg font-bold text-primaryText">{temporadaActual}</Text>

                            <TouchableOpacity
                                onPress={() => setTemporadaActual(temporadaActual + 1)}
                                className="rounded-lg p-2"
                                style={{backgroundColor: colors.success}}>
                                <MaterialCommunityIcons name="plus" size={16} color="white" />
                            </TouchableOpacity>
                        </View> 
                    </View>
                    <View className="flex-1 gap-1">
                        <Text className="font-semibold text-center" style={{color: colors.secondaryText}}>Episodio actual</Text>
                        <View className="flex-row justify-center gap-6">
                            <TouchableOpacity
                            onPress={() => setEpisodioActual(Math.max(0, episodioActual - 1))}
                            className="rounded-lg p-2 items-center"
                            style= {{backgroundColor: colors.error}}>
                                <MaterialCommunityIcons name="minus" size={16} color="white" />
                            </TouchableOpacity>

                            <Text className="text-lg font-bold text-primaryText">{episodioActual}</Text>

                            <TouchableOpacity
                                onPress={() => setEpisodioActual(episodioActual + 1)}
                                className="rounded-lg p-2"
                                style={{backgroundColor: colors.success}}>
                                <MaterialCommunityIcons name="plus" size={16} color="white" />
                            </TouchableOpacity>
                        </View> 
                    </View>
                </View>            
            </View>
        )
    }

    return ( 
        ProgressMap[type] && (
        <View className="px-4 pt-2">
            <TextInput
                value={ProgressMap[type]?.progressValue}
                onChangeText={(text) => {
                // Solo permitir números y limitar a 2000
                const numericText = text.replace(/[^0-9]/g, '');
                const num = parseInt(numericText) || 0;
                if (num <= 2000 || numericText === '') {
                    ProgressMap[type]?.setProgressMethod(numericText);
                }
                }}
                placeholder= {`${ProgressMap[type].placeholderProgress}`}
                placeholderTextColor={colors.placeholderText}
                keyboardType="numeric"
                maxLength={4}
                className="rounded-lg p-3 text-base"
                style={{backgroundColor: colors.surfaceButton, color: colors.primaryText}}
            />
        </View>
            )
    )
}