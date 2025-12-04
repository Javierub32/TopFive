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
			<View className="flex-1">
				{/* Barra de categorías */}
				<View 
					className="mx-4 mt-4 mb-6 flex-row"
					style={{
						backgroundColor: 'rgba(255, 255, 255, 0.08)',
						borderWidth: 2,
						borderColor: 'rgba(139, 92, 246, 0.5)',
						borderRadius: 25,
						overflow: 'hidden'
					}}
				>
					{categories.map((category, index) => (
						<TouchableOpacity
							key={category.id}
							onPress={() => setSelectedCategory(category.id)}
							className="flex-1 items-center py-3"
							style={{
								backgroundColor: selectedCategory === category.id ? '#8b5cf6' : 'transparent',
								borderLeftWidth: index > 0 ? 1 : 0,
								borderLeftColor: 'rgba(139, 92, 246, 0.3)'
							}}
						>
							<Text 
								className="mt-1 text-xs font-semibold text-center"
								style={{ color: selectedCategory === category.id ? '#fff' : '#a78bfa' }}
							>
								{category.id}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Contenido */}
				<ScrollView className="flex-1 px-6">
					{getCategoryContent()}
				</ScrollView>
			</View>
		</Screen>
	);

}
