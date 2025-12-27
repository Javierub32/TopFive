import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SearchScreen() {
  // Estados
  const [busqueda, setBusqueda] = useState('');
  const [recursoBusqueda, setRecursoBusqueda] = useState('Películas');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado para los resultados
  const [resultados, setResultados] = useState([]);
  const [datosOriginales, setDatosOriginales] = useState([]);

  const opciones = ['Libros', 'Películas', 'Series', 'Videojuegos', 'Canciones'];

  const mapBookToResult = (book) => ({
    id: book.id || `book-${Math.random()}`,
    title: book.title || 'Sin título',
    // BookResponse: usa 'autor' en lugar de 'artistName'
    artist: book.autor || 'Desconocido',
    // BookResponse: usa 'image' en lugar de 'cover'
    cover: book.image || '',
    // BookResponse: 'genre' es List[str]
    genre: book.genre && book.genre.length > 0 ? book.genre[0] : 'Literatura',
  });

  const mapFilmToResult = (film) => ({
    id: film.id,
    title: film.title || 'Sin título',
    // FilmResponse: No tiene 'autor', usamos el rating. 'language' ya no viene.
    artist: film.rating ? `⭐ ${film.rating.toFixed(1)}` : 'Desconocido',
    // FilmResponse: usa 'image' en lugar de 'poster'
    cover: film.image || '',
    genre: film.releaseDate ? film.releaseDate.split('-')[0] : 'Desconocido',
  });

  const mapSeriesToResult = (series) => ({
    id: series.id,
    title: series.title || 'Sin título',
    // SeriesResponse: No tiene 'autor', usamos 'rating' o texto fijo
    artist: series.rating ? `⭐ ${series.rating.toFixed(1)}` : 'Desconocido',
    // SeriesResponse: usa 'image' (ya no image_medium)
    cover: series.image || '',
    // SeriesResponse: 'genre' es List[str]
    genre: series.genre && series.genre.length > 0 ? series.genre[0] : 'TV',
  });

  const mapGameToResult = (game) => ({
    id: game.id,
    title: game.title, // GameResponse: usa 'title' en vez de 'name'
    artist: game.autor || 'Desconocido', // GameResponse: usa 'autor' en vez de 'developer'
    cover: game.image || '',
    // GameResponse: 'genre' es List[str]
    genre: game.genre && game.genre.length > 0 ? game.genre[0] : 'Gaming',
  });

  const mapSongToResult = (song) => ({
    id: song.id,
    title: song.title || 'Sin título',
    artist: song.autor || 'Desconocido', // SongResponse: usa 'autor' en vez de 'artist'
    cover: song.image || '', // SongResponse: usa 'image'
    // SongResponse: 'genre' es str (no lista)
    genre: song.genre || 'Música',
  });

  // Función para manejar la búsqueda
  const handleSearch = async (termino, tipoRecurso) => {
    if (!termino.trim()) return;
    setLoading(true);
    setResultados([]);

    const apiUrls = {
      Libros: 'https://javierub-topfive.hf.space/fetchBooks',
      Películas: 'https://javierub-topfive.hf.space/fetchFilms',
      Series: 'https://javierub-topfive.hf.space/fetchSeries',
      Videojuegos: 'https://javierub-topfive.hf.space/fetchGames',
      Canciones: 'https://javierub-topfive.hf.space/fetchSong',
    };

    const apiUrl = apiUrls[tipoRecurso];

    if (!apiUrl) {
      console.log(`No se encontró API para ${tipoRecurso}`);
      setLoading(false);
      return;
    }

    const apiKey = process.env.EXPO_PUBLIC_API_KEY;

    try {
      const url = `${apiUrl}?term=${encodeURIComponent(termino)}`;
      const response = await fetch(url, {
        headers: {
          'X-API-Key': apiKey || '', // Manejo seguro si no hay key definida
        },
      });
      const resultado = await response.json();
      setDatosOriginales(resultado);

      let resultadosMapeados = [];

      if (Array.isArray(resultado)) {
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
      } else {
        console.warn('La API no devolvió un array:', resultado);
      }

      setResultados(resultadosMapeados);
      setLoading(false);
      setMenuAbierto(false);
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
      setLoading(false);
    }
  };

  // Función para manejar el click en un item
  const handleItemPress = (item, index) => {
    const typeMap = {
      Libros: 'book',
      Películas: 'film',
      Series: 'series',
      Videojuegos: 'game',
      Canciones: 'song',
    };

    const paramMap = {
      Libros: 'bookData',
      Películas: 'filmData',
      Series: 'seriesData',
      Videojuegos: 'gameData',
      Canciones: 'songData',
    };

    const type = typeMap[recursoBusqueda];
    const paramName = paramMap[recursoBusqueda];
    const itemOriginal = datosOriginales[index];
    
    console.log(`/details/${type}/${type}Content`);
    
    router.push({
      pathname: `/details/${type}/${type}Content`,
      params: { [paramName]: JSON.stringify(itemOriginal) },
    });
  };

  // Componente para renderizar cada item of the list
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      className="mb-3 flex-row overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-sm active:bg-slate-700"
      onPress={() => handleItemPress(item, index)}
      activeOpacity={0.7}>
      {/* Imagen de Portada */}
      <Image
        source={{ uri: item.cover || 'https://via.placeholder.com/150' }}
        className="h-36 w-24 bg-slate-900"
        resizeMode="cover"
      />

      {/* Información */}
      <View className="flex-1 justify-center p-3">
        <Text className="mb-1 text-lg font-bold leading-tight text-white" numberOfLines={2}>
          {item.title}
        </Text>

        {/* Artista / Autor / Rating */}
        <Text className="mb-2 text-sm text-gray-400" numberOfLines={1}>
          {item.artist}
        </Text>

        {/* Badge de Género */}
        <View className="flex-row">
          <View className="rounded border border-purple-500/30 bg-purple-900/60 px-2 py-1">
            <Text className="text-xs font-bold uppercase tracking-wider text-purple-300">
              {item.genre || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Icono de flecha */}
      <View className="justify-center pr-3 opacity-50">
        <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  const iconosPorCategoria = {
    'Libros': 'book-open-page-variant',
    'Películas': 'movie-open', 
    'Series': 'television-classic',
    'Videojuegos': 'google-controller',
    'Canciones': 'music',
  };

  return (
    <Screen>
      <StatusBar style="light" />

      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold text-white">Búsqueda</Text>
          {/* --- ZONA DE BÚSQUEDA --- */}
        <View className="relative z-50">
          <View className="h-12 flex-row items-center rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
            <View className="justify-center pl-3">
              <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" />
            </View>
            <TextInput
              className="h-full flex-1 px-3 text-base text-white"
              placeholder={`Buscar ${recursoBusqueda}...`}
              placeholderTextColor="#64748b"
              value={busqueda}
              onChangeText={setBusqueda}
              onSubmitEditing={() => handleSearch(busqueda, recursoBusqueda)}
              returnKeyType="search"
            />
            <View className="h-6 w-[1px] bg-slate-600" />
            <TouchableOpacity
              className="h-full flex-row items-center justify-center px-4"
              activeOpacity={0.7}
              onPress={() => setMenuAbierto(!menuAbierto)}>
              <View className="max-w-[80px]">
                <Text className="mr-1 font-medium text-gray-300" numberOfLines={1}>
                  {recursoBusqueda}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={menuAbierto ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#94a3b8"
              />
            </TouchableOpacity>
          </View>

          {/* Desplegable */}
          {menuAbierto && (
            <View className="absolute right-0 top-16 z-50 w-48 overflow-hidden rounded-lg border border-slate-600 bg-slate-800 shadow-xl">
              {opciones.map((opcion, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center justify-between p-3 ${index !== opciones.length - 1 ? 'border-b border-slate-700' : ''} ${recursoBusqueda === opcion ? 'bg-slate-700' : 'active:bg-slate-700/50'}`}
                  onPress={() => {
                    setRecursoBusqueda(opcion);
                    setMenuAbierto(false);
                    setResultados([]);
                  }}>
                  <Text
                    className={`text-base ${recursoBusqueda === opcion ? 'font-bold text-white' : 'text-gray-400'}`}>
                    {opcion}
                  </Text>
                  {recursoBusqueda === opcion && (
                    <MaterialCommunityIcons name="check" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* --- CONTENIDO PRINCIPAL --- */}
        {resultados.length > 0 ? (
          <FlatList
            className="-z-10 flex-1"
            data={resultados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
          />
        ) : (
          <View className="-z-10 flex-1 items-center justify-center">
            <View className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-white/5">
              <View className="h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-800">
                <MaterialCommunityIcons name={iconosPorCategoria[recursoBusqueda] || 'hammer-wrench'} size={64} color="#fff" />
              </View>
            </View>
            <Text className="mb-3 text-center text-3xl font-bold text-white">
              {recursoBusqueda}
            </Text>
            <Text className="px-4 text-center text-gray-500">
              Realiza una búsqueda para ver resultados.
            </Text>
          </View>
        )}

        {loading && (
          <View className="absolute inset-0 z-50 items-center justify-center bg-[#0f111a] bg-opacity-50">
            <ActivityIndicator size="large" color="#8b5cf6" />
          </View>
        )}
      </View>
    </Screen>
  );
}
