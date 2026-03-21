import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarEndIcon, CalendarIcon, CalendarStartIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext"
import { useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";

interface Props {
    startDate: Date | null;
    setStartDate: any;
    endDate?: Date | null;
    setEndDate?: any;
    isRange: boolean;
	style?: string;
}

const PlatformDatePicker = ({show, setShow, date, setDate}: {show: boolean, setShow: any, date: Date | null, setDate: any}) => {
    const { colors } = useTheme();
    if(!show) return null

    if(Platform.OS === 'android') {
        return(
            <DateTimePicker 
                value={date || new Date()}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(event: any, selectedDate?: Date) => {
                    setShow(false);
                    if(event.type === 'set' && selectedDate) {
                        setDate(selectedDate)
                    }
                }
                }
            />
        )
    }

    return (
        <Modal visible={show} transparent={true} animationType="fade">
            <TouchableOpacity 
                className="flex-1 justify-end" 
                style={{backgroundColor: `${colors.background}80`}}
                activeOpacity={1} 
                onPress={() => setShow(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className="pb-8 pt-4 rounded-t-3xl shadow-lg flex-col" 
                    style={{backgroundColor: colors.background}}
                >
                    <View className="flex-row justify-end px-6 mb-2">
                        <TouchableOpacity onPress={() => {
                            if(!date) {
                                setDate(new Date());
                            }
                            setShow(false)}
                        }>
                            <Text className="font-bold text-lg" style={{color: colors.primary}}>
                                Listo
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="items-center">
                        <DateTimePicker
                            value={date || new Date()}
                            mode="date"
                            display="spinner"
                            maximumDate={new Date()}
                            onChange={(_event: any, selectedDate?: Date) => {
                                if (selectedDate) {
                                    setDate(selectedDate);
                                }
                            }}
                        />
                    </View>
                    
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}

export const DateSetter = ({startDate, setStartDate, endDate, setEndDate, isRange, style}: Props) => {
    const { colors } = useTheme();

    const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
    const [showDatePickerFin, setShowDatePickerFin] = useState(false);

    if (!isRange) {
        return (
            <View className={`${style}`}>
                <TouchableOpacity className='p-2 rounded-2xl flex justify-between gap-2' 
                style={{backgroundColor: `${colors.primary}1A`}}
                onPress={() => setShowDatePickerInicio(true)}>
                    <View className='flex-row items-center gap-2 p-1'>
                        <CalendarIcon/>
                        <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Ultima Vez</Text>
                    </View>
                    <View className='flex-row justify-center'>
                        <Text className="text-sm font-bold p-3" style={{color: colors.primaryText}}>
                            {startDate
                            ? startDate.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                })
                            : 'Sin fecha'}
                        </Text>
                    </View>
                </TouchableOpacity>
                {startDate && (
                    <TouchableOpacity onPress={() => setStartDate(null)}
                    className="mt-1 items-center">
                        <Text className="text-xs" style={{color: colors.error}}>Limpiar fecha</Text>
                    </TouchableOpacity>
                )}                

                <PlatformDatePicker 
                    show={showDatePickerInicio} 
                    setShow={setShowDatePickerInicio} 
                    date={startDate} 
                    setDate={setStartDate}
                />
            </View>
        )
    }

    return ( 
        <View className={`px-4 pt-2 flex-row gap-2 ${style}`}>
            <View className="flex-1">
                <TouchableOpacity className='p-4 rounded-2xl flex justify-between gap-2' 
                style={{backgroundColor: `${colors.primary}1A`}}
                onPress={() => setShowDatePickerInicio(true)}>
                    <View className='flex-row items-center gap-2'>
                        <CalendarStartIcon/>
                        <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Fecha Inicio</Text>
                    </View>
                    <View className='flex-row justify-center'>
                        <Text className="text-sm font-bold text-primaryText">
                            {startDate
                            ? startDate.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                })
                            : 'Sin fecha'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStartDate(null)} disabled={!startDate}
                className="mt-1 items-center">
                    <Text className="text-xs" style={startDate? {color: colors.error} : {color: colors.background}}>Limpiar fecha</Text>
                </TouchableOpacity>
            </View>            

            <View className="flex-1">
                <TouchableOpacity className='p-4 rounded-2xl flex justify-between gap-2' 
                style={{backgroundColor: `${colors.primary}1A`}}
                onPress={() => setShowDatePickerFin(true)}>
                    <View className='flex-row items-center gap-2'>
                        <CalendarEndIcon/>
                        <Text className='text-sm font-bold uppercase tracking-widest' style={{color: colors.markerText}}>Fecha Fin</Text>
                    </View>
                    <View className='flex-row justify-center'>
                        <Text className="text-sm font-bold text-primaryText">
                            {endDate
                            ? endDate.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                })
                            : 'Sin fecha'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEndDate(null)} disabled={!endDate}
                className="mt-1 items-center">
                    <Text className="text-xs" style={endDate ? {color: colors.error} : {color: colors.background}}>Limpiar fecha</Text>
                </TouchableOpacity>
            
            </View>

            <PlatformDatePicker 
                show={showDatePickerInicio} 
                setShow={setShowDatePickerInicio} 
                date={startDate} 
                setDate={setStartDate}
            />

            <PlatformDatePicker 
                show={showDatePickerFin} 
                setShow={setShowDatePickerFin} 
                date={endDate || null} 
                setDate={setEndDate}
            />
        </View>
        
    )
}