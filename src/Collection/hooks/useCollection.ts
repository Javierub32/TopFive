import { useState, useEffect, use } from 'react';
import { useRouter } from 'expo-router';
import { useResource } from 'context/ResourceContext';

export type CategoryType = 'Libros' | 'Películas' | 'Series' | 'Videojuegos' | 'Canciones';
export type StatusType = 'TODOS' | 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
export type SortType = 'FECHA_DESC' | 'FECHA_ASC';

export const useCollection = () => {
  const router = useRouter();
  const resources = useResource();

  const [busqueda, setBusqueda] = useState('');
  const [categoriaActual, setCategoriaActual] = useState<CategoryType>('Películas');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // UI States
  const [menuCategoriaAbierto, setMenuCategoriaAbierto] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // Filtros
  const [orden, setOrden] = useState<SortType>('FECHA_DESC');
  const [filtroEstado, setFiltroEstado] = useState<StatusType>('TODOS');
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const fetchMap = {
        'Películas': resources.fetchPeliculas,
        'Series': resources.fetchSeries,
        'Videojuegos': resources.fetchVideojuegos,
        'Libros': resources.fetchLibros,
        'Canciones': resources.fetchCanciones,
      };

      const fetchFunction = fetchMap[categoriaActual];
      const favorito = soloFavoritos ? true : null;
      const estado = null
      const ordenarPorFecha = orden === 'FECHA_DESC' ? true : (orden === 'FECHA_ASC' ? false : null);

      const resultado = await fetchFunction(busqueda, favorito, estado, null, ordenarPorFecha);
      setData(resultado || []);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
      const pendientes = data.filter(item => item.estado === 'PENDIENTE');
      const enCurso = data.filter(item => item.estado === 'EN_CURSO');
      const completados = data.filter(item => item.estado === 'COMPLETADO');

  useEffect(() => { cargarDatos(); }, [categoriaActual, busqueda, filtroEstado, orden, soloFavoritos]);

  const handleItemPress = (item: any) => {
    const resourceTypeMap: Record<CategoryType, string> = {
      'Películas': 'film', 'Series': 'series', 'Videojuegos': 'game', 'Libros': 'book', 'Canciones': 'song'
    };
    const type = resourceTypeMap[categoriaActual];
    router.push({
      pathname: `/details/${type}/${type}Resource`,
      params: { item: JSON.stringify(item) }
    });
  };

  return {
    busqueda, setBusqueda,
    categoriaActual, setCategoriaActual,
    data, loading,
    menuCategoriaAbierto, setMenuCategoriaAbierto,
    filtrosAbiertos, setFiltrosAbiertos,
    orden, setOrden,
    filtroEstado, setFiltroEstado,
    soloFavoritos, setSoloFavoritos,
    handleItemPress,
    router,
    pendientes,
    enCurso,
    completados
  };
};