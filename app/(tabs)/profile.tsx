import { View, Text, ScrollView, Pressable, Image, useWindowDimensions, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { BarChart } from 'react-native-chart-kit';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

import { BookResource, SeriesResource, FilmResource, GameResource, SongResource } from 'app/types/Resources';
import { useResource } from 'context/ResourceContext';

// Data structure to hold statistics for each category
const categoryData = {
  libros: {
    title: 'Libros Leídos',
    total: 0,
    average: 0.0,
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  películas: {
    title: 'Películas Vistas',
    total: 0,
    average: 0.0,
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  series: {
    title: 'Series Vistas',
    total: 0,
    average: 0.0,
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  canciones: {
    title: 'Canciones Escuchadas',
    total: 0,
    average: 0.0,
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  videojuegos: {
    title: 'Videojuegos Jugados',
    total: 0,
    average: 0.0,
    chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
};

type CategoryKey = 'libros' | 'películas' | 'series' | 'canciones' | 'videojuegos';

// The section that displays the user's profile and statistics
export default function HomeScreen() {
	const { signOut, user } = useAuth();
	const {fetchCanciones, fetchLibros, fetchPeliculas, fetchSeries, fetchVideojuegos} = useResource();
	const { width: screenWidth } = useWindowDimensions();
	const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('libros');
	const [username, setUsername] = useState('Usuario');
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [isPressed, setIsPressed] = useState(false);
	const [data, setData] = useState<Array<BookResource | FilmResource | SeriesResource | GameResource | SongResource>>([]);
	
	// Fetch user profile on initial load
	useEffect(() => {
		if (user) {
			fetchUserProfile();
		}
	}, [user]);

	// Fetch data when category changes and if whe haven't fetched it yet
	useEffect(() => {
		if (categoryData[selectedCategory].total !== 0) return;
		console.log('Fetching data for category:', selectedCategory);
		fetchResourceInfo();
	}, [selectedCategory]);

	// Fetch all resources of the selected category and fill the profile data
	const fetchResourceInfo = async () =>  {
		let resourceData: any[] = [];
		switch (selectedCategory) {
			case 'libros':
				resourceData = await fetchLibros() as BookResource[];
				break;
			case 'películas':
				resourceData = await fetchPeliculas() as FilmResource[];
				break;
			case 'series':
				resourceData = await fetchSeries() as SeriesResource[];
				break;
			case 'canciones':
				resourceData = await fetchCanciones() as SongResource[];
				break;
			case 'videojuegos':
				resourceData = await fetchVideojuegos() as GameResource[];
				break;
			default:
				break;
		}
		setData(resourceData);
		fillData(resourceData);
	};

	// Fill the profile statistics data based on fetched resources
	// We dont use typed here for simplicity, but if needed we can add it
	const fillData = (resourses: any[]) => {
		let total = 0;
		let months = 0;
		let resoursesPerMonth = new Array(12).fill(0);
		resourses.forEach((resourse) => {
			if (resourse.fechaFin) {
				const fecha = new Date(resourse.fechaFin);
				const month = fecha.getMonth();
				if (fecha.getFullYear() === new Date().getFullYear()) {
					resoursesPerMonth[month]++;
					total++;
				}
			}
		});
		// Total of months we consume a resource to do an average more coherent
		months = resoursesPerMonth.reduce((acc, resOnMonth) => {
			if (resOnMonth != 0) return acc + 1;
			else return acc;
		}, 0);
		if (months === 0) months = 1; // Avoid division by zero

		categoryData[selectedCategory].total = total;
		categoryData[selectedCategory].average = parseFloat((total / months).toFixed(1));
		categoryData[selectedCategory].chartData = resoursesPerMonth;
		return resourses;
	}

	// Fetch user profile information
	const fetchUserProfile = async () => {
		if (!user) return;
		
		try {
			const { data, error } = await supabase
				.from('usuario')
				.select('username, avatar_url')
				.eq('id', user.id)
				.single();

			if (error) throw error;
			
			if (data) {
				setUsername(data.username || 'Usuario');
				setAvatarUrl(data.avatar_url);
			}
		} catch (error) {
			console.error('Error al cargar perfil:', error);
		}
	};

	// Function to pick an image from the device's gallery
	const pickImage = async () => {
		try {
			// Request permission to access media library
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			
			if (status !== 'granted') {
				Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto de perfil');
				return;
			}

			// Open image picker
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});

			if (!result.canceled && result.assets[0]) {
				await uploadAvatar(result.assets[0].uri);
			}
		} catch (error) {
			console.error('Error al seleccionar imagen:', error);
			Alert.alert('Error', 'No se pudo seleccionar la imagen');
		}
	};

	// Function to upload the selected avatar to Supabase Storage
	const uploadAvatar = async (uri: string) => {
		if (!user) {
			Alert.alert('Error', 'Usuario no disponible');
			return;
		}
		
		try {
			// Delete previous avatar if exists
			if (avatarUrl) {
				try {
					const oldPath = avatarUrl.split('/avatars/')[1];
					if (oldPath) {
						await supabase.storage.from('avatars').remove([oldPath]);
					}
				} catch (error) {
					console.log('No se pudo eliminar la foto anterior:', error);
				}
			}

			const response = await fetch(uri);
			const blob = await response.blob();
			const reader = new FileReader();
			
			reader.onloadend = async () => {
				const base64data = reader.result as string;
				const base64String = base64data.split(',')[1];
				
				const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
				const fileName = `avatar.${fileExt}`;
				const filePath = `${user.id}/${fileName}`;

				// Upload to Supabase Storage with upsert true
				const { data, error: uploadError } = await supabase.storage
					.from('avatars')
					.upload(filePath, decode(base64String), {
						contentType: `image/${fileExt}`,
						upsert: true,
					});

				if (uploadError) {
					console.error('Error de subida:', uploadError);
					throw uploadError;
				}

				// Get public URL with timestamp to avoid cache
				const { data: { publicUrl } } = supabase.storage
					.from('avatars')
					.getPublicUrl(filePath);

				const publicUrlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

				// Update in the database
				const { error: updateError } = await supabase
					.from('usuario')
					.update({ avatar_url: publicUrlWithTimestamp })
					.eq('id', user.id);

				if (updateError) {
					console.error('Error al actualizar BD:', updateError);
					throw updateError;
				}

				setAvatarUrl(publicUrlWithTimestamp);
				Alert.alert('¡Éxito!', 'Foto de perfil actualizada correctamente');
			};

			reader.readAsDataURL(blob);
		} catch (error: any) {
			console.error('Error al subir imagen:', error);
			Alert.alert('Error', error.message || 'No se pudo actualizar la foto de perfil');
		}
	};
	
	if (!user) {
		return (
			<Screen>
				<StatusBar style="light" />
				<View className="flex-1 items-center justify-center">
					<Text className="text-white text-lg">Cargando perfil...</Text>
				</View>
			</Screen>
		);
	}
	
	return (
		<Screen>
		<StatusBar style="light" />
		<Text className="mb-3 p-7 text-center text-2xl font-bold text-white">
			Perfil de Usuario
		</Text>
		
		<Pressable className="absolute top-5 right-4 z-10 rounded-full bg-white/10 p-3" onPress={signOut}>
			<Ionicons name="log-out-outline" size={24} color="#fff" />
		</Pressable>
		{/* Profile Info Section */}
		<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
			<View className="flex-1 items-center p-2 ">
				{/* Avatar and Username */}
				<View className="items-center mb-2">
					<View style={{ position: 'relative', paddingTop: 20 }}>
						<TouchableOpacity 
							onPress={pickImage}
							onPressIn={() => setIsPressed(true)}
							onPressOut={() => setIsPressed(false)}
							activeOpacity={0.7}
						>
							{avatarUrl ? (
								<Image
									source={{ uri: avatarUrl }}
									className="h-20 w-20 rounded-full"
									style={{ width: 120, height: 120, borderRadius: 60 }}
								/>
							) : (
								<View style={{ 
									width: 120, 
									height: 120, 
									borderRadius: 60, 
									backgroundColor: '#374151',
									justifyContent: 'center',
									alignItems: 'center'
								}}>
									<MaterialCommunityIcons name="account" size={60} color="#9CA3AF" />
								</View>
							)}
						</TouchableOpacity>
						<Image
							source={require('../../assets/gorro-navideño.png')}
							style={{ 
								position: 'absolute', 
								top: isPressed ? 2 : 5, 
								right: isPressed ? -14 : -5, 
        						width: isPressed ? 60 : 50,
								height: isPressed ? 70 : 60,
								transform: [{ rotate: '20deg' }]
							}}
							resizeMode="contain"
						/>
						{/* Icono de cámara para indicar que se puede cambiar */}
						<View style={{
							position: 'absolute',
							bottom: 0,
							right: 0,
							backgroundColor: '#a855f7',
							borderRadius: 15,
							width: 30,
							height: 30,
							justifyContent: 'center',
							alignItems: 'center',
							borderWidth: 2,
							borderColor: '#1f2937'
						}}>
							<MaterialCommunityIcons name="camera" size={16} color="#fff" />
						</View>
					</View>

					<Text className="mt-5 mb-3 text-center text-2xl font-bold text-white">
						{username}
					</Text>
				</View>
			</View>
			
			{/* Category Selection ScrollView */}
			<ScrollView 
				horizontal 
				showsHorizontalScrollIndicator={true}
				className="mb-4"
				style={{ borderBottomWidth: 1, borderBottomColor: '#374151' }}
			>
				<Pressable onPress={() => setSelectedCategory('libros')}>
					<View className={`py-2 px-3 ${selectedCategory === 'libros' ? 'border-b-4 border-purple-500' : ''}`}>
						<Text className={`text-center ${selectedCategory === 'libros' ? 'font-bold text-purple-500' : 'text-gray-500'} text-s`}>
							Libros
						</Text>
					</View>
				</Pressable>
				
				<Pressable onPress={() => setSelectedCategory('películas')}>
					<View className={`py-2 px-4 ${selectedCategory === 'películas' ? 'border-b-4 border-purple-500' : ''}`}>
						<Text className={`text-center ${selectedCategory === 'películas' ? 'font-bold text-purple-500' : 'text-gray-500'} text-s`}>
							Películas
						</Text>
					</View>
				</Pressable>
				
				<Pressable onPress={() => setSelectedCategory('series')}>
					<View className={`py-2 px-4 ${selectedCategory === 'series' ? 'border-b-4 border-purple-500' : ''}`}>
						<Text className={`text-center ${selectedCategory === 'series' ? 'font-bold text-purple-500' : 'text-gray-500'} text-s`}>
							Series
						</Text>
					</View>
				</Pressable>
				
				<Pressable onPress={() => setSelectedCategory('canciones')}>
					<View className={`py-2 px-4 ${selectedCategory === 'canciones' ? 'border-b-4 border-purple-500' : ''}`}>
						<Text className={`text-center ${selectedCategory === 'canciones' ? 'font-bold text-purple-500' : 'text-gray-500'} text-s`}>
							Canciones
						</Text>
					</View>
				</Pressable>
				
				<Pressable onPress={() => setSelectedCategory('videojuegos')}>
					<View className={`py-2 px-4 ${selectedCategory === 'videojuegos' ? 'border-b-4 border-purple-500' : ''}`}>
						<Text className={`text-center ${selectedCategory === 'videojuegos' ? 'font-bold text-purple-500' : 'text-gray-500'} text-s`}>
							Videojuegos
						</Text>
					</View>
				</Pressable>
			</ScrollView>

			<View className="flex-row px-1 mb-2">
				<View className="flex-1 bg-gray-800 rounded-xl p-5 mx-2 my-2 border-2 border-purple-500/30">
					<Text className="text-purple-400 text-xl font-bold mb-3">{categoryData[selectedCategory].title}</Text>
					<View className="flex-1 justify-end">
						<Text className="text-white text-2xl text-right">{categoryData[selectedCategory].total}</Text>
					</View>
				</View>
				<View className="flex-1 bg-gray-800 rounded-xl p-5 mx-2 my-2 border-2 border-purple-500/30">
					<Text className="text-purple-400 text-xl font-bold mb-3">Promedio/Mes</Text>
					<View className="flex-1 justify-end">
						<Text className="text-white text-2xl text-right">{categoryData[selectedCategory].average}</Text>
					</View>
				</View>
			</View>
			{/* Graph Section */}
			<View className="px-3 pb-10">
				<View className="bg-gray-800 rounded-xl py-5 my-2 border-2 border-purple-500/30" style={{ overflow: 'hidden' }}>
					<Text className="text-purple-400 text-xl font-bold mb-3 px-5">Actividad Anual</Text>
					<View style={{ alignItems: 'center' }}>
						<BarChart
							data={{
								labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
								datasets: [{
									data: categoryData[selectedCategory].chartData
								}]
							}}
							width={screenWidth - 56}
							height={160}
							chartConfig={{
								backgroundColor: 'transparent',
								backgroundGradientFrom: '#1f2937',
								backgroundGradientTo: '#1f2937',
								decimalPlaces: 0,
								color: (opacity = 1) => `rgba(168, 85, 247, ${opacity})`,
								labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
								style: { borderRadius: 16 },
								barPercentage: 0.5,
								propsForBackgroundLines: {
									strokeDasharray: '',
									stroke: '#374151',
									strokeWidth: 0
								},
								propsForLabels: {
									fontSize: 10
								}
							}}
							style={{
								borderRadius: 16,
								marginLeft: -15,
								marginTop: 10,
								marginRight: 50
							}}
							withInnerLines={false}
							fromZero={true}
							withHorizontalLabels={false}
						showValuesOnTopOfBars={true}
					/>
				</View>
			</View>
		</View>
		</ScrollView>
	</Screen>
	);
}