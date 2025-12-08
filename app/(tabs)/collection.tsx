import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Screen } from 'components/Screen';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useResource } from 'context/ResourceContext';

// --- TIPOS ---

type CategoryType = 'Libros' | 'Películas' | 'Series' | 'Videojuegos' | 'Canciones';
type StatusType = 'TODOS' | 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
type SortType = 'FECHA_DESC' | 'FECHA_ASC';

export default function LibraryScreen() {
  const router = useRouter();
  const { fetchPeliculas, fetchSeries, fetchVideojuegos, fetchLibros, fetchCanciones } = useResource();

  // --- ESTADOS ---
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActual, setCategoriaActual] = useState<CategoryType>('Películas');
  const [menuCategoriaAbierto, setMenuCategoriaAbierto] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados de Filtros
  const [orden, setOrden] = useState<SortType>('FECHA_DESC');
  const [filtroEstado, setFiltroEstado] = useState<StatusType>('TODOS');
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const opcionesCategoria: CategoryType[] = [
    'Libros',
    'Películas',
    'Series',
    'Videojuegos',
    'Canciones',
  ];

  // --- CARGAR DATOS ---
  useEffect(() => {
    cargarDatos();
  }, [categoriaActual, busqueda, filtroEstado, orden, soloFavoritos]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      let fetchFunction;
      
      // Seleccionar la función fetch según la categoría
      switch (categoriaActual) {
        case 'Películas':
          fetchFunction = fetchPeliculas;
          break;
        case 'Series':
          fetchFunction = fetchSeries;
          break;
        case 'Videojuegos':
          fetchFunction = fetchVideojuegos;
          break;
        case 'Libros':
          fetchFunction = fetchLibros;
          break;
        case 'Canciones':
          fetchFunction = fetchCanciones;
          break;
        default:
          fetchFunction = fetchPeliculas;
      }

      const favorito = soloFavoritos ? true : null; // Filtrar por favoritos si está activado
      const estado = filtroEstado === 'TODOS' ? null : filtroEstado;
      const cantidad = null; // Sin límite
      const ordenarPorFecha = orden === 'FECHA_DESC' ? true : (orden === 'FECHA_ASC' ? false : null);

      const resultado = await fetchFunction(busqueda, favorito, estado, cantidad, ordenarPorFecha);
      setData(resultado || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // --- HELPERS VISUALES ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-gray-600';
      case 'EN_CURSO': return 'bg-blue-600';
      case 'COMPLETADO': return 'bg-green-600';
      default: return 'bg-slate-700';
    }
  };

  const getStatusText = (status: string, category: CategoryType) => {
    if (status === 'PENDIENTE') return 'Pendiente';
    if (status === 'COMPLETADO') return 'Completado';
    
    // Texto dinámico para "En curso"
    if (status === 'EN_CURSO') {
      if (category === 'Libros') return 'Leyendo';
      if (category === 'Videojuegos') return 'Jugando';
      if (category === 'Series') return 'Viendo';
      return 'En curso';
    }
    return '';
  };

  const getTitle = (item: any) => {
    // Adaptarse a la estructura de cada recurso
    if (categoriaActual === 'Películas') return item.contenidopelicula?.titulo || 'Sin título';
    if (categoriaActual === 'Series') return item.contenidoserie?.titulo || 'Sin título';
    if (categoriaActual === 'Videojuegos') return item.contenidovideojuego?.titulo || 'Sin título';
    if (categoriaActual === 'Libros') return item.contenidolibro?.titulo || 'Sin título';
    if (categoriaActual === 'Canciones') return item.contenidocancion?.titulo || 'Sin título';
    return 'Sin título';
  };

  const getImage = (item: any) => {
    if (categoriaActual === 'Películas') return item.contenidopelicula?.imagenUrl;
    if (categoriaActual === 'Series') return item.contenidoserie?.imagenUrl;
    if (categoriaActual === 'Videojuegos') return item.contenidovideojuego?.imagenUrl;
    if (categoriaActual === 'Libros') return item.contenidolibro?.imagenUrl;
    if (categoriaActual === 'Canciones') return item.contenidocancion?.imagenUrl;
    return null;
  };

  // --- RENDERIZADO ---

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="mb-3 flex-row overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-sm active:bg-slate-700"
      activeOpacity={0.7}
      onPress={() => {
        console.log(`Abrir ${getTitle(item)}`);
      }}
    >
      {/* Imagen */}
      <Image
        source={{ uri: getImage(item) || 'https://via.placeholder.com/150' }}
        className="h-28 w-20 bg-slate-900"
        resizeMode="cover"
      />

      {/* Info Principal */}
      <View className="flex-1 p-3 justify-between">
        <View>
            <View className="flex-row justify-between items-start">
                <Text className="text-white font-bold text-lg flex-1 mr-2" numberOfLines={1}>
                    {getTitle(item)}
                </Text>
                {item.favorito && (
                    <MaterialCommunityIcons name="heart" size={16} color="#ef4444" />
                )}
            </View>
            <Text className="text-gray-400 text-sm" numberOfLines={1}>
              {new Date(item.fechacreacion).toLocaleDateString()}
            </Text>
        </View>
        
        <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-2">
                {/* Badge Rating */}
                <View className="flex-row items-center bg-purple-900/40 px-2 py-1 rounded border border-purple-500/20">
                    <MaterialCommunityIcons name="star" size={12} color="#fbbf24" />
                    <Text className="text-purple-200 text-xs font-bold ml-1">{item.calificacion || 0}</Text>
                </View>
            </View>

            {/* Badge Estado */}
            <View className={`px-2 py-1 rounded ${getStatusColor(item.estado)}`}>
                <Text className="text-[10px] text-white font-bold uppercase">
                    {getStatusText(item.estado, categoriaActual)}
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
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#a855f7" />
            <Text className="mt-4 text-gray-400">Cargando...</Text>
          </View>
        ) : (
          <FlatList
              className="-z-10 flex-1"
              data={data}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
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
        )}

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