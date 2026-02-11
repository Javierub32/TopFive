import { createContext, useState, useEffect, useContext } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from './AuthContext';
import { ResourceType, useResource } from 'hooks/useResource';

const CollectionContext = createContext<any>(undefined);

export type CategoryType = 'Libros' | 'Películas' | 'Series' | 'Videojuegos' | 'Canciones';


export const CollectionProvider = ({ children }: any) => {
  const { user } = useAuth();

  const { fetchResources, calcularTotal } = useResource();

  const { initialResource } = useLocalSearchParams<{ initialResource?: ResourceType }>();
  const [inputBusqueda, setInputBusqueda] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActual, setCategoriaActual] = useState<ResourceType>(initialResource ? initialResource : 'pelicula');
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

  const handleSearch = async () => {
	if (!user) return;
	if (!inputBusqueda || inputBusqueda.trim() === '') {
		setBusqueda('');
		return;
	}
    setBusqueda(inputBusqueda);
	try {
		setLoading(true);
		const resultado = await fetchResources(categoriaActual, inputBusqueda, null, null, pageSize);
		setData(resultado || []);
		setPage(1);
		setHasMore(true);
	}
	catch (error) {
		console.error(error);
		setData([]);
	}
	finally {
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
		const resultado = await fetchResources(categoriaActual, inputBusqueda, null, null, pageSize, null, null, from, to);
		setData((prevData: any[]) => [...prevData, ...(resultado || [])]);
		setPage((prevPage) => prevPage + 1);
		if (!resultado || resultado.length < pageSize) {
			setHasMore(false);
		}
	}
	catch (error) {
		console.error(error);
	}
	finally {
		setLoading(false);
	}
  }

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

    setLoading(true);
    try {
      const [
        pendientes, 
        enCurso, 
        completados, 
        totalPendientes, 
        totalEnCurso, 
        totalCompletados
      ] = await Promise.all([
		fetchResources(categoriaActual, null, null, 'PENDIENTE', 5),
        fetchResources(categoriaActual, null, null, 'EN_CURSO', 5),
        fetchResources(categoriaActual, null, null, 'COMPLETADO', 5),
        calcularTotal(categoriaActual, 'PENDIENTE'),
        calcularTotal(categoriaActual, 'EN_CURSO'),
        calcularTotal(categoriaActual, 'COMPLETADO')
      ]);

      setPendientes(pendientes || []);
      setEnCurso(enCurso || []);
      setCompletados(completados || []);
      setTotalPendientes(totalPendientes);
      setTotalEnCurso(totalEnCurso);
      setTotalCompletados(totalCompletados);
    } catch (error) {
      console.error(error);
      setPendientes([]);
      setEnCurso([]);
      setCompletados([]);
      setTotalPendientes(0);
      setTotalEnCurso(0);
      setTotalCompletados(0);
    } finally {
      setLoading(false);
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

    setInputBusqueda('');
    setBusqueda('');
    setData([]); 
    
    fetchInitialData();
  }, [categoriaActual, refreshTrigger, user?.id]); 

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const navigateToGrid = (title: any, state: any, category: any) => {
    router.push({
      pathname: '/group',
      params: { title, state, category },
    });
  };
  const handleItemPress = (item: any, categoria?: ResourceType) => {
    const resourceTypeMap: Record<ResourceType, string> = {
      pelicula: 'film',
      serie: 'series',
      videojuego: 'game',
      libro: 'book',
      cancion: 'song',
    };
    const type = resourceTypeMap[categoria || categoriaActual];
	console.log(`/details/${type}/${type}Resource`)
    router.push({
      pathname: `/details/${type}/${type}Resource`,
      params: { item: JSON.stringify(item) },
    });
	setIsSearchVisible(false);
  };
  return (
    <CollectionContext.Provider
      value={{
        categoriaActual,
        setCategoriaActual,
        loading,
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
		setIsSearchVisible
      }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => useContext(CollectionContext);
