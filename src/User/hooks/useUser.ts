import { useCallback, useMemo, useState } from 'react';
import { userService } from '../services/userService';
import { useAuth } from 'context/AuthContext';
import { ResourceType, useResource } from 'hooks/useResource';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';
import { useFocusEffect } from 'expo-router';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

export interface User {
  id: string;
  username: string;
  avatar_url: string;
  description: string;
  followers_count: number;
  following_count: number;
  is_requested: boolean;
  following_status: 'pending' | 'accepted' | 'blocked' | null;
  alerts_enabled: boolean;
  frame: string;
  reviews_count: number;
  is_private: boolean;
}

type ProfileResult =
  | { access: 'visible'; user: User }
  | { access: 'blocked_by_me' | 'blocked_me' };

// Estructura inicial de estadísticas
const INITIAL_CATEGORY_DATA = {
  libro: { title: 'Libros Leídos', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
  pelicula: { title: 'Películas Vistas', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
  serie: { title: 'Series Vistas', total: 0, average: 0.0, chartData: new Array(12).fill(0) },
  cancion: {
    title: 'Álbumes Escuchadas',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
  videojuego: {
    title: 'Videojuegos Jugados',
    total: 0,
    average: 0.0,
    chartData: new Array(12).fill(0),
  },
};

export const useUser = (username: string) => {
  const { user } = useAuth();
  const { fetchMonthlyStats, fetchTotalResourceCount } = useResource();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<ResourceType>('pelicula');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const {
    data: profileResult,
    isLoading,
    isFetching,
    refetch: refetchUser,
  } = useQuery<ProfileResult>({
    queryKey: queryKeys.publicProfile(username, user?.id),
    queryFn: async (): Promise<ProfileResult> => {
      if (!username) throw new Error('Username is required');
      const userId = await userService.getUserIdByUsername(username);
      if (!userId) throw new Error('User not found');

      if (user?.id && user.id !== userId) {
        const blockState = await userService.getBlockState(user.id, userId);
        if (blockState) return { access: blockState };
      }

      const profile = await userService.fetchUserById(userId, user?.id ?? userId);
      const visibleProfile =
        profile.id === user?.id ? { ...profile, following_status: 'accepted' as const } : profile;

      return { access: 'visible', user: visibleProfile };
    },
    enabled: !!username,
    staleTime: 0,
    refetchOnMount: 'always',
    gcTime: 1000 * 60 * 60,
  });

  const profileAccess = profileResult?.access ?? null;
  const userData = profileResult?.access === 'visible' ? profileResult.user : null;

  useFocusEffect(
    useCallback(() => {
      if (username) {
        refetchUser();
      }
    }, [refetchUser, username])
  );

  const { data: allTimeTotal = 0, refetch: refetchTotal, isFetching: totalFetching } = useQuery<number>({
    queryKey: queryKeys.profileTotal(userData?.id, selectedCategory),
    queryFn: () => fetchTotalResourceCount(selectedCategory, userData!.id),
    enabled: profileAccess === 'visible' && !!userData?.id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });

  const {
    data: stats = new Array(12).fill(0),
    isLoading: statsLoading,
    isFetching: statsFetching,
    refetch: refetchStats,
  } = useQuery<number[]>({
    queryKey: queryKeys.profileStats(userData?.id, selectedCategory, selectedYear),
    queryFn: () => fetchMonthlyStats(selectedCategory, selectedYear, userData!.id),
    enabled: profileAccess === 'visible' && !!userData?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
  });

  const currentStats = useMemo(() => {
    const total = stats.reduce((acc: number, curr: number) => acc + curr, 0);
    const average = Number((total / 12).toFixed(1));

    return {
      ...INITIAL_CATEGORY_DATA[selectedCategory],
      chartData: stats,
      total: allTimeTotal,
      average,
    };
  }, [selectedCategory, stats, allTimeTotal]);

  const invalidateUserData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.publicProfile(username, user?.id) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications(user?.id) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationCount(user?.id) }),
      queryClient.invalidateQueries({ queryKey: ['followers'] }),
      queryClient.invalidateQueries({ queryKey: ['following'] }),
    ]);
  };

  const followMutation = useMutation({
    mutationFn: async (userIdToFollow?: string | any) => {
      if (!user) return;
      const userId =
        typeof userIdToFollow === 'string'
          ? userIdToFollow
          : await userService.getUserIdByUsername(username);

      if (!userId) throw new Error('User not found');
      await userService.requestFollow(user.id, userId);
    },
    onSuccess: invalidateUserData,
  });

  const cancelRequestMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const userId = await userService.getUserIdByUsername(username);
      if (!userId) throw new Error('User not found');
      await userService.unfollow(user.id, userId);
    },
    onSuccess: invalidateUserData,
  });

  const handleFollow = async (userIdToFollow?: string | any) => {
    if (!user) return;
    try {
      impactAsync(ImpactFeedbackStyle.Light)
      await followMutation.mutateAsync(userIdToFollow);
    } catch (error) {
      console.error('Error requesting follow:', error);
    }
  };

  const cancelRequest = async () => {
    if (!user) return;
    try {
      await cancelRequestMutation.mutateAsync();
    } catch (error) {
      console.error('Error cancelling follow request:', error);
    }
  };

  const refreshUserData = async () => {
    await refetchUser();
    if (userData?.id) {
      await Promise.all([
        refetchStats(),
        refetchTotal(), 
      ]);
    }
  };

  const toggleAlertsMutation = useMutation({
    mutationFn: async (alertsEnabled: boolean) => {
      if (!user || !userData?.id) throw new Error('Missing user data');
      await userService.toggleAlerts(user.id, userData.id, alertsEnabled);
    },
    // recarga los datos para que todo esté sincronizado
    onSuccess: invalidateUserData, 
  });

  const handleToggleAlertsDB = async (newState: boolean) => {
    try {
      await toggleAlertsMutation.mutateAsync(newState);
    } catch (error) {
      console.error('Error updating alerts state:', error);
      throw error;
    }
  };

  return {
    userData,
    profileAccess,
    loading: isLoading || followMutation.isPending || cancelRequestMutation.isPending,
    refreshing: isFetching || statsFetching || totalFetching,
    refreshUserData,
    handleFollow,
    cancelRequest,
    handleToggleAlertsDB,
    selectedCategory,
    setSelectedCategory,
    selectedYear,
    setSelectedYear,
    statsLoading,
    currentStats,
  };
};
