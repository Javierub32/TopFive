import { createContext, useState, useEffect, useContext } from 'react';
import { useResource } from 'hooks/useResource';
import { useLocalSearchParams, router } from 'expo-router';
import { CategoryType } from '@/Collection/hooks/useCollection';

const CollectionContext = createContext<any>(undefined);

export const CollectionProvider = ({ children }: any) => {
  const {
    fetchCanciones,
    fetchPeliculas,
    fetchSeries,
    fetchVideojuegos,
    fetchLibros,
    calcularTotal,
  } = useResource();

  const { initialResource } = useLocalSearchParams();
  const [inputBusqueda, setInputBusqueda] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActual, setCategoriaActual] = useState(initialResource ? initialResource : 'Películas');
  const [loading, setLoading] = useState(false);
  const [menuCategoriaAbierto, setMenuCategoriaAbierto] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Datos por estado
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [enCurso, setEnCurso] = useState<any[]>([]);
  const [completados, setCompletados] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  // Totales
  const [totalPendientes, setTotalPendientes] = useState<number>(0);
  const [totalEnCurso, setTotalEnCurso] = useState<number>(0);
  const [totalCompletados, setTotalCompletados] = useState<number>(0);

  const fetchMap: any = {
    Películas: fetchPeliculas,
    Series: fetchSeries,
    Videojuegos: fetchVideojuegos,
    Libros: fetchLibros,
    Canciones: fetchCanciones,
  };

  const handleSearch = async () => {
    setBusqueda(inputBusqueda);
	try {
		setLoading(true);
		const fetchFunction = fetchMap[categoriaActual as CategoryType];
		const resultado = await fetchFunction(inputBusqueda);
		setData(resultado || []);
	}
	catch (error) {
		console.error(error);
		setData([]);
	}
	finally {
		setLoading(false);
	}
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const categoriaKey = categoriaActual as CategoryType;
      const fetchFunction = fetchMap[categoriaKey];
      const [
        pendientes, 
        enCurso, 
        completados, 
        totalPendientes, 
        totalEnCurso, 
        totalCompletados
      ] = await Promise.all([
        fetchFunction(null, null, 'PENDIENTE', 5),
        fetchFunction(null, null, 'EN_CURSO', 5),
        fetchFunction(null, null, 'COMPLETADO', 5),
        calcularTotal(categoriaKey, 'PENDIENTE'),
        calcularTotal(categoriaKey, 'EN_CURSO'),
        calcularTotal(categoriaKey, 'COMPLETADO')
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
    setInputBusqueda('');
    setBusqueda('');
    setData([]); 
    
    fetchInitialData();
  }, [categoriaActual, refreshTrigger]);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const navigateToGrid = (title: any, type: any, category: any) => {
    router.push({
      pathname: '/group',
      params: { title, type, category },
    });
  };
  const handleItemPress = (item: any) => {
    const resourceTypeMap: any = {
      Películas: 'film',
      Series: 'series',
      Videojuegos: 'game',
      Libros: 'book',
      Canciones: 'song',
    };
    const categoriaKey = categoriaActual as CategoryType;
    const type = resourceTypeMap[categoriaKey];
    router.push({
      pathname: `/details/${type}/${type}Resource`,
      params: { item: JSON.stringify(item) },
    });
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
      }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => useContext(CollectionContext);
