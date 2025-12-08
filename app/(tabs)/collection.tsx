import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- TIPOS Y MOCK DATA ---

type CategoryType = 'Todo' | 'Libros' | 'Películas' | 'Series' | 'Videojuegos' | 'Canciones' | 'Colecciones';
type StatusType = 'TODOS' | 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO' | 'ABANDONADO';
type SortType = 'FECHA_DESC' | 'FECHA_ASC' | 'RATING_DESC' | 'TITULO_ASC';

interface LibraryItem {
  id: string;
  type: CategoryType; // Simplificado para el ejemplo
  title: string;
  subtitle: string; // Autor, Desarrollador, Artista, etc.
  image: string;
  rating: number; // 0-5
  status: StatusType;
  favorite: boolean;
  createdAt: string; // ISO Date
  metadata?: string; // Plataforma, Género, etc.
}

const MOCK_DATA: LibraryItem[] = [
  {
    id: '1',
    type: 'Videojuegos',
    title: 'Elden Ring',
    subtitle: 'FromSoftware',
    image: 'https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png',
    rating: 5,
    status: 'COMPLETADO',
    favorite: true,
    createdAt: '2023-01-15',
    metadata: 'RPG / Soulslike',
  },
  {
    id: '2',
    type: 'Libros',
    title: 'El Nombre del Viento',
    subtitle: 'Patrick Rothfuss',
    image: 'https://images.booksense.com/images/309/894/9788401352836.jpg',
    rating: 4.5,
    status: 'EN_CURSO',
    favorite: true,
    createdAt: '2023-02-10',
    metadata: 'Fantasía',
  },
  {
    id: '3',
    type: 'Películas',
    title: 'Dune: Parte Dos',
    subtitle: 'Denis Villeneuve',
    image: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
    rating: 4.8,
    status: 'PENDIENTE',
    favorite: false,
    createdAt: '2024-03-01',
    metadata: 'Sci-Fi',
  },
  {
    id: '4',
    type: 'Series',
    title: 'Breaking Bad',
    subtitle: 'Vince Gilligan',
    image: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjktNzcxZi00OTJkLWE5NTktYjA3MGY4Y2Q0NDJjXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_FMjpg_UX1000_.jpg',
    rating: 5,
    status: 'COMPLETADO',
    favorite: true,
    createdAt: '2022-11-20',
    metadata: 'Drama',
  },
  {
    id: '5',
    type: 'Canciones',
    title: 'Bohemian Rhapsody',
    subtitle: 'Queen',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Bohemian_Rhapsody.png',
    rating: 5,
    status: 'COMPLETADO',
    favorite: true,
    createdAt: '2022-05-15',
    metadata: 'Rock',
  },
  {
    id: '6',
    type: 'Videojuegos',
    title: 'Hollow Knight',
    subtitle: 'Team Cherry',
    image: 'https://upload.wikimedia.org/wikipedia/en/0/04/Hollow_Knight_first_cover_art.webp',
    rating: 4.2,
    status: 'ABANDONADO',
    favorite: false,
    createdAt: '2023-06-12',
    metadata: 'Metroidvania',
  },
  {
    id: '7',
    type: 'Libros',
    title: '1984',
    subtitle: 'George Orwell',
    image: 'https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg',
    rating: 4.0,
    status: 'COMPLETADO',
    favorite: false,
    createdAt: '2021-09-01',
    metadata: 'Distopía',
  },
  {
    id: '8',
    type: 'Series',
    title: 'Arcane',
    subtitle: 'Fortiche',
    image: 'https://m.media-amazon.com/images/M/MV5BYmU5OWM5ZTAtNjUzOC00NmUyLTgyOWMtMjlkNjdlMDAzMzU1XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
    rating: 4.9,
    status: 'EN_CURSO',
    favorite: true,
    createdAt: '2024-01-20',
    metadata: 'Animación',
  },
  {
    id: '9',
    type: 'Películas',
    title: 'Inception',
    subtitle: 'Christopher Nolan',
    image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    rating: 4.7,
    status: 'COMPLETADO',
    favorite: true,
    createdAt: '2020-03-15',
    metadata: 'Sci-Fi',
  },
  {
    id: '10',
    type: 'Videojuegos',
    title: 'FIFA 24',
    subtitle: 'EA Sports',
    image: 'https://upload.wikimedia.org/wikipedia/en/b/b9/EA_Sports_FC_24_cover.jpg',
    rating: 3.0,
    status: 'EN_CURSO',
    favorite: false,
    createdAt: '2023-12-25',
    metadata: 'Deportes',
  },
  {
    id: '11',
    type: 'Canciones',
    title: 'Blinding Lights',
    subtitle: 'The Weeknd',
    image: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png',
    rating: 4.0,
    status: 'PENDIENTE',
    favorite: false,
    createdAt: '2024-02-14',
    metadata: 'Synth-pop',
  },
  {
    id: '12',
    type: 'Colecciones',
    title: 'Saga Harry Potter',
    subtitle: 'J.K. Rowling',
    image: 'https://m.media-amazon.com/images/I/71sH3vxziLL._AC_UF1000,1000_QL80_.jpg',
    rating: 4.5,
    status: 'COMPLETADO',
    favorite: true,
    createdAt: '2019-01-01',
    metadata: '7 Libros',
  },
  {
    id: '13',
    type: 'Libros',
    title: 'Hábitos Atómicos',
    subtitle: 'James Clear',
    image: 'https://m.media-amazon.com/images/I/81bgE28aDUL.jpg',
    rating: 4.8,
    status: 'PENDIENTE',
    favorite: false,
    createdAt: '2024-03-05',
    metadata: 'Autoayuda',
  },
  {
    id: '14',
    type: 'Videojuegos',
    title: 'Cyberpunk 2077',
    subtitle: 'CD Projekt Red',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
    rating: 4.1,
    status: 'COMPLETADO',
    favorite: false,
    createdAt: '2023-11-11',
    metadata: 'RPG / FPS',
  },
  {
    id: '15',
    type: 'Series',
    title: 'The Office',
    subtitle: 'Greg Daniels',
    image: 'https://m.media-amazon.com/images/M/MV5BMDNkOTE4NDQtMTNmYi00MWE0LWE4ZTktYTc0NzhhNWIzNzJiXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_FMjpg_UX1000_.jpg',
    rating: 4.6,
    status: 'ABANDONADO',
    favorite: false,
    createdAt: '2021-05-10',
    metadata: 'Comedia',
  },
];

