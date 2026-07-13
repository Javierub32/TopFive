import { useCallback, useMemo, useState } from 'react';
import { userService } from '../services/userService';
import { useAuth } from 'context/AuthContext';
import { ResourceType, useResource } from 'hooks/useResource';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';
import { useFocusEffect } from 'expo-router';

export interface User {
  id: string;
  username: string;
  avatar_url: string;
  description: string;
  followers_count: number;
  following_count: number;
  is_requested: boolean;
  following_status: 'pending' | 'accepted' | null;
  frame: string;
  reviews_count: number;
}

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
  const { fetchMonthlyStats } = useResource();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<ResourceType>('pelicula');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const {
    data: userData = null,
    isLoading,
    isFetching,
    refetch: refetchUser,
  } = useQuery<User | null>({
    queryKey: queryKeys.publicProfile(username, user?.id),
    queryFn: async () => {
      if (!username) return null;
      const userId = await userService.getUserIdByUsername(username);
      if (!userId) throw new Error('User not found');
      const data = await userService.fetchUserById(userId, user?.id);
      if (data?.id === user?.id) data.following_status = 'accepted';
      return data;
    },
    enabled: !!username,
    staleTime: 0,
    refetchOnMount: 'always',
    gcTime: 1000 * 60 * 60,
  });

  useFocusEffect(
    useCallback(() => {
      if (username) {
        refetchUser();
      }
    }, [refetchUser, username])
  );

  const {
    data: stats = new Array(12).fill(0),
    isLoading: statsLoading,
    isFetching: statsFetching,
    refetch: refetchStats,
  } = useQuery<number[]>({
    queryKey: queryKeys.profileStats(userData?.id, selectedCategory, selectedYear),
    queryFn: () => fetchMonthlyStats(selectedCategory, selectedYear, userData!.id),
    enabled: !!userData?.id,
    staleTime: 1000 * 60 * 5,
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
      await refetchStats();
    }
  };

  return {
    userData,
    loading: isLoading || followMutation.isPending || cancelRequestMutation.isPending,
    refreshing: isFetching || statsFetching,
    refreshUserData,
    handleFollow,
    cancelRequest,
    selectedCategory,
    setSelectedCategory,
    selectedYear,
    setSelectedYear,
    statsLoading,
    currentStats,
  };
};
