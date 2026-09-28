import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';
import { LikeUser, likeServices } from '../services/likeServices';

export const useLikeUsers = (
  resourceId?: number,
  resourceType?: string,
  visible: boolean = false
) => {
  const enabled = visible && resourceId != null && !!resourceType;

  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<LikeUser[]>({
    queryKey: queryKeys.likeUsers(resourceId, resourceType),
    queryFn: () => likeServices.fetchUsersWhoLiked(resourceId!, resourceType!),
    enabled,
    staleTime: 0,
  });

  return {
    users: data,
    loading: isLoading,
    fetching: isFetching,
    isError,
    refetch,
  };
};