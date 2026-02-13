import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TimesWatchedIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
    resource : any;
}

export const ViewsSetter = ({resource} : Props) => {
    const { colors } = useTheme();

    const[numVisionados, setNumVisionados] = useState(resource?.numVisionados || 0 )

    return (
        <View className="mx-4 flex-1 p-4 rounded-2xl flex justify-between gap-2" style={{backgroundColor: `${colors.accent}33`}}>
            <View className="flex-row items-center gap-2">
                <TimesWatchedIcon color={colors.accent}/>
                <Text className="text-sm font-bold uppercase tracking-widest" style={{color: colors.markerText}}>Vistas</Text>
            </View>
            <View className="flex-row justify-between">
                <TouchableOpacity
                onPress={() => setNumVisionados(Math.max(0, numVisionados - 1))}
                className="rounded-lg p-2 items-center"
                style= {{backgroundColor: colors.accent}}>
                    <MaterialCommunityIcons name="minus" size={16} color="white" />
                </TouchableOpacity>

                <Text className="text-lg font-bold text-primaryText">{numVisionados}</Text>

                <TouchableOpacity
                    onPress={() => setNumVisionados(numVisionados + 1)}
                    className="rounded-lg p-2"
                    style={{backgroundColor: colors.accent}}>
                    <MaterialCommunityIcons name="plus" size={16} color="white" />
                </TouchableOpacity>
            </View>            
        </View>
    )
}