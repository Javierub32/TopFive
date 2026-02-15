import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TimesWatchedIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
    views : any;
    setViews : any;
}

export const ViewsSetter = ({views, setViews} : Props) => {
    const { colors } = useTheme();

    return (
        <View className="mx-4 flex-1 p-4 rounded-2xl flex gap-2" style={{backgroundColor: `${colors.accent}33`}}>
            <View className="flex-row items-center gap-2">
                <TimesWatchedIcon color={colors.accent}/>
                <Text className="text-sm font-bold uppercase tracking-widest" style={{color: colors.markerText}}>Vistas</Text>
            </View>
            <View className="flex-1 flex-row justify-between items-center">
                <TouchableOpacity
                onPress={() => setViews(Math.max(0, views - 1))}
                className="rounded-lg p-2 items-center"
                style= {{backgroundColor: colors.accent}}>
                    <MaterialCommunityIcons name="minus" size={16} color="white" />
                </TouchableOpacity>

                <TextInput
                    value={(views || 0).toString()} onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        const num = parseInt(numericText) || 0;
                        if (num <= 50 || numericText === '') {
                            setViews(numericText)
                        }}}
                    keyboardType="numeric"
                    maxLength={4}
                    className="w-12 text-center text-lg font-bold border-b pb-0"                                
                    style={{color: colors.primaryText, borderBottomColor: colors.placeholderText}}
                    selectTextOnFocus={true}
                />
                

                <TouchableOpacity
                    onPress={() => setViews(views + 1)}
                    className="rounded-lg p-2"
                    style={{backgroundColor: colors.accent}}>
                    <MaterialCommunityIcons name="plus" size={16} color="white" />
                </TouchableOpacity>
            </View>            
        </View>
    )
}