import { FormInput } from "@/Settings/components/DescriptionInput";
import { useSettings } from "@/Settings/hooks/useSettings";
import { LoadingIndicator } from "components/LoadingIndicator";
import { ReturnButton } from "components/ReturnButton";
import { Screen } from "components/Screen";
import { useTheme } from "context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";


export default function EditProfileScreen() {
	const { uname, udesc, setUsername, setDescription, handleSubmit, loading } = useSettings();
	const { colors } = useTheme();

	if (loading) {
		return (
			<Screen>
				<LoadingIndicator />
			</Screen>
		);
	}

	return (
		<Screen>
			
			<ReturnButton route="/settings" title="Editar perfil" params={{ username: uname, description: udesc }}/>
			<View className="flex-col gap-2 py-4 px-6">
			<FormInput		
				description={uname}
				onChange={setUsername}
				title="Nombre de usuario"
				placeholder="Escribe tu nombre de usuario..."
				maxLength={20}
				numberOfLines={1}
			/>
			<FormInput		
				description={udesc}
				onChange={setDescription}
				title="Descripción"
				placeholder="Escribe algo sobre ti..."
				maxLength={110}
				numberOfLines={4}
			/>
			<TouchableOpacity
				className="mt-4 w-full items-center rounded-xl py-3"
				style={{ backgroundColor: colors.secondary }}
				onPress={() => handleSubmit(uname, udesc)}>
				<Text className="text-lg font-semibold text-white">Guardar cambios</Text>
			</TouchableOpacity>
		 </View>

		</Screen>
	);
}