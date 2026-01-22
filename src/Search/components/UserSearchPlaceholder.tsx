import { Text, View } from "react-native";
import { UserIcon } from "components/Icons";

interface UserSearchPlaceholderProps {
	loading: boolean;
}

export const UserSearchPlaceholder = ({ loading }: UserSearchPlaceholderProps) => {
	return (
		<View className={`-z-10 flex-1 items-center justify-center ${loading ? 'hidden' : ''}`}>
			{/* Contenedor del Icono  */}
			<View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-white/5">
				<View className="h-28 w-28 items-center justify-center rounded-full bg-secondary">
					<UserIcon size={64} color="#fff" />
				</View>
			</View>

			{/* Texto Principal */}
			<Text className="mb-3 text-center text-3xl font-bold text-primaryText">
				Usuarios
			</Text>

			{/* Texto Secundario (Instrucciones) */}
			<Text className="px-4 text-center text-secondaryText">
				Realiza una búsqueda para buscar usuarios.
			</Text>
		</View>
	);
};