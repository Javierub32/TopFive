import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';


export default function HomeScreen() {
	const { signOut } = useAuth();
	
	return (
		<Screen>
			<StatusBar style="light" />
			<Text className="mb-3 p-7 text-center text-2xl font-bold text-white">
						Perfil de Usuario
			</Text>
			{/* Settings button (functionality to be added) */}
			<Pressable className="absolute top-5 right-4 z-10 rounded-full bg-white/10 p-3">
				<Ionicons name="settings-sharp" size={24} color="#fff" />
			</Pressable>
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<View className="flex-1 items-center p-2">
					{/* Profile photo */}
					<View className="items-center mb-2">
						<View style={{ position: 'relative', paddingTop: 20, paddingRight: 20 }}>
							<Image
								source={require('../../assets/profile-photo.jpeg')}
								className="h-20 w-20 rounded-full"
								style={{ width: 120, height: 120, borderRadius: 60 }}
							/>
							{/* Gorrito navideño */}
							<Image
								source={require('../../assets/gorro-navideño.png')}
								style={{ 
									position: 'absolute', 
									top: 5, 
									right: 15, 
									width: 50, 
									height: 60, 
									transform: [{ rotate: '20deg' }]
								}}
								resizeMode="contain"
							/>
						</View>

						{/* Título */}
						<Text className="mb-3 text-center text-2xl font-bold text-white">
						Rafaela Benitez
						</Text>
					</View>
				</View>
				
				{/* Pestañas */}
				<View className="flex-row border-b border-gray-700 mb-4">
  				<View className="flex-1 py-3 border-b-4 border-purple-500">
						<Text className="text-center font-bold text-purple-500 text-s">
							Libros
						</Text>
					</View>
					
					<View className="flex-1 py-3">
						<Text className="text-center text-gray-500 text-s">
							Películas
						</Text>
					</View>
					
					<View className="flex-1 py-3">
						<Text className="text-center text-gray-500 text-s">
							Series
						</Text>
					</View>
					
					<View className="flex-1 py-3">
						<Text className="text-center text-gray-500 text-s">
							Canciones
						</Text>
					</View>
					
					<View className="flex-1 py-3">
						<Text className="text-center text-gray-500 text-s">
							Videojuegos
						</Text>
					</View>
				</View>
				<View className="flex-row px-3">
					<View className="flex-1 bg-gray-800 rounded-xl p-5 mx-2 my-2 border-2 border-purple-500/30">
						<Text className="text-purple-400 text-xl font-bold mb-3">Total Libros Leidos</Text>
						<View className="flex-1 justify-end">
							<Text className="text-white text-2xl text-right">128</Text>
						</View>
					</View>
					<View className="flex-1 bg-gray-800 rounded-xl p-5 mx-2 my-2 border-2 border-purple-500/30">
						<Text className="text-purple-400 text-xl font-bold mb-3">Promedio/Mes</Text>
						<View className="flex-1 justify-end">
							<Text className="text-white text-2xl text-right">10.7</Text>
						</View>
					</View>
				</View>
				<View className="flex-row px-3">
					<View className="flex-1 px-3 bg-gray-800 rounded-xl p-5 mx-2 my-2 border-2 border-purple-500/30">
						<Text className="text-purple-400 text-xl font-bold mb-3">Top 5 Películas</Text>
						<Text className="text-white text-base">Aquí podrás ver y gestionar tus películas favoritas</Text>
					</View>
				</View>
				
			</ScrollView>
			
		</Screen>
	);
}
