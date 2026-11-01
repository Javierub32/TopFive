import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';
import { useAuth } from 'context/AuthContext';
import { BlockedUser, userService } from '../services/userService';

export const useBlockedUsers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const blockedUsersQueryKey = queryKeys.blockedUsers(user?.id);

  const {
    data: blockedUsers = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<BlockedUser[]>({
    queryKey: blockedUsersQueryKey,
    queryFn: () => {
      if (!user?.id) throw new Error('Debes iniciar sesión para ver los usuarios bloqueados');
      return userService.getBlockedUsers(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60,
  });

  const unblockMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user?.id) throw new Error('Debes iniciar sesión para desbloquear usuarios');
      await userService.unblockUser(user.id, targetUserId);
    },
    onMutate: async (targetUserId) => {
      await queryClient.cancelQueries({ queryKey: blockedUsersQueryKey });
      const previousUsers = queryClient.getQueryData<BlockedUser[]>(blockedUsersQueryKey);

      queryClient.setQueryData<BlockedUser[]>(blockedUsersQueryKey, (currentUsers) =>
        currentUsers?.filter((blockedUser) => blockedUser.id !== targetUserId)
      );

      return { previousUsers };
    },
    onError: (_error, _targetUserId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(blockedUsersQueryKey, context.previousUsers);
      }
    },
    onSettled: async (_data, _error, targetUserId) => {
      if (!user?.id) return;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: blockedUsersQueryKey }),
        queryClient.invalidateQueries({ queryKey: queryKeys.blockedUserIds(user.id) }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.blockState(user.id, targetUserId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicProfilePrefix() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.commentsPrefix() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.userSearchPrefix(user.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profileStatsPrefix(targetUserId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.profileTotalPrefix(targetUserId) }),
        queryClient.invalidateQueries({ queryKey: ['followers'] }),
        queryClient.invalidateQueries({ queryKey: ['following'] }),
      ]);
    },
  });

  return {
    blockedUsers,
    isLoading,
    isError,
    refetch,
    unblockUser: unblockMutation.mutateAsync,
    isUnblocking: unblockMutation.isPending,
  };
};
