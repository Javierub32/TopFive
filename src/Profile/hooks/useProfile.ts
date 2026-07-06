import { useState, useEffect, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from 'context/AuthContext';
import { userService } from '../services/profileService';
import { ResourceType, useResource } from 'hooks/useResource';
import { useNotification } from 'context/NotificationContext';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

export type CategoryKey = 'libros' | 'películas' | 'series' | 'canciones' | 'videojuegos';

// Initial structure for category statistics
const INITIAL_CATEGORY_DATA = {
  libro: {
    titleKey: 'profile.categoriesConsumed.books',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
  pelicula: {
    titleKey: 'profile.categoriesConsumed.films',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
  serie: {
    titleKey: 'profile.categoriesConsumed.series',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
  cancion: {
    titleKey: 'profile.categoriesConsumed.albums',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
  videojuego: {
    titleKey: 'profile.categoriesConsumed.videogames',
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
  frame: string;
  reviews_count: number;
}

export const useProfile = () => {
  const { user, profileRefreshTrigger, refreshProfile } = useAuth();
  const { fetchMonthlyStats } = useResource();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState<ResourceType>('pelicula');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [userData, setUserData] = useState<User | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [fullCategoryData, setFullCategoryData] = useState(INITIAL_CATEGORY_DATA);
  const [previousYear, setPreviousYear] = useState<number>(new Date().getFullYear());

  // Fetch user profile on mount or when user changes
  // isMounted is only to avoid fetching on components destroy, but it's not ultra necessary.
  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (user) {
          const userData = await userService.fetchUserProfile(user.id);
          if (isMounted) setUserData(userData as User);
        }
      } catch (error) {
        console.error('[useProfile] Error al cargar perfil:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, profileRefreshTrigger]);

  // Fetch stats when category or year changes
  useEffect(() => {
    setFullCategoryData(INITIAL_CATEGORY_DATA);
    setPreviousYear(selectedYear);
    fetchResourceInfo();
    return;
  }, [selectedCategory, selectedYear]);

  const fetchResourceInfo = async () => {
    try {
      setStatsLoading(true);
      const stats = await fetchMonthlyStats(selectedCategory, selectedYear, user?.id || '');
      updateStats(stats);
    } catch (error) {
      console.error('[useProfile] Error al cargar estadísticas:', error);
      showNotification({
        title: t('common.error'),
        description: t('profile.loadingStatsError'),
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const updateStats = (chartData: number[]) => {
    const total = chartData.reduce((acc, curr) => acc + curr, 0);
    const average = Number((total / 12).toFixed(1));

    const newData = { ...fullCategoryData };

    newData[selectedCategory] = {
      ...newData[selectedCategory],
      chartData: chartData,
      total: total,
      average: average,
    };

    setFullCategoryData(newData);
  };

  const pickImage = async () => {
    try {
      setLoading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        //Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería');
        showNotification({
          title: t('profile.noPermissionError.title'),
          description: t('profile.noPermissionError.description'),
          isChoice: false,
          delete: false,
          success: false,
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0] && user) {
        await userService.deletePreviousAvatar(userData?.avatar_url || null);
        const newUrl = await userService.uploadAvatar(user.id, result.assets[0].uri);
        setUserData({ ...userData, avatar_url: newUrl, frame: userData?.frame || 'none' } as User);

		refreshProfile();

		showNotification({
          title: t('common.success'),
          description: t('profile.profilePhotoUpdated'),
          isChoice: false,
          delete: false,
          success: true,
        });
      }
    } catch (error) {
      console.error('[pickImage] Error:', error);
      //Alert.alert('Error', 'No se pudo actualizar la foto');
      showNotification({
        title: t('common.error'),
        description: t('profile.noProfilePhoto'),
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };
  return {
    userData,
    selectedCategory,
    selectedYear,
    isPressed,
    loading,
    setSelectedCategory,
    setSelectedYear,
    setIsPressed,
    pickImage,
    statsLoading,
    currentStats: fullCategoryData[selectedCategory],
  };
};
