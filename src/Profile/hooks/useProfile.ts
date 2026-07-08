import { useEffect, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from 'context/AuthContext';
import { userService } from '../services/profileService';
import { ResourceType, useResource } from 'hooks/useResource';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

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
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState<ResourceType>('pelicula');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isPressed, setIsPressed] = useState(false);

  const {
    data: userData = null,
    isLoading: profileLoading,
    isFetching: profileFetching,
    error: profileError,
  } = useQuery<User | null>({
    queryKey: queryKeys.profile(user?.id),
    queryFn: () => userService.fetchUserProfile(user!.id) as Promise<User>,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const {
    data: stats = new Array(12).fill(0),
    isLoading: statsLoading,
    isFetching: statsFetching,
    error: statsError,
  } = useQuery<number[]>({
    queryKey: queryKeys.profileStats(user?.id, selectedCategory, selectedYear),
    queryFn: () => fetchMonthlyStats(selectedCategory, selectedYear, user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const currentStats = useMemo(() => {
    const total = stats.reduce((acc: number, curr: number) => acc + curr, 0);
    const average = Number((total / 12).toFixed(1));

    return {
      ...INITIAL_CATEGORY_DATA[selectedCategory],
      chartData: stats,
      total,
      average,
    };
  }, [selectedCategory, stats]);

  useEffect(() => {
    if (profileError) {
      console.error('[useProfile] Error al cargar perfil:', profileError);
    }
  }, [profileError]);

  useEffect(() => {
    if (statsError) {
      console.error('[useProfile] Error al cargar estadísticas:', statsError);
      showNotification({
        title: t('common.error'),
        description: t('profile.loadingStatsError'),
        isChoice: false,
        delete: false,
        success: false,
      });
    }
  }, [showNotification, statsError, t]);

  const uploadAvatarMutation = useMutation({
    mutationFn: async (uri: string) => {
      await userService.deletePreviousAvatar(userData?.avatar_url || null);
      return userService.uploadAvatar(user!.id, uri);
    },
    onSuccess: async (newUrl: string) => {
      queryClient.setQueryData(queryKeys.profile(user?.id), (previous: User | null | undefined) =>
        previous ? { ...previous, avatar_url: newUrl } : previous
      );
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile(user?.id) });
      refreshProfile();
    },
  });

  const pickImage = async () => {
    try {
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
        await uploadAvatarMutation.mutateAsync(result.assets[0].uri);

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
    }
  };

  return {
    userData,
    selectedCategory,
    selectedYear,
    isPressed,
    loading: profileLoading || profileFetching || uploadAvatarMutation.isPending,
    setSelectedCategory,
    setSelectedYear,
    setIsPressed,
    pickImage,
    statsLoading: statsLoading || statsFetching,
    currentStats,
  };
};
