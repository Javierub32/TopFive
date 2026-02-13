import { useTheme } from "context/ThemeContext"
import { useState } from "react";
import { StateType } from "hooks/useResource";
import { View, TouchableOpacity, Text } from "react-native";

interface Props {
    resource : any
    inProgressLabel?: string}

export const DifficultySetter = ({resource, inProgressLabel} : Props) => {
    const { colors } = useTheme();
    const [dificultad, setDificultad] = useState<string>(resource?.dificultad || 'Normal');
    
    const options = ['Fácil','Normal','Difícil','Extremo']

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
        case 'Fácil': return colors.success;
        case 'Normal': return colors.accent;
        case 'Difícil': return colors.warning;
        case 'Extremo': return colors.error;
        default: return colors.surfaceButton;
        }
    };

    return ( 
        <View className="flex-row px-4 pt-2 rounded-lg">
            {options.map((dif) => {
                const isSelected = dificultad === dif;
                    return ( 
                        <TouchableOpacity
                            key={dif}
                            onPress={() => setDificultad(dif)}
                            className={`flex-1 py-3 ${dif == options[0] ? 'rounded-l-lg': ''} ${dif == options[options.length-1] ? 'rounded-r-lg': '' }`}
                            style = { isSelected ? {backgroundColor: `${getDifficultyColor(dif)}1A`} : {backgroundColor: colors.surfaceButton}}
                            activeOpacity={0.7}
                        >
                            <Text className="text-center text-sm font-semibold" style={isSelected? {color: getDifficultyColor(dif)} : {color: colors.secondaryText}}>
                                {dif}
                            </Text>
                        </TouchableOpacity>
                    )
            })}
        </View>
    )
}