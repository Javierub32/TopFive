import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from 'context/AuthContext';
import { useResource } from 'context/ResourceContext';
import { userService } from '../services/profileService';
import { createAdaptedResourceStats } from '../adapters/statsAdapter';

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

export const useProfile = () => {
  const { signOut, user } = useAuth();
  const { fetchCanciones, fetchLibros, fetchPeliculas, fetchSeries, fetchVideojuegos } =
    useResource();

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('libros');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [username, setUsername] = useState('Usuario');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [fullCategoryData, setFullCategoryData] = useState(INITIAL_CATEGORY_DATA);

  // Fetch user profile on mount or when user changes
  useEffect(() => {
    if (user) {
      userService
        .fetchUserProfile(user.id)
        .then((data) => {
          if (data) {
            setUsername(data.username || 'Usuario');
            setAvatarUrl(data.avatar_url);
          }
        })
        .catch((err) => console.error('Error al cargar perfil:', err));
    }
  }, [user]);

  // Fetch stats when category changes
  useEffect(() => {
    if (fullCategoryData[selectedCategory].total === 0) {
      fetchResourceInfo();
    }
  }, [selectedCategory]);

  // Reset all stats when year changes
  useEffect(() => {
	setFullCategoryData(INITIAL_CATEGORY_DATA);
    fetchResourceInfo();

  }, [selectedYear]);

  const fetchResourceInfo = async () => {
    let resourceData: any[] = [];
    let dateField = '';

    // TODO: Change API to have same date field name across resources
    switch (selectedCategory) {
      case 'libros':
        resourceData = await fetchLibros(null, null, null, null, null, true);
        dateField = 'fechaFin';
        break;
      case 'películas':
        resourceData = await fetchPeliculas(null, null, null, null, null, true);
        dateField = 'fechaVisionado';
        break;
      case 'series':
        resourceData = await fetchSeries(null, null, null, null, null, true);
        dateField = 'fechaFin';
        break;
      case 'canciones':
        resourceData = await fetchCanciones(null, null, null, null, null, true);
        dateField = 'fechaEscucha';
        break;
      case 'videojuegos':
        resourceData = await fetchVideojuegos(null, null, null, null, null, true);
        dateField = 'fechaFin';
        break;
    }

    // We calculate stats using the adapter
    const stats = createAdaptedResourceStats(resourceData, dateField, selectedYear);

    updateStats(stats);
  };

  const updateStats = (newStats: any) => {
    // 1. Creamos una copia superficial de todo el objeto
    const newData = { ...fullCategoryData };

    // 2. Modificamos solo la parte que nos interesa de la copia
    newData[selectedCategory] = {
      ...newData[selectedCategory],
      ...newStats,
    };

    // 3. Guardamos la copia completa
    setFullCategoryData(newData);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0] && user) {
        await userService.deletePreviousAvatar(avatarUrl);
        const newUrl = await userService.uploadAvatar(user.id, result.assets[0].uri);
        setAvatarUrl(newUrl);
        Alert.alert('¡Éxito!', 'Foto de perfil actualizada');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar la foto');
    }
  };

  return {
    user,
    username,
    avatarUrl,
    selectedCategory,
    selectedYear,
    isPressed,
    categoryData: fullCategoryData,
    setSelectedCategory,
    setSelectedYear,
    setIsPressed,
    pickImage,
    signOut,
  };
};
