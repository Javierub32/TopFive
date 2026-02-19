import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "context/ThemeContext";
import { Linking, Pressable, Text } from "react-native";


export const FeedbackFormButton = () => {
    const { colors } = useTheme();

    return (
        <Pressable
            className="w-full flex-row justify-between items-center rounded-2xl p-3"
            style={{backgroundColor: `${colors.accent}33`}}
            onPress={() => Linking.openURL('https://forms.gle/2FCL2eyicn4yLuTw8')}>
            <Text className="text-lg" style={{color: colors.primaryText}}>Enviar feedback</Text>
            <FontAwesome name="check-circle-o" size={24} color={colors.primaryText} />
        </Pressable>
    )
    
}