import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
    // Estados
    const [busqueda, setBusqueda] = useState('');
    const [recursoBusqueda, setRecursoBusqueda] = useState('Películas');
    const [menuAbierto, setMenuAbierto] = useState(false);
	const [loading, setLoading] = useState(false);
    
    // Nuevo estado para los resultados
    const [resultados, setResultados] = useState([]);

    const opciones = ["Libros", "Películas", "Series", "Videojuegos", "Canciones"];

    // Funciones de mapeo para normalizar los datos de cada API
    const mapBookToResult = (book: any) => ({
        id: book.artistId || Math.random(),
        title: book.title || 'Sin título',
        artist: book.artistName || 'Desconocido',
        cover: book.cover || '',
        genre: book.genres && book.genres.length > 0 ? book.genres[0] : 'Desconocido',
    });

    const mapFilmToResult = (film: any) => ({
        id: film.id,
        title: film.title || 'Sin título',
        artist: film.director || 'Desconocido',
        cover: film.poster || '',
        genre: Array.isArray(film.genre) 
            ? (film.genre.length > 0 ? film.genre[0] : 'Desconocido')
            : (film.genre || 'Desconocido'),
    });

    const mapGameToResult = (game: any) => ({
        id: game.id,
        title: game.name || 'Sin título',
        artist: game.developer || 'Desconocido',
        cover: game.image || '',
        genre: game.genres && game.genres.length > 0 ? game.genres[0] : 'Desconocido',
    });

    const mapSeriesToResult = (series: any) => ({
        id: series.id,
        title: series.title || 'Sin título',
        artist: 'Serie TV',
        cover: series.image_medium || series.image_original || '',
        genre: series.genres && series.genres.length > 0 ? series.genres[0] : 'Desconocido',
    });

    const mapSongToResult = (song: any) => ({
        id: song.id,
        title: song.title || 'Sin título',
        artist: song.artist || 'Desconocido',
        cover: song.cover || '',
        genre: song.genre || 'Desconocido',
    });

    // Función para manejar la búsqueda
    const handleSearch = async (termino: string, tipoRecurso: string) => {
        if (!termino.trim()) return;
		setLoading(true);
        // Limpiamos resultados anteriores para dar feedback visual de "cargando" si quisieras
        setResultados([]); 

        const apiUrls: { [key: string]: string } = {
            'Libros': 'https://javierub-topfive.hf.space/fetchBooks',
            'Películas': 'https://javierub-topfive.hf.space/fetchFilms',
            'Series': 'https://javierub-topfive.hf.space/fetchSeries',
            'Videojuegos': 'https://javierub-topfive.hf.space/fetchGames',
            'Canciones': 'https://javierub-topfive.hf.space/fetchSong',
        };

        const apiUrl = apiUrls[tipoRecurso];

        if (!apiUrl) {
            console.log(`No se encontró API para ${tipoRecurso}`);
			setLoading(false);
            return;
        }

        const apiKey = process.env.EXPO_PUBLIC_API_KEY;

        if (!apiKey) {
            console.log('No se encontró la API_KEY en las variables de entorno');
			setLoading(false);
            return;
        }

        try {
            const url = `${apiUrl}?term=${encodeURIComponent(termino)}`;
            const response = await fetch(url, {
                headers: {
                    'X-API-Key': apiKey
                }
            });
            const resultado = await response.json();
			console.log(`Resultado bruto de la búsqueda de ${tipoRecurso}:`, resultado);

            // Mapear los resultados según el tipo de recurso
            let resultadosMapeados: any[] = [];
            
            if (tipoRecurso === 'Libros') {
                resultadosMapeados = resultado.map(mapBookToResult);
            } else if (tipoRecurso === 'Películas') {
                resultadosMapeados = resultado.map(mapFilmToResult);
            } else if (tipoRecurso === 'Series') {
                resultadosMapeados = resultado.map(mapSeriesToResult);
            } else if (tipoRecurso === 'Videojuegos') {
                resultadosMapeados = resultado.map(mapGameToResult);
            } else if (tipoRecurso === 'Canciones') {
                resultadosMapeados = resultado.map(mapSongToResult);
            }

            // Guardamos el resultado en el estado
            setResultados(resultadosMapeados);
			setLoading(false);
            
            // Cerramos el menú si estaba abierto por error
            setMenuAbierto(false);

            console.log('Resultado de la búsqueda (normalizado):', resultadosMapeados);

        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
			setLoading(false);
        }
    };

    // Función para manejar el click en un item
    const handleItemPress = (item: any) => {
        console.log("Has seleccionado:", item.title);
        // Aquí iría la navegación al detalle, por ejemplo:
        // router.push(`/details/${item.id}`);
    };
		

    // Componente para renderizar cada item de la lista
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            className="flex-row bg-slate-800 mb-3 rounded-xl border border-slate-700 overflow-hidden shadow-sm active:bg-slate-700"
            onPress={() => handleItemPress(item)}
            activeOpacity={0.7}
        >
            {/* Imagen de Portada */}
            <Image 
                source={{ uri: item.cover }} 
                className="w-24 h-24 bg-slate-900"
                resizeMode="cover"
            />
            
            {/* Información */}
            <View className="flex-1 p-3 justify-center">
                <Text className="text-white text-lg font-bold leading-tight mb-1" numberOfLines={2}>
                    {item.title}
                </Text>
                
                {/* Artista (útil mostrarlo también) */}
                <Text className="text-gray-400 text-sm mb-2" numberOfLines={1}>
                    {item.artist}
                </Text>

                {/* Badge de Género */}
                <View className="flex-row">
                    <View className="bg-purple-900/60 px-2 py-1 rounded border border-purple-500/30">
                        <Text className="text-purple-300 text-xs font-bold uppercase tracking-wider">
                            {item.genre || "Desconocido"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Icono de flecha (opcional, mejora la UX) */}
            <View className="justify-center pr-3 opacity-50">
                <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
            </View>
        </TouchableOpacity>
    );

    return (
        <Screen>
            <StatusBar style="light" />
            
            <View className="flex-1 px-4 pt-6">

                {/* --- ZONA DE BÚSQUEDA (z-50) --- */}
                <View className="z-50 relative mb-4">
                    <View className="flex-row items-center bg-slate-800 rounded-lg border border-slate-700 h-14 shadow-lg">
                        <View className="pl-3 justify-center">
                            <MaterialCommunityIcons name="magnify" size={24} color="#94a3b8" />
                        </View>
                        <TextInput
                            className="flex-1 text-white text-base px-3 h-full"
                            placeholder={`Buscar ${recursoBusqueda.toLowerCase()}...`}
                            placeholderTextColor="#64748b"
                            value={busqueda}
                            onChangeText={setBusqueda}
                            onSubmitEditing={() => handleSearch(busqueda, recursoBusqueda)}
                            returnKeyType="search"
                        />
                        <View className="h-6 w-[1px] bg-slate-600" />
                        <TouchableOpacity 
                            className="flex-row items-center justify-center px-4 h-full"
                            activeOpacity={0.7}
                            onPress={() => setMenuAbierto(!menuAbierto)}
                        >
                            <View className="max-w-[80px]">
                                <Text className="text-gray-300 font-medium mr-1" numberOfLines={1}>
                                    {recursoBusqueda}
                                </Text>
                            </View>
                            <MaterialCommunityIcons name={menuAbierto ? "chevron-up" : "chevron-down"} size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    {/* Desplegable */}
                    {menuAbierto && (
                        <View className="absolute top-16 right-0 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden z-50">
                            {opciones.map((opcion, index) => (
                                <TouchableOpacity 
                                    key={index}
                                    className={`p-3 flex-row items-center justify-between ${index !== opciones.length - 1 ? 'border-b border-slate-700' : ''} ${recursoBusqueda === opcion ? 'bg-slate-700' : 'active:bg-slate-700/50'}`}
                                    onPress={() => {
                                        setRecursoBusqueda(opcion);
                                        setMenuAbierto(false);
                                    }}
                                >
                                    <Text className={`text-base ${recursoBusqueda === opcion ? 'text-white font-bold' : 'text-gray-400'}`}>
                                        {opcion}
                                    </Text>
                                    {recursoBusqueda === opcion && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* --- CONTENIDO PRINCIPAL --- */}
                {/* Renderizado condicional: Si hay resultados mostramos lista, si no, "En Construcción" */}
                {resultados.length > 0 ? (
                    <FlatList
                        className="flex-1 -z-10" // Importante el z negativo para no tapar el dropdown
                        data={resultados}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
                    />
                ) : (
                    <ScrollView className="flex-1 -z-10" showsVerticalScrollIndicator={false}>
                        <View className="flex-1 items-center justify-center py-12">
                            <View className="mb-8 items-center">
                                <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-white/5">
                                    <View className="h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-800">
                                        <MaterialCommunityIcons name="hammer-wrench" size={64} color="#fff" />
                                    </View>
                                </View>
                                <Text className="mb-3 text-center text-3xl font-bold text-white">
                                    En Construcción
                                </Text>
                                <Text className="text-gray-500 text-center px-4">
                                    Realiza una búsqueda para ver resultados.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                )}
				{loading && (
                    <View className="absolute inset-0 items-center justify-center bg-black bg-opacity-50 z-50">
                        <ActivityIndicator size="large" color="#8b5cf6" />
                    </View>
                )}
            </View>
        </Screen>
    );
}