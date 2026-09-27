import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'context/AuthContext';
import { queryKeys } from '@/query/queryKeys';
import { LikeStatus, likeServices } from '../services/likeServices';

export const useLike = (resourceId?: number, resourceType?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const enabled = resourceId != null && !!resourceType && !!user;
  const key = queryKeys.like(user?.id, resourceId, resourceType);

  const { data } = useQuery({
    queryKey: key,
    queryFn: () => likeServices.fetchLikeStatus(user!.id, resourceId!, resourceType!),
    enabled,
    staleTime: 1000 * 60,
  });

  const likeMutation = useMutation({
    mutationFn: (value: boolean) =>
      value
        ? likeServices.addLike(user!.id, resourceId!, resourceType!)
        : likeServices.removeLike(user!.id, resourceId!, resourceType!),
    onMutate: async (value: boolean) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<LikeStatus>(key);

      queryClient.setQueryData<LikeStatus>(key, (old) => {
        const count = old?.count ?? 0;
        if (old?.liked === value) return old;
        return { liked: value, count: Math.max(count + (value ? 1 : -1), 0) };
      });

      return { previous };
    },
    onError: (err, _value, context) => {
      console.error('Error toggling like:', err);
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
  });

  const setLiked = (value: boolean) => {
    if (!enabled || likeMutation.isPending) return;
    likeMutation.mutate(value);
  };

  return {
    liked: data?.liked ?? false,
    likeCount: data?.count ?? 0,
    setLiked,
  };
};
