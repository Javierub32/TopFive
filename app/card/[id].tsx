import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function CardDetail() {
	const { id, cardData } = useLocalSearchParams();

	const [card, setCard] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			if (cardData) {
				try {
					const parsedCard = JSON.parse(cardData as string);
					setCard(parsedCard);
					setLoading(false);
					return;
				} catch (e) {
					console.error("Error al leer datos locales", e);
				}
			}
		};

		loadData();
	}, [id, cardData]);

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-[#18122B]">
				<ActivityIndicator size="large" color="#d9d1e0ff" />
				<Text className="mt-4 font-bold text-white">Cargando carta...</Text>
			</View>
		);
	}

	if (!card) {
		return (
			<View className="flex-1 items-center justify-center bg-[#18122B]">
				<MaterialCommunityIcons name="card-off" size={60} color="#6B7280" />
				<Text className="mt-4 text-xl font-bold text-white">Carta no encontrada</Text>
				<TouchableOpacity
					onPress={() => router.back()}
					className="mt-6 rounded-full bg-[#8B2DF0] px-8 py-3"
				>
					<Text className="font-bold text-white">Volver</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// Valores por defecto para datos faltantes
	const cardName = card.name || 'Desconocido';
	const cardHp = card.hp || 'Desconocido';
	const cardType = card.type || 'Desconocido';
	const cardSet = card.set || 'Desconocido';
	const cardRarity = card.rarity || 'Desconocido';
	const cardNumber = card.number || 'Desconocido';
	const cardAutor = card.autor || card.illustrator || 'Desconocido';
	const cardPrice = card.price || card.precio || 'Desconocido';
	const cardImage = card.image_url || null;
	const cardSetLogo = card.setLogo || card.set_logo || null;

	// Función para obtener el color según el tipo
	const getTypeColor = (type: string) => {
		const typeColors: { [key: string]: string } = {
			'Fire': '#F08030',
			'Water': '#6890F0',
			'Grass': '#78C850',
			'Electric': '#F8D030',
			'Psychic': '#F85888',
			'Fighting': '#C03028',
			'Darkness': '#705848',
			'Metal': '#B8B8D0',
			'Dragon': '#7038F8',
			'Fairy': '#EE99AC',
			'Colorless': '#A8A878',
		};
		return typeColors[type] || '#8B2DF0';
	};

	return (
		<View className="flex-1 bg-[#18122B]">
			<StatusBar style="light" />

			{/* Header con botón de volver */}
			<View className="absolute left-0 right-0 top-0 z-50 px-4 pt-12">
				<TouchableOpacity
					onPress={() => router.push('/(tabs)/collection')}
					className="h-12 w-12 items-center justify-center rounded-full bg-black/60"
				>
					<FontAwesome5 name="arrow-left" size={20} color="white" />
				</TouchableOpacity>
			</View>

			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Imagen de la carta con gradiente */}
				<View className="relative items-center pt-20">
					<LinearGradient
						colors={['#8B2DF0', '#18122B']}
						className="absolute left-0 right-0 top-0 h-96"
					/>

					{cardImage ? (
						<Image
							source={{ uri: cardImage }}
							className="h-[400px] w-[280px] rounded-2xl shadow-2xl"
							resizeMode="contain"
						/>
					) : (
						<View className="h-[400px] w-[280px] items-center justify-center rounded-2xl bg-gradient-to-br from-purple-900 to-purple-700 shadow-2xl">
							<MaterialCommunityIcons name="help-circle-outline" size={80} color="#fff" />
							<Text className="mt-4 text-white">Sin imagen</Text>
						</View>
					)}
				</View>

				{/* Contenido principal */}
				<View className="mt-6 px-6">
					{/* Nombre y HP */}
					<View className="mb-6">
						<View className="mb-2 flex-row items-center justify-between">
							<Text className="flex-1 text-4xl font-bold text-white">{cardName}</Text>

						</View>

						{/* Número de carta */}
						<Text className="text-lg text-purple-300">#{cardNumber}</Text>
					</View>

					{/* Tipo */}
					<View className="mb-4">
						<Text className="mb-2 text-sm uppercase tracking-wider text-gray-400">Tipo</Text>
						<View
							className="inline-flex flex-row items-center self-start rounded-full px-4 py-2"
							style={{ backgroundColor: getTypeColor(cardType) }}
						>
							<MaterialCommunityIcons name="pokeball" size={18} color="white" />
							<Text className="ml-2 font-bold text-white">{cardType}</Text>
						</View>
					</View>

					{/* Grid de información */}
					<View className="mb-4 flex-row flex-wrap gap-4">
						{/* Set */}
						<View className="flex-1 min-w-[45%] rounded-2xl bg-white/10 p-4">
							<View className="mb-2 flex-row items-center">
								<MaterialCommunityIcons name="folder-multiple" size={20} color="#8B2DF0" />
								<Text className="ml-2 text-xs uppercase tracking-wider text-gray-400">Colección</Text>
							</View>
							<Text className="text-lg font-semibold text-white">{cardSet}</Text>
							{cardSetLogo && (
								<Image
									source={{ uri: cardSetLogo }}
									className="mt-2 h-8 w-16"
									resizeMode="contain"
								/>
							)}
						</View>

						{/* Rareza */}
						<View className="flex-1 min-w-[45%] rounded-2xl bg-white/10 p-4">
							<View className="mb-2 flex-row items-center">
								<MaterialCommunityIcons name="star" size={20} color="#FFD700" />
								<Text className="ml-2 text-xs uppercase tracking-wider text-gray-400">Rareza</Text>
							</View>
							<Text className="text-lg font-semibold text-white">{cardRarity}</Text>
						</View>

						{/* Ilustrador */}
						<View className="flex-1 min-w-[45%] rounded-2xl bg-white/10 p-4">
							<View className="mb-2 flex-row items-center">
								<MaterialCommunityIcons name="brush" size={20} color="#8B2DF0" />
								<Text className="ml-2 text-xs uppercase tracking-wider text-gray-400">Ilustrador</Text>
							</View>
							<Text className="text-lg font-semibold text-white">{cardAutor}</Text>
						</View>

						{/* Precio */}
						<View className="flex-1 min-w-[45%] rounded-2xl bg-white/10 p-4">
							<View className="mb-2 flex-row items-center">
								<MaterialCommunityIcons name="currency-usd" size={20} color="#10B981" />
								<Text className="ml-2 text-xs uppercase tracking-wider text-gray-400">Precio</Text>
							</View>
							<Text className="text-lg font-semibold text-white">
								{cardPrice !== 'Desconocido' ? `$${cardPrice} ` : cardPrice}
							</Text>
						</View>
					</View>

					{/* Fecha de obtención (si existe) */}
					{card.obtained_at && (
						<View className="mb-4 rounded-2xl bg-gradient-to-r from-purple-900/50 to-purple-700/50 p-4">
							<View className="mb-2 flex-row items-center">
								<MaterialCommunityIcons name="calendar-check" size={20} color="#8B2DF0" />
								<Text className="ml-2 text-xs uppercase tracking-wider text-gray-400">Obtenida el</Text>
							</View>
							<Text className="text-lg font-semibold text-white">
								{new Date(card.obtained_at).toLocaleDateString('es-ES', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}