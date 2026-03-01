import { Text, View } from "react-native";
import { UserIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext";

interface UserSearchPlaceholderProps {
	loading: boolean;
}

export const UserSearchPlaceholder = ({ loading }: UserSearchPlaceholderProps) => {
	const { colors } = useTheme();
	return (
		<View className={`-z-10 flex-1 items-center justify-center mb-40 ${loading ? 'hidden' : ''}`} style={{ backgroundColor: colors.background }}>
			{/* Contenedor del Icono  */}
			<View className="mb-6 h-32 w-32 items-center justify-center rounded-full" style={{ backgroundColor: colors.surfaceButton }}>
				<View className="h-28 w-28 items-center justify-center rounded-full" style={{ backgroundColor: colors.secondary }}>
					<UserIcon size={64} color={colors.primaryText} />
				</View>
			</View>

			{/* Texto Principal */}
			<Text className="mb-3 text-center text-3xl font-bold" style={{ color: colors.primaryText }}>
				Usuarios
			</Text>

			{/* Texto Secundario (Instrucciones) */}
			<Text className="px-4 text-center" style={{ color: colors.secondaryText }}>
				Realiza una búsqueda para buscar usuarios.
			</Text>
		</View>
	);
};