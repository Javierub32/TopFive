import { Text, View } from "react-native";
import { UserIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext";
import {AppText} from 'components/AppText';
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
			<AppText className="mb-3 text-center font-bold" style={{ color: colors.primaryText, fontSize: 28 }}>
				Usuarios
			</AppText>

			{/* Texto Secundario (Instrucciones) */}
			<AppText className="px-4 text-center" style={{ color: colors.secondaryText, fontSize: 14 }}>
				Realiza una búsqueda para encontrar usuarios.
			</AppText>
		</View>
	);
};