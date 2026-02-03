import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from 'context/AuthContext';
import { userService } from '../services/profileService';
import { createAdaptedResourceStats } from '../adapters/statsAdapter';
import { router } from 'expo-router';
import { useResource } from 'hooks/useResource';

export type CategoryKey = 'libros' | 'películas' | 'series' | 'canciones' | 'videojuegos';

// Initial structure for category statistics
const INITIAL_CATEGORY_DATA = {
  libros: { title: 'Libros Leídos', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
  películas: {
    title: 'Películas Vistas',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
  series: { title: 'Series Vistas', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
  canciones: {
    title: 'Canciones Escuchadas',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
  videojuegos: {
    title: 'Videojuegos Jugados',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
};

interface User {
	id: string;
	username: string;
	avatar_url: string;
	description: string;
	followers_count: number;
	following_count: number;
}

export const useProfile = () => {
  console.log('[useProfile] Hook inicializado');
  const { signOut, user } = useAuth();
  const { fetchCanciones, fetchLibros, fetchPeliculas, fetchSeries, fetchVideojuegos } =
    useResource();
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('libros');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [userData, setUserData] = useState<User | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [fullCategoryData, setFullCategoryData] = useState(INITIAL_CATEGORY_DATA);
  const [previousYear, setPreviousYear] = useState<number>(new Date().getFullYear());
  
  console.log('[useProfile] Estado inicial - user:', user?.id, 'category:', selectedCategory, 'year:', selectedYear);

  // Fetch user profile on mount or when user changes
  useEffect(() => {
    console.log('[useProfile] useEffect user - ejecutando, user:', user?.id);
    if (user) {
      console.log('[useProfile] Fetching user profile para user:', user.id);
	  setLoading(true);
      userService
        .fetchUserProfile(user.id)
        .then((data) => {
          console.log('[useProfile] User profile recibido:', data);
          if (data) {
			setUserData(data as User);
			console.log('[useProfile] User data actualizado');
          }
        })
        .catch((err) => console.error('[useProfile] Error al cargar perfil:', err))
        .finally(() => {
          console.log('[useProfile] Finalizando carga de perfil');
          setLoading(false);
        });
    }
  }, [user]);

  // Fetch stats when category or year changes
  useEffect(() => {
    console.log('[useProfile] useEffect selectedCategory/Year - ejecutando, category:', selectedCategory, 'year:', selectedYear, 'previousYear:', previousYear);
    
    // Si cambió el año, resetear todos los datos
    if (selectedYear !== previousYear) {
      console.log('[useProfile] Año cambió, reseteando fullCategoryData');
      setFullCategoryData(INITIAL_CATEGORY_DATA);
      setPreviousYear(selectedYear);
    }
    
    if (fullCategoryData[selectedCategory].total === 0) {
      console.log('[useProfile] Llamando a fetchResourceInfo');
      fetchResourceInfo();
    }
  }, [selectedCategory, selectedYear]);

  const fetchResourceInfo = async () => {
    console.log('[fetchResourceInfo] Iniciando fetch para category:', selectedCategory, 'year:', selectedYear);
    let resourceData: any[] = [];
    let dateField = '';

    // TODO: Change API to have same date field name across resources
    switch (selectedCategory) {
      case 'libros':
        console.log('[fetchResourceInfo] Fetching libros...');
        resourceData = (await fetchLibros(null, null, null, null, null, true)) || [];
        console.log('[fetchResourceInfo] Libros recibidos:', resourceData.length);
        dateField = 'fechaFin';
        break;
      case 'películas':
        console.log('[fetchResourceInfo] Fetching películas...');
        resourceData = (await fetchPeliculas(null, null, null, null, null, true)) || [];
        console.log('[fetchResourceInfo] Películas recibidas:', resourceData.length);
        dateField = 'fechaVisionado';
        break;
      case 'series':
        console.log('[fetchResourceInfo] Fetching series...');
        resourceData = (await fetchSeries(null, null, null, null, null, true)) || [];
        console.log('[fetchResourceInfo] Series recibidas:', resourceData.length);
        dateField = 'fechaFin';
        break;
      case 'canciones':
        console.log('[fetchResourceInfo] Fetching canciones...');
        resourceData = (await fetchCanciones(null, null, null, null, null, true)) || [];
        console.log('[fetchResourceInfo] Canciones recibidas:', resourceData.length);
        dateField = 'fechaEscucha';
        break;
      case 'videojuegos':
        console.log('[fetchResourceInfo] Fetching videojuegos...');
        resourceData = (await fetchVideojuegos(null, null, null, null, null, true)) || [];
        console.log('[fetchResourceInfo] Videojuegos recibidos:', resourceData.length);
        dateField = 'fechaFin';
        break;
    }

    console.log('[fetchResourceInfo] Creando stats adaptados, dateField:', dateField);
    // We calculate stats using the adapter
    const stats = createAdaptedResourceStats(resourceData, dateField, selectedYear);
    console.log('[fetchResourceInfo] Stats creados:', stats);

    console.log('[fetchResourceInfo] Llamando a updateStats');
    updateStats(stats);
    console.log('[fetchResourceInfo] Completado');
  };

  const updateStats = (newStats: any) => {
    console.log('[updateStats] Actualizando stats para category:', selectedCategory, 'newStats:', newStats);
    // 1. Creamos una copia superficial de todo el objeto
    const newData = { ...fullCategoryData };

    // 2. Modificamos solo la parte que nos interesa de la copia
    newData[selectedCategory] = {
      ...newData[selectedCategory],
      ...newStats,
    };

    console.log('[updateStats] Datos finales:', newData[selectedCategory]);
    // 3. Guardamos la copia completa
    setFullCategoryData(newData);
    console.log('[updateStats] Estado actualizado');
  };

  const pickImage = async () => {
    console.log('[pickImage] Iniciando selección de imagen');
    try {
      setLoading(true);
      console.log('[pickImage] Solicitando permisos...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('[pickImage] Permisos:', status);
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería');
        return;
      }

      console.log('[pickImage] Abriendo galería...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      console.log('[pickImage] Resultado:', result.canceled ? 'cancelado' : 'imagen seleccionada');

      if (!result.canceled && result.assets[0] && user) {
        console.log('[pickImage] Eliminando avatar anterior...');
        await userService.deletePreviousAvatar(userData?.avatar_url || null);
        console.log('[pickImage] Subiendo nuevo avatar...');
        const newUrl = await userService.uploadAvatar(user.id, result.assets[0].uri);
        console.log('[pickImage] Avatar subido, nueva URL:', newUrl);
        setUserData({ ...userData, avatar_url: newUrl } as User);
        Alert.alert('¡Éxito!', 'Foto de perfil actualizada');
      }
    } catch (error) {
      console.error('[pickImage] Error:', error);
      Alert.alert('Error', 'No se pudo actualizar la foto');
    } finally {
      console.log('[pickImage] Finalizando');
      setLoading(false);
    }
  };
  return {
    user,
    userData,
    selectedCategory,
    selectedYear,
    isPressed,
    categoryData: fullCategoryData,
    loading,
    setSelectedCategory,
    setSelectedYear,
    setIsPressed,
    pickImage,
    signOut,
  };
};
