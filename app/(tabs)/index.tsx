import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

const FeaturedItems = [
	{ id: '1', title: 'Wicked II', type: 'Película', image: 'https://imgs.search.brave.com/oC2mCUtjwn6Wzti9Sionsc_t2IwsHPBS8DCnXRpgcBk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9oaXBz/LmhlYXJzdGFwcHMu/Y29tL2htZy1wcm9k/L2ltYWdlcy93aWNr/ZWQtcGFydGUtMi1p/aS1mb3ItZ29vZC1w/ZWxpY3VsYS02OTFj/YWFiMGFmNjllLmpw/Zz9jcm9wPTF4dzow/Ljc0OTc1NjE3Njg1/MzA1NnhoOzAsMA' },
	{ id: '2', title: 'Hogwarts Legacy', type: 'Juego', image: 'https://gaming-cdn.com/images/products/4824/orig/hogwarts-legacy-pc-game-steam-cover.jpg' },
	{ id: '3', title: 'Stranger Things', type: 'Serie', image: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg' },

];

const PopularBooks = [
	{ id: '1', title: 'El principito', image: 'https://imgs.search.brave.com/NAqwvXDJglnY6leS8zC5av-LfGJTteIV-ZYt-IzKSsU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wcmlu/Y2lwaXRvZW5pZGlv/bWFzLmNvbS8xMDQ4/LWhvbWVfZGVmYXVs/dC9lbC1wcmluY2lw/aXRvLWdhY2VyaWEt/ZWwtcGl0b2NoZS1l/bmdydWxsb24tYXp1/bC5qcGc' },
	{ id: '2', title: 'Don Quijote de la Mancha', image: 'https://imgs.search.brave.com/cIPwb1DQ_yy6VBWDIvWYP3AldNGpUo9eN3XTsw46-G8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFtRkYzQXg1S0wu/anBn' },
	{ id: '3', title: 'Harry Potter y la piedra filosofal', image: 'https://imgs.search.brave.com/U4SEWqPRLY8xzMfCWGIOJiPV592oeIeONF5IccqDQDs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cGVuZ3VpbmxpYnJv/cy5jb20vZXMvMTUz/MjczMS1ob21lX2Rl/ZmF1bHQvaGFycnkt/cG90dGVyLXktZWwt/bWlzdGVyaW8tZGVs/LXByaW5jaXBlLWdy/eWZmaW5kb3ItaGFy/cnktcG90dGVyLWVk/aWNpb24tZGVsLTIw/LWFuaXZlcnNhcmlv/LTYud2VicA' },
	{ id: '4', title: '1984', image: 'https://m.media-amazon.com/images/I/71rpa1-kyvL._AC_UF1000,1000_QL80_.jpg' },
	{ id: '5', title: 'Cien años de soledad', image: 'https://m.media-amazon.com/images/I/91TvVQS7loL._AC_UF1000,1000_QL80_.jpg' },
];

const PopularMovies = [
	{ id: '1', title: 'Inception', image: 'https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg' },
	{ id: '2', title: 'The Dark Knight', image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg' },
	{ id: '3', title: 'Interstellar', image: 'https://m.media-amazon.com/images/I/91obuWzA3XL._AC_SY679_.jpg' },
	{ id: '4', title: 'Parasite', image: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg' },
	{ id: '5', title: 'Avengers: Endgame', image: 'https://m.media-amazon.com/images/I/81ai6zx6eXL._AC_SY679_.jpg' },
];

const PopularSeries = [
	{ id: '1', title: 'Breaking Bad', image: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_FMjpg_UX1000_.jpg' },
	{ id: '2', title: 'Game of Thrones', image: 'https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg' },
	{ id: '3', title: 'Stranger Things', image: 'https://imgs.search.brave.com/_Dp3bS1p9eoYWMOmDxQFKd9-snBNYS4i9Z1J9y5NxzA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDE0NTgw/MDY3LmpwZw' },
	{ id: '4', title: 'The Walking Dead', image: 'https://imgs.search.brave.com/W9Dz0GAp9-MsAPa4ylYPN2pP37u7vdn7u2F-bJozgME/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzIyLzNm/L2UxLzIyM2ZlMWU5/OTU1N2Y4OGQ4YTZi/NDBlMzkwNTIwOGM1/LmpwZw' },
	{ id: '5', title: 'The Big Bang Theory', image: 'https://imgs.search.brave.com/pBMTHUZ-EDDpvBq7LNk3TmnFYpqYYRYxwWQH0WduNP8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lcy53/ZWIuaW1nMi5hY3N0/YS5uZXQvY18zMTBf/NDIwL3BpY3R1cmVz/LzE0LzAyLzEyLzEz/LzQzLzM2OTAyNy5q/cGc' },
];

const PopularGames = [
	{ id: '1', title: 'Grand Theft Auto V', image: 'https://imgs.search.brave.com/tkzIyIMFAGoM_HtsfADu-iLEOwuhXNUfDkjdG1rS-Zw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXQuY29t/L3cvZnVsbC80L2Ev/OC8yNTE5LTEwODB4/MTkyMC1tb2JpbGUt/ZnVsbC1oZC1ncmFu/ZC10aGVmdC1hdXRv/LTUtd2FsbHBhcGVy/LmpwZw' },
	{ id: '2', title: 'The Legend of Zelda: Breath of the Wild', image: 'https://m.media-amazon.com/images/I/81KGsbq8ekL._AC_SL1500_.jpg' },
	{ id: '3', title: 'Minecraft', image: 'https://imgs.search.brave.com/in_XABjJCuxVnJ8IPfP3pWoGmeSntejmuK32qvUzS8g/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2Q4L2Q1/Lzk1L2Q4ZDU5NWRm/NTgwNDYwYjg5NDUx/YTBkOTczMzkzZDIw/LmpwZw' },
	{ id: '4', title: 'Fortnite', image: 'https://imgs.search.brave.com/BZ_ZnB3UrVQG1dT8oH02BZsqorW7ITjDjJ25tbF7CKE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9mb3J0bml0ZS13/YWxscGFwZXItNGst/Z2FtaW5nLXdhbGxw/YXBlcl83NzY2NzQt/MTExNjAxMC5qcGc_/c2VtdD1haXNfaHli/cmlkJnc9NzQwJnE9/ODA' },
	{ id: '5', title: 'The Witcher 3: Wild Hunt', image: 'https://imgs.search.brave.com/dX9Q0Dn7Y6WmtU28mybEnYnQOH_-JuYzl73g41rWjc0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXQuY29t/L3cvZnVsbC8xLzkv/NS81Njg0LTEwODB4/MjI4MC1zYW1zdW5n/LWhkLXRoZS13aXRj/aGVyLWdhbWUtYmFj/a2dyb3VuZC1pbWFn/ZS5qcGc' },
];

const PopularSongs = [
	{ id: '1', title: 'CataRata', artist: 'Guillo Rist', image: 'https://imgs.search.brave.com/KDdhdNCWS0uKVujFhEPuxOEvMQH4d_U7u7Uaus4z59U/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDF5ejJ2cFVEckwu/anBn' },
	{ id: '2', title: 'Latin Girl', artist: 'Claudia Arenas', image: 'https://imgs.search.brave.com/eGdj3vq5ZWaYT27m2W5QrFNjbsVVTHLGcGNGZMJ6b1Y/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9qZW5l/c2Fpc3BvcC5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjUv/MTEvY2xhdWRpYS1h/cmVuYXMtbGF0aW4t/Z2lybC5qcGc' },
	{ id: '3', title: 'Dios es un stalker', artist: 'Rosalía', image: 'https://imgs.search.brave.com/IJqffwUbbeUGdYF3A0A_LdAskwhKRB5Vmo1-28aqhEk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZW5lcy4yMG1pbnV0/b3MuZXMvZmlsZXMv/aW1hZ2VfMzIwXzI0/MC91cGxvYWRzL2lt/YWdlbmVzLzIwMjUv/MTEvMDcvNjkwZDll/NzM2Y2ViMC5qcGVn' },
	{ id: '4', title: 'DESQUICIAO', artist: 'BAJOCERO X', image: 'https://imgs.search.brave.com/tJKdNaDywLw6Jut4SxYT2dhFjHDZDgGIkzgTjOOxzMw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/ZWxwbHVyYWwuY29t/L3VwbG9hZHMvczEv/MTkvNDYvNjQvNC9i/YWpvY2Vyby14Lmpw/ZWc' },
	{ id: '5', title: 'Ático', artist: 'Belén Aguilera', image: 'https://imgs.search.brave.com/iDVlxIpUtsxzkkjiTuOGSvlIRIw4YpgBHhV0ZOAfT14/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdG9y/ZS5zb255bXVzaWMu/ZXMvY2RuL3Nob3Av/YXJ0aWNsZXMvQ2Fw/dHVyYV9kZV9wYW50/YWxsYV8yMDI1LTA5/LTEyX2FfbGFzXzEw/LjMwLjMzXzU1N3gu/cG5nP3Y9MTc1NzY2/NTk3NA' },
];

export default function HomeScreen() {
	const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

	const handleImageError = (id: string) => {
		//console.log(`Error cargando imagen con id: ${id}`);
		setImageErrors(prev => ({ ...prev, [id]: true }));
	};

	const renderContent = (content: { id: string; title: string; image: string }, iconName: string, type: 'vertical' | 'horizontal' = 'vertical') => {
		const hasError = imageErrors[content.id];
		
		if (type === 'vertical') {
			return (
				<View key={content.id} className="mr-4 w-40">
					<View className="h-60 w-full rounded-lg bg-gray-700 justify-center items-center overflow-hidden">
						{!hasError && (
							<Image
								source={{ uri: content.image }}
								className="h-full w-full"
								resizeMode="cover"
								onError={(e) => {
									//console.log(`Error en imagen: ${content.title}`, e.nativeEvent.error);
									handleImageError(content.id);
								}}
								onLoad={() => console.log(`Imagen cargada: ${content.title}`)}
							/>
						)}
						{hasError && (
							<MaterialCommunityIcons name={iconName as any} size={48} color="#9ca3af" />
						)}
					</View>
					<Text className="mt-2 text-white" numberOfLines={2}>{content.title}</Text>
				</View>
			);
		}
		
		return null;
	};

	const renderFeatured = (item: { id: string; title: string; type: string; image: string }) => {
		const hasError = imageErrors[item.id];
		
		return (
			<View key={item.id} className="mr-4 w-72">
				<View className="h-40 w-full rounded-lg bg-gray-700 justify-center items-center overflow-hidden">
					{!hasError && (
						<Image
							source={{ uri: item.image }}
							className="h-full w-full"
							resizeMode="cover"
							onError={(e) => {
								console.log(`Error en destacado: ${item.title}`, e.nativeEvent.error);
								handleImageError(item.id);
							}}
							onLoad={() => console.log(`Destacado cargado: ${item.title}`)}
						/>
					)}
					{hasError && (
						<MaterialCommunityIcons name="trending-up" size={48} color="#9ca3af" />
					)}
				</View>
				<Text className="mt-2 text-white">{item.title} ({item.type})</Text>
			</View>
		);
	};

	const renderSong = (song: { id: string; title: string; artist: string; image: string }) => {
		const hasError = imageErrors[song.id];
		
		return (
			<View key={song.id} className="mr-4 w-72 h-24 bg-gray-800 rounded-xl flex-row overflow-hidden items-center shadow-sm">
				<View className="w-24 h-full bg-gray-700 justify-center items-center overflow-hidden">
					{!hasError && (
						<Image
							source={{ uri: song.image }}
							className="h-full w-full"
							resizeMode="cover"
							onError={(e) => {
								console.log(`Error en canción: ${song.title}`, e.nativeEvent.error);
								handleImageError(song.id);
							}}
							onLoad={() => console.log(`Canción cargada: ${song.title}`)}
						/>
					)}
					{hasError && (
						<MaterialCommunityIcons name="music-note" size={32} color="#9ca3af" />
					)}
				</View>
				<View className="flex-1 p-3 justify-center">
					<Text className="text-white font-bold text-base" numberOfLines={2}>
						{song.title}
					</Text>
					<Text className="text-gray-400 text-xs mt-1">{song.artist}</Text>
				</View>
			</View>
		);
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
					{FeaturedItems.map((item) => renderFeatured(item))}
				</ScrollView>
			</View>

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="bookshelf" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Libros populares </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{PopularBooks.map((book) => renderContent(book, 'book-open-blank-variant'))}
				</ScrollView>
			</View>

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="film" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Películas populares </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{PopularMovies.map((movie) => renderContent(movie, 'movie'))}
				</ScrollView>
			</View>

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="video-vintage" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Series populares </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{PopularSeries.map((series) => renderContent(series, 'filmstrip'))}
				</ScrollView>
			</View>

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="gamepad-variant" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Videojuegos populares </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{PopularGames.map((game) => renderContent(game, 'gamepad-outline'))}
				</ScrollView>
			</View>

			<View className="px-4">
				<View className="mb-4 flex-row space-x-4">
					<MaterialCommunityIcons name="music-circle" size={24} color="#9ca3af" />
					<Text className="mb-4 text-lg font-semibold text-white"> Canciones populares </Text>
				</View>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
					{PopularSongs.map((song) => renderSong(song))}
				</ScrollView>
			</View>
			</ScrollView>
		</Screen>
	);

}
