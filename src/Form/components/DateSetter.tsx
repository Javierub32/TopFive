import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarEndIcon, CalendarIcon, CalendarStartIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext"
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { transparent } from "tailwindcss/colors";

interface Props {
    resource: any,
    isRange: boolean
}

export const DateSetter = ({resource, isRange}: Props) => {
    const { colors } = useTheme();
    const [fechaInicio, setFechaInicio] = useState<Date | null>(resource?.fechaInicio ? new Date(resource.fechaInicio) : null);
    const [fechaFin, setFechaFin] = useState<Date | null>(resource?.fechaFin ? new Date(resource.fechaFin) : null);
    const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
    const [showDatePickerFin, setShowDatePickerFin] = useState(false);
      

    if (!isRange) {
        return (
            <View className='flex-1 mx-4'>
                <TouchableOpacity className='flex-1 rounded-2xl flex justify-between gap-2 p-4' 
                style={{backgroundColor: `${colors.primary}1A`}}
                onPress={() => setShowDatePickerInicio(true)}>
                    <View className='flex-row items-center gap-2'>
                        <CalendarIcon/>
                        <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Ultima Vez</Text>
                    </View>
                    <View className='flex-row justify-center'>
                        <Text className="text-sm font-bold p-4" style={{color: colors.primaryText}}>
                            {fechaInicio
                            ? fechaInicio.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                })
                            : 'Sin fecha'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFechaInicio(null)} disabled={!fechaInicio}
                className="mt-2 items-center">
                    <Text className="text-xs" style={fechaInicio? {color: colors.error} : {color: colors.background}}>Limpiar fecha</Text>
                </TouchableOpacity>

                {showDatePickerInicio && (
                    <DateTimePicker
                        value={fechaInicio || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(_event: any, selectedDate?: Date) => {
                        setShowDatePickerInicio(Platform.OS === 'ios');
                        if (selectedDate) {
                            setFechaInicio(selectedDate);
                        }
                        }}
                        maximumDate={new Date()}
                    />
                )}
            </View>
        )
    }

    return ( 
        <View className="px-4 pt-2 flex-row gap-2">
            <View className="flex-1">
                <TouchableOpacity className='flex-1 p-4 rounded-2xl flex justify-between gap-2' 
                style={{backgroundColor: `${colors.primary}1A`}}
                onPress={() => setShowDatePickerInicio(true)}>
                    <View className='flex-row items-center gap-2'>
                        <CalendarStartIcon/>
                        <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Fecha Inicio</Text>
                    </View>
                    <View className='flex-row justify-center'>
                        <Text className="text-sm font-bold text-primaryText">
                            {fechaInicio
                            ? fechaInicio.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                })
                            : 'Sin fecha'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFechaInicio(null)} disabled={!fechaInicio}
                className="mt-1 items-center">
                    <Text className="text-xs" style={fechaInicio? {color: colors.error} : {color: colors.background}}>Limpiar fecha</Text>
                </TouchableOpacity>
            </View>            

            <View className="flex-1">
                <TouchableOpacity className='flex-1 p-4 rounded-2xl flex justify-between gap-2' 
                style={{backgroundColor: `${colors.primary}1A`}}
                onPress={() => setShowDatePickerFin(true)}>
                    <View className='flex-row items-center gap-2'>
                        <CalendarEndIcon/>
                        <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Fecha Fin</Text>
                    </View>
                    <View className='flex-row justify-center'>
                        <Text className="text-sm font-bold text-primaryText">
                            {fechaFin
                            ? fechaFin.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                })
                            : 'Sin fecha'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFechaFin(null)} disabled={!fechaFin}
                className="mt-1 items-center">
                    <Text className="text-xs" style={fechaFin ? {color: colors.error} : {color: colors.background}}>Limpiar fecha</Text>
                </TouchableOpacity>
            
            </View>

            {showDatePickerInicio && (
                <DateTimePicker
                    value={fechaInicio || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_event: any, selectedDate?: Date) => {
                    setShowDatePickerInicio(Platform.OS === 'ios');
                    if (selectedDate) {
                        setFechaInicio(selectedDate);
                    }
                    }}
                    maximumDate={new Date()}
                />
            )}

            {showDatePickerFin && (
                <DateTimePicker
                    value={fechaFin || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_event: any, selectedDate?: Date) => {
                    setShowDatePickerFin(Platform.OS === 'ios');
                    if (selectedDate) {
                        setFechaFin(selectedDate);
                    }
                    }}
                    maximumDate={new Date()}
                />
            )}




        </View>
        
    )
}