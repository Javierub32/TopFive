import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'context/AuthContext';
import { queryKeys } from '@/query/queryKeys';
import { Comment, commentServices } from '../services/commentServices';

const PAGE_SIZE = 10;

interface CommentsPage {
  items: Comment[];
  total: number;
  nextPage?: number;
}

export const useComments = (resourceId?: number, resourceType?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const enabled = resourceId != null && !!resourceType;

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError } =
    useInfiniteQuery({
      queryKey: queryKeys.comments(resourceId, resourceType),
      queryFn: async ({ pageParam = 0 }): Promise<CommentsPage> => {
        const from = pageParam * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { items, total } = await commentServices.fetchComments(
          resourceId!,
          resourceType!,
          from,
          to
        );

        return {
          items,
          total,
          nextPage: to + 1 < total ? pageParam + 1 : undefined,
        };
      },
      enabled,
      initialPageParam: 0,
      getNextPageParam: (lastPage: CommentsPage) => lastPage.nextPage,
      staleTime: 1000 * 60,
    });

  const comments = data?.pages.flatMap((page) => page.items) ?? [];
  const commentCount = data?.pages[0]?.total ?? 0;

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const addCommentMutation = useMutation({
    mutationFn: (content: string) =>
      commentServices.addComment(user!.id, resourceId!, resourceType!, content),
    onSuccess: () =>
      queryClient.resetQueries({ queryKey: queryKeys.comments(resourceId, resourceType) }),
  });

  const sendComment = async (content: string) => {
    if (!enabled || !user) return;
    await addCommentMutation.mutateAsync(content);
  };

  return {
    comments,
    commentCount,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    hasMore: !!hasNextPage,
    isError,
    handleLoadMore,
    sendComment,
    sending: addCommentMutation.isPending,
  };
};
