import { View, Text, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';


export default function HomeScreen() {
	const { signOut } = useAuth();
	return (
		<Screen>
			<StatusBar style="light" />
			<Pressable onPress={signOut} className="absolute top-10 right-4 z-10 rounded-full bg-white/10 p-3">
				<MaterialCommunityIcons name="logout" size={24} color="#fff" />
				<Text className="sr-only">Cerrar sesión</Text>
			</Pressable>
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<View className="flex-1 items-center justify-center p-6" style={{ minHeight: 600 }}>
					{/* Icono principal */}
					<View className="mb-8 items-center">
						<View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-white/5">
							<View className="h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-800">
								<MaterialCommunityIcons name="hammer-wrench" size={64} color="#fff" />
							</View>
						</View>

						{/* Título */}
						<Text className="mb-3 text-center text-4xl font-bold text-white">
							En Construcción
						</Text>
					</View>


				</View>
			</ScrollView>
		</Screen>
	);
}
