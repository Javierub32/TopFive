import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TimerIcon, TimesWatchedIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext"
import { ResourceType } from "hooks/useResource";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
    progress: any;
    setProgress: any;
    progressExtra?: any;
    setProgressExtra?: any;
    type : ResourceType;
}

interface ProgressConfig {
    progressValue: string ;
    progressValue2?: string ;
    placeholderProgress: string;
    setProgressMethod: any;
    setProgresMethod2?: any;
}

export const ProgressSetter = ({progress, setProgress, progressExtra, setProgressExtra, type} : Props) => {
    const { colors } = useTheme();

    const PlaceholderMap : Record<ResourceType, string> = {
        serie: '',
        videojuego: 'Horas jugadas...',
        libro: 'Páginas leídas...',
        pelicula: '',
        cancion: '',
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
                        <View className="flex-row justify-center items-center gap-3">
                            <TouchableOpacity
                            onPress={() => setProgress(Math.max(0, progress - 1))}
                            className="rounded-lg p-2 items-center">
                                <MaterialCommunityIcons name="minus" size={16} color={colors.error} />
                            </TouchableOpacity>

                            <TextInput
                                value={(progress || 1).toString()} onChangeText={(text) => {
                                    const numericText = text.replace(/[^0-9]/g, '');
                                    const num = parseInt(numericText) || 0;
                                    if (num <= 50 || numericText === '') {
                                        setProgress(numericText)
                                    }}}
                                keyboardType="numeric"
                                maxLength={4}
                                className="w-12 text-center text-lg font-bold border-b pb-0"                                
                                style={{color: colors.primaryText, borderBottomColor: colors.placeholderText}}
                            />

                            <TouchableOpacity
                                onPress={() => setProgress(progress + 1)}
                                className="rounded-lg p-2">
                                <MaterialCommunityIcons name="plus" size={16} color={colors.success} />
                            </TouchableOpacity>
                        </View> 
                    </View>
                    <View className="flex-1 gap-1">
                        <Text className="font-semibold text-center" style={{color: colors.secondaryText}}>Episodio actual</Text>
                        <View className="flex-row justify-center items-center gap-3">
                            <TouchableOpacity
                            onPress={() => setProgressExtra(Math.max(0, progressExtra - 1))}
                            className="rounded-lg p-2 items-center">
                                <MaterialCommunityIcons name="minus" size={16} color={colors.error} />
                            </TouchableOpacity>

                            <TextInput
                                value={(progressExtra || 1).toString()} onChangeText={(text) => {
                                    const numericText = text.replace(/[^0-9]/g, '');
                                    const num = parseInt(numericText) || 0;
                                    if (num <= 50 || numericText === '') {
                                        setProgressExtra(numericText)
                                    }}}
                                keyboardType="numeric"
                                maxLength={4}
                                className="w-12 text-center text-lg font-bold border-b pb-0"  
                                style={{color: colors.primaryText, borderBottomColor: colors.placeholderText}}
                            />


                            <TouchableOpacity
                                onPress={() => setProgressExtra(progressExtra + 1)}
                                className="rounded-lg p-2">
                                <MaterialCommunityIcons name="plus" size={16} color={colors.success} />
                            </TouchableOpacity>
                        </View> 
                    </View>
                </View>            
            </View>
        )
    }

    return ( 
        type && (
        <View className="px-4 pt-2">
            <TextInput
                value={progress}
                onChangeText={(text) => {
                // Solo permitir números y limitar a 2000
                const numericText = text.replace(/[^0-9]/g, '');
                const num = parseInt(numericText) || 0;
                if (num <= 2000 || numericText === '') {
                    setProgress(numericText);
                }
                }}
                placeholder= {`${PlaceholderMap[type]}`}
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