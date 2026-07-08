import { createContext, useState, useEffect, useContext } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from './AuthContext';
import { ResourceType, useResource } from 'hooks/useResource';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

const CollectionContext = createContext<any>(undefined);

export type CategoryType = 'Libros' | 'Películas' | 'Series' | 'Videojuegos' | 'Canciones';

export const CollectionProvider = ({ children }: any) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { fetchResources } = useResource();

  const { initialResource } = useLocalSearchParams<{ initialResource?: ResourceType }>();
  const [inputBusqueda, setInputBusqueda] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActual, setCategoriaActual] = useState<ResourceType>(
    initialResource ? initialResource : 'pelicula'
  );
  const [loading, setLoading] = useState(false);
  const [menuCategoriaAbierto, setMenuCategoriaAbierto] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Datos por estado
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [enCurso, setEnCurso] = useState<any[]>([]);
  const [completados, setCompletados] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  // Totales
  const [totalPendientes, setTotalPendientes] = useState<number>(0);
  const [totalEnCurso, setTotalEnCurso] = useState<number>(0);
  const [totalCompletados, setTotalCompletados] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pageSize = 9;

  const {
    data: collectionOverview,
    isLoading: overviewLoading,
    isFetching: overviewFetching,
    refetch: refetchCollectionOverview,
  } = useQuery({
    queryKey: queryKeys.collectionOverview(user?.id, categoriaActual),
    queryFn: async () => {
      const [pendientes, enCurso, completados] = await Promise.all([
        fetchResources({
          type: categoriaActual,
          estado: 'PENDIENTE',
          cantidad: 5,
          ordenarPorFecha: true,
          includeCount: true,
        }),
        fetchResources({
          type: categoriaActual,
          estado: 'EN_CURSO',
          cantidad: 5,
          ordenarPorFecha: true,
          includeCount: true,
        }),
        fetchResources({
          type: categoriaActual,
          estado: 'COMPLETADO',
          cantidad: 5,
          ordenarPorUltimaActividad: true,
          includeCount: true,
        }),
      ]);

      return { pendientes, enCurso, completados };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (!collectionOverview) return;

    setPendientes(collectionOverview.pendientes?.data || []);
    setEnCurso(collectionOverview.enCurso?.data || []);
    setCompletados(collectionOverview.completados?.data || []);
    setTotalPendientes(collectionOverview.pendientes?.count || 0);
    setTotalEnCurso(collectionOverview.enCurso?.count || 0);
    setTotalCompletados(collectionOverview.completados?.count || 0);
  }, [collectionOverview]);

  const handleSearch = async () => {
    if (!user) return;
    if (!inputBusqueda || inputBusqueda.trim() === '') {
      setBusqueda('');
      return;
    }
    setBusqueda(inputBusqueda);
    try {
      setLoading(true);
      const term = inputBusqueda.trim();
      const resultado = await queryClient.fetchQuery({
        queryKey: queryKeys.resources(user.id, categoriaActual, { term, page: 0, pageSize }),
        queryFn: () =>
          fetchResources({
            type: categoriaActual,
            term,
            cantidad: pageSize,
          }),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
      });
      setData(resultado?.data || []);
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPagination = async () => {
    if (!user) return;
    if (!inputBusqueda || inputBusqueda.trim() === '') return;
    if (!hasMore) return;
    if (loading) return;

    const from = page * pageSize;
    const to = from + pageSize - 1;
    try {
      setLoading(true);
      const term = inputBusqueda.trim();
      const resultado = await queryClient.fetchQuery({
        queryKey: queryKeys.resources(user.id, categoriaActual, { term, page, pageSize }),
        queryFn: () =>
          fetchResources({
            type: categoriaActual,
            term,
            cantidad: pageSize,
            from,
            to,
          }),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
      });
      setData((prevData: any[]) => [...prevData, ...(resultado?.data || [])]);
      setPage((prevPage) => prevPage + 1);
      if (!resultado?.data || resultado.data.length < pageSize) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSearch = () => {
    if (isSearchVisible) {
      // Si se está cerrando, limpiamos todo para volver a la vista normal
      setInputBusqueda('');
      setBusqueda('');
      setData([]);
    }
    setIsSearchVisible(!isSearchVisible);
  };

  const fetchInitialData = async () => {
    if (!user) return;

    try {
      await refetchCollectionOverview();
    } catch (error) {
      console.error(error);
      setPendientes([]);
      setEnCurso([]);
      setCompletados([]);
      setTotalPendientes(0);
      setTotalEnCurso(0);
      setTotalCompletados(0);
    }
  };

  useEffect(() => {
    // Limpiamos si el usuario hace logout
    if (!user) {
      setPendientes([]);
      setEnCurso([]);
      setCompletados([]);
      return;
    }

    // Al cambiar de categoría solo limpiamos la búsqueda local.
    // React Query carga/reutiliza la colección según la queryKey de la categoría.
    setInputBusqueda('');
    setBusqueda('');
    setData([]);
  }, [categoriaActual, user?.id]);

  const refreshData = (resourceType?: ResourceType) => {
    const typeToRefresh = resourceType || categoriaActual;

    setRefreshTrigger((prev) => prev + 1);

    if (!user?.id) return;

    queryClient.invalidateQueries({
      queryKey: queryKeys.collectionOverview(user.id, typeToRefresh),
    });
    queryClient.invalidateQueries({
      queryKey: ['collection', 'group', user.id, typeToRefresh],
    });
    queryClient.invalidateQueries({
      queryKey: ['resources', user.id, typeToRefresh],
    });
    queryClient.invalidateQueries({
      queryKey: ['resources', 'exists', user.id, typeToRefresh],
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.profile(user.id),
    });
    queryClient.invalidateQueries({
      queryKey: ['profile', 'stats', user.id],
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.topFive(user.id),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.topFiveSelector(user.id, typeToRefresh),
    });
  };

  const navigateToGrid = (title: any, state: any, category: any) => {
    router.push({
      pathname: '/group',
      params: { title, state, category },
    });
  };

  const handleItemPress = (item: any, categoria?: ResourceType, from?: string) => {
    const resourceTypeMap: Record<ResourceType, string> = {
      pelicula: 'film',
      serie: 'series',
      videojuego: 'game',
      libro: 'book',
      cancion: 'song',
    };
    const type = resourceTypeMap[categoria || categoriaActual];
    router.push({
      pathname: `/details/${type}/${type}Resource`,
      params: { item: JSON.stringify(item), from: from || 'collection' },
    });
    setIsSearchVisible(false);
  };

  return (
    <CollectionContext.Provider
      value={{
        categoriaActual,
        setCategoriaActual,
        loading: loading || overviewLoading || overviewFetching,
        inputBusqueda,
        setInputBusqueda,
        handleSearch,
        menuCategoriaAbierto,
        setMenuCategoriaAbierto,
        pendientes,
        enCurso,
        completados,
        totalPendientes,
        totalEnCurso,
        totalCompletados,
        navigateToGrid,
        handleItemPress,
        busqueda,
        setBusqueda,
        data,
        refreshData,
        isSearchVisible,
        toggleSearch,
        handleSearchPagination,
        setIsSearchVisible,
      }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => useContext(CollectionContext);