export default function LibraryScreen() {
  const router = useRouter();

  // --- ESTADOS ---
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActual, setCategoriaActual] = useState<CategoryType>('Todo');
  const [menuCategoriaAbierto, setMenuCategoriaAbierto] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // Estados de Filtros
  const [orden, setOrden] = useState<SortType>('FECHA_DESC');
  const [filtroEstado, setFiltroEstado] = useState<StatusType>('TODOS');
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const opcionesCategoria: CategoryType[] = [
    'Todo',
    'Libros',
    'Películas',
    'Series',
    'Videojuegos',
    'Canciones',
    'Colecciones',
  ];

  // --- LÓGICA DE FILTRADO Y ORDENACIÓN ---
  const dataFiltrada = useMemo(() => {
    let resultado = MOCK_DATA;

    // 1. Filtrar por Categoría
    if (categoriaActual !== 'Todo') {
      resultado = resultado.filter((item) => item.type === categoriaActual);
    }

    // 2. Filtrar por Texto (Búsqueda local)
    if (busqueda.trim()) {
      const term = busqueda.toLowerCase();
      resultado = resultado.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.subtitle.toLowerCase().includes(term)
      );
    }

    // 3. Filtrar por Estado
    if (filtroEstado !== 'TODOS') {
      resultado = resultado.filter((item) => item.status === filtroEstado);
    }

    // 4. Filtrar por Favoritos
    if (soloFavoritos) {
      resultado = resultado.filter((item) => item.favorite);
    }

    // 5. Ordenar
    resultado = [...resultado].sort((a, b) => {
      switch (orden) {
        case 'FECHA_DESC':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'FECHA_ASC':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'RATING_DESC':
          return b.rating - a.rating;
        case 'TITULO_ASC':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return resultado;
  }, [categoriaActual, busqueda, filtroEstado, soloFavoritos, orden]);

  // --- HELPERS VISUALES ---
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-gray-600';
      case 'EN_CURSO': return 'bg-blue-600';
      case 'COMPLETADO': return 'bg-green-600';
      case 'ABANDONADO': return 'bg-red-600';
      default: return 'bg-slate-700';
    }
  };

  const getStatusText = (status: StatusType, category: CategoryType) => {
    if (status === 'PENDIENTE') return 'Pendiente';
    if (status === 'COMPLETADO') return 'Completado';
    if (status === 'ABANDONADO') return 'Abandonado';
    
    // Texto dinámico para "En curso"
    if (status === 'EN_CURSO') {
      if (category === 'Libros') return 'Leyendo';
      if (category === 'Videojuegos') return 'Jugando';
      if (category === 'Series') return 'Viendo';
      return 'En curso';
    }
    return '';
  };

  // --- RENDERIZADO ---

  const renderItem = ({ item }: { item: LibraryItem }) => (
    <TouchableOpacity
      className="mb-3 flex-row overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-sm active:bg-slate-700"
      activeOpacity={0.7}
      onPress={() => {
        // Navegación (Ejemplo)
        // router.push(...)
        console.log(`Abrir ${item.title}`);
      }}
    >
      {/* Imagen */}
      <Image
        source={{ uri: item.image }}
        className="h-28 w-20 bg-slate-900"
        resizeMode="cover"
      />

      {/* Info Principal */}
      <View className="flex-1 p-3 justify-between">
        <View>
            <View className="flex-row justify-between items-start">
                <Text className="text-white font-bold text-lg flex-1 mr-2" numberOfLines={1}>
                    {item.title}
                </Text>
                {item.favorite && (
                    <MaterialCommunityIcons name="heart" size={16} color="#ef4444" />
                )}
            </View>
            <Text className="text-gray-400 text-sm" numberOfLines={1}>{item.subtitle}</Text>
        </View>
        
        <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-2">
                {/* Badge Rating */}
                <View className="flex-row items-center bg-purple-900/40 px-2 py-1 rounded border border-purple-500/20">
                    <MaterialCommunityIcons name="star" size={12} color="#fbbf24" />
                    <Text className="text-purple-200 text-xs font-bold ml-1">{item.rating.toFixed(1)}</Text>
                </View>
                
                {/* Badge Tipo (Solo si estamos en TODO) */}
                {categoriaActual === 'Todo' && (
                    <Text className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                        {item.type}
                    </Text>
                )}
            </View>

            {/* Badge Estado */}
            <View className={`px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                <Text className="text-[10px] text-white font-bold uppercase">
                    {getStatusText(item.status, item.type)}
                </Text>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <StatusBar style="light" />

      <View className="flex-1 px-4 pt-6">
        <Text className="mb-4 text-3xl font-bold text-white">Mi Biblioteca</Text>

        {/* --- BARRA DE BÚSQUEDA Y CATEGORÍA --- */}
        <View className="relative z-50 mb-3">
          <View className="h-12 flex-row items-center rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
            <View className="justify-center pl-3">
              <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" />
            </View>
            
            <TextInput
              className="h-full flex-1 px-3 text-base text-white"
              placeholder={`Buscar en ${categoriaActual}...`}
              placeholderTextColor="#64748b"
              value={busqueda}
              onChangeText={setBusqueda}
            />
            
            <View className="h-6 w-[1px] bg-slate-600" />
            
            <TouchableOpacity
              className="h-full flex-row items-center justify-center px-3"
              activeOpacity={0.7}
              onPress={() => {
                  setMenuCategoriaAbierto(!menuCategoriaAbierto);
                  setFiltrosAbiertos(false); // Cerrar el otro menú si está abierto
              }}>
              <View className="max-w-[90px]">
                <Text className="mr-1 font-medium text-xs text-gray-300" numberOfLines={1}>
                  {categoriaActual}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={menuCategoriaAbierto ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#94a3b8"
              />
            </TouchableOpacity>

            <TouchableOpacity 
                className={`h-full w-12 items-center justify-center rounded-r-lg border-l border-slate-600 ${filtrosAbiertos || soloFavoritos || filtroEstado !== 'TODOS' ? 'bg-purple-900/30' : 'bg-transparent'}`}
                onPress={() => {
                    setFiltrosAbiertos(!filtrosAbiertos);
                    setMenuCategoriaAbierto(false);
                }}
            >
                 <MaterialCommunityIcons name="tune-vertical" size={20} color={filtrosAbiertos || soloFavoritos || filtroEstado !== 'TODOS' ? '#a855f7' : '#94a3b8'} />
            </TouchableOpacity>
          </View>

          {/* DESPLEGABLE DE CATEGORÍAS */}
          {menuCategoriaAbierto && (
            <View className="absolute right-12 top-14 z-50 w-48 overflow-hidden rounded-lg border border-slate-600 bg-slate-800 shadow-xl">
              {opcionesCategoria.map((opcion, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center justify-between p-3 ${index !== opcionesCategoria.length - 1 ? 'border-b border-slate-700' : ''} ${categoriaActual === opcion ? 'bg-slate-700' : 'active:bg-slate-700/50'}`}
                  onPress={() => {
                    setCategoriaActual(opcion);
                    setMenuCategoriaAbierto(false);
                  }}>
                  <Text
                    className={`text-sm ${categoriaActual === opcion ? 'font-bold text-white' : 'text-gray-400'}`}>
                    {opcion}
                  </Text>
                  {categoriaActual === opcion && (
                    <MaterialCommunityIcons name="check" size={14} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* --- PANEL DE FILTROS AVANZADOS --- */}
        {filtrosAbiertos && (
            <View className="mb-4 rounded-xl border border-slate-700 bg-slate-800/80 p-4">
                <View className="mb-4">
                    <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Ordenar por</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                        {[
                            { id: 'FECHA_DESC', label: 'Más recientes' },
                            { id: 'FECHA_ASC', label: 'Más antiguos' },
                            { id: 'RATING_DESC', label: 'Mejor valorados' },
                            { id: 'TITULO_ASC', label: 'A - Z' },
                        ].map((opt) => (
                            <TouchableOpacity
                                key={opt.id}
                                onPress={() => setOrden(opt.id as SortType)}
                                className={`rounded-full border px-3 py-1.5 ${orden === opt.id ? 'bg-purple-600 border-purple-600' : 'border-slate-600 bg-transparent'}`}
                            >
                                <Text className={`text-xs ${orden === opt.id ? 'text-white font-bold' : 'text-gray-400'}`}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Estado</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                         {[
                            { id: 'TODOS', label: 'Todos' },
                            { id: 'PENDIENTE', label: 'Pendiente' },
                            { id: 'EN_CURSO', label: 'En curso' },
                            { id: 'COMPLETADO', label: 'Completado' },
                            { id: 'ABANDONADO', label: 'Abandonado' },
                        ].map((opt) => (
                            <TouchableOpacity
                                key={opt.id}
                                onPress={() => setFiltroEstado(opt.id as StatusType)}
                                className={`rounded-full border px-3 py-1.5 ${filtroEstado === opt.id ? 'bg-slate-200 border-white' : 'border-slate-600 bg-transparent'}`}
                            >
                                <Text className={`text-xs ${filtroEstado === opt.id ? 'text-slate-900 font-bold' : 'text-gray-400'}`}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View className="flex-row items-center justify-between pt-2 border-t border-slate-700">
                    <Text className="text-gray-300 text-sm">Solo Favoritos</Text>
                    <TouchableOpacity 
                        onPress={() => setSoloFavoritos(!soloFavoritos)}
                        className={`w-12 h-7 rounded-full justify-center px-1 ${soloFavoritos ? 'bg-purple-600' : 'bg-slate-600'}`}
                    >
                        <View className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition ${soloFavoritos ? 'translate-x-5' : 'translate-x-0'}`} />
                    </TouchableOpacity>
                </View>
            </View>
        )}

        {/* --- LISTA DE RESULTADOS --- */}
        <FlatList
            className="-z-10 flex-1"
            data={dataFiltrada}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
                <View className="mt-10 items-center justify-center">
                    <MaterialCommunityIcons name="bookshelf" size={64} color="#334155" />
                    <Text className="mt-4 text-gray-500 text-center">No se encontraron elementos con estos filtros.</Text>
                </View>
            }
        />

        {/* BOTÓN FLOTANTE (Opcional, para añadir manual) */}
        <TouchableOpacity 
            className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-purple-600 shadow-lg shadow-purple-900/50"
            activeOpacity={0.8}
            onPress={() => router.push('/search')}
        >
            <MaterialCommunityIcons name="plus" size={30} color="white" />
        </TouchableOpacity>

      </View>
    </Screen>
  );
}