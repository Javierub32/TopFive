import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import Films from '../categories/Films';
import Books from 'app/categories/books';


export default function HomeScreen() {
	const [selectedCategory, setSelectedCategory] = useState('peliculas');

	const categories = [
		{ id: 'peliculas' },
		{ id: 'series' },
		{ id: 'videojuegos' },
		{ id: 'libros' },
		{ id: 'canciones' }
	];

	const getCategoryContent = () => {
		switch (selectedCategory) {
			case 'peliculas':
				return <Films />;
			case 'libros':
				return <Books />;
			case 'videojuegos':
				return 'Los mejores videojuegos que has jugado. Comparte tu pasión por el gaming con tu Top 5 de juegos inolvidables.';
			case 'series':
				return 'Tu biblioteca personal de favoritos. Guarda los libros que te han cambiado la vida en tu Top 5 literario.';
			case 'canciones':
				return 'Tu playlist definitiva. Las 5 canciones que definen tu vida musical en un solo lugar.';
			default:
				return '';
		}
	};

	return (
		<Screen>
			<StatusBar style="light" />
			<View className="px-4 pt-6">
				<Text className="mb-4 text-3xl font-bold text-white">Inicio</Text>
			</View>

			<ScrollView showsVerticalScrollIndicator={true} className="flex-1 mb-4">

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="fire" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Destacados de la semana </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{['Wicked II (Peli)', 'Hogwarts Legacy (Juego)', 'Stranger Things (Serie)', 'La vereda de la puerta de atrás (Cancion)', 'Alas de sangre (Libro)'].map((populares) => (
						<View key={populares} className="mr-4 w-72">
							<View className="h-40 w-full rounded-lg bg-gray-700 justify-center items-center">
								<MaterialCommunityIcons name="trending-up" size={48} color="#9ca3af" />
							</View>
							<Text className="mt-2 text-white">{populares}</Text>
						</View>
					))}
				</ScrollView>
			</View>

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="bookshelf" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Libros populares </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{['El principito', 'Don Quijote de la Mancha', 'Harry Potter y la piedra filosofal', '1984', 'Cien años de soledad'].map((movie) => (
						<View key={movie} className="mr-4 w-40">
							<View className="h-60 w-full rounded-lg bg-gray-700 justify-center items-center">
								<MaterialCommunityIcons name="book-open-blank-variant" size={48} color="#9ca3af" />
							</View>
							<Text className="mt-2 text-white">{movie}</Text>
						</View>
					))}
				</ScrollView>
			</View>

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="film" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Películas populares </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{['Inception', 'The Dark Knight', 'Interstellar', 'Parasite', 'Avengers: Endgame'].map((movie) => (
						<View key={movie} className="mr-4 w-40">
							<View className="h-60 w-full rounded-lg bg-gray-700 justify-center items-center">
								<MaterialCommunityIcons name="movie" size={48} color="#9ca3af" />
							</View>
							<Text className="mt-2 text-white">{movie}</Text>
						</View>
					))}
				</ScrollView>
			</View>

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="video-vintage" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Series populares </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{['Breaking Bad', 'Game of Thrones', 'Stranger Things', 'The Walking Dead', 'The Big Bang Theory'].map((series) => (
						<View key={series} className="mr-4 w-40">
							<View className="h-60 w-full rounded-lg bg-gray-700 justify-center items-center">
								<MaterialCommunityIcons name="filmstrip" size={48} color="#9ca3af" />
							</View>
							<Text className="mt-2 text-white">{series}</Text>
						</View>
					))}
				</ScrollView>
			</View>

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="gamepad-variant" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Videojuegos populares </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{['Grand Theft Auto V', 'The Legend of Zelda: Breath of the Wild', 'Minecraft', 'Fortnite', 'The Witcher 3: Wild Hunt'].map((movie) => (
						<View key={movie} className="mr-4 w-40">
							<View className="h-60 w-full rounded-lg bg-gray-700 justify-center items-center">
								<MaterialCommunityIcons name="gamepad-outline" size={48} color="#9ca3af" />
							</View>
							<Text className="mt-2 text-white">{movie}</Text>
						</View>
					))}
				</ScrollView>
			</View>

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="music-circle" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Canciones populares </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{[['SUPERESTRELLA','Aitana'], ['Latin Girl', 'Claudia Arenas'], ['Dios es un stalker', 'Rosalía'], ['DESQUICIAO', 'BAJOCERO X'], ['Ático', 'Belén Aguilera']].map((canciones) => (
						<View key={canciones[0]} className="mr-4 w-72 h-24 bg-gray-800 rounded-xl flex-row overflow-hidden items-center shadow-sm">
							<View className="w-24 h-full bg-gray-700 justify-center items-center">
								<MaterialCommunityIcons name="music-note" size={32} color="#9ca3af" />
							</View>
							<View className="flex-1 p-3 justify-center">
								<Text className="text-white font-bold text-base" numberOfLines={2}>
									{canciones[0]}
								</Text>
								<Text className="text-gray-400 text-xs mt-1">{canciones[1]}</Text>
							</View>
						</View>
					))}
				</ScrollView>
			</View>
			</ScrollView>
		</Screen>
	);

}
