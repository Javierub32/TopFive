import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'context/AuthContext';
import { queryKeys } from '@/query/queryKeys';
import { Comment, commentServices } from '../services/commentServices';
import { useUser } from '@/User/hooks/useUser';

const PAGE_SIZE = 10;

interface CommentsPage {
  items: Comment[];
  total: number;
  nextPage?: number;
}

export const useComments = (resourceId?: number, resourceType?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { blockUser: blockUserMutation, isBlocking } = useUser('');
  const enabled = resourceId != null && !!resourceType;

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError } =
    useInfiniteQuery({
      queryKey: queryKeys.comments(resourceId, resourceType, user?.id),
      queryFn: async ({ pageParam = 0 }): Promise<CommentsPage> => {
        const from = pageParam * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { items, total } = await commentServices.fetchComments(
          resourceId!,
          resourceType!,
          from,
          to,
          user?.id
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
      queryClient.resetQueries({
        queryKey: queryKeys.comments(resourceId, resourceType, user?.id),
      }),
  });

  const sendComment = async (content: string) => {
    if (!enabled || !user) return;
    await addCommentMutation.mutateAsync(content);
  };

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => commentServices.deleteComment(commentId, user!.id),
    onMutate: async (commentId: number) => {
      const key = queryKeys.comments(resourceId, resourceType, user?.id);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<InfiniteData<CommentsPage>>(key);

      queryClient.setQueryData<InfiniteData<CommentsPage>>(key, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                items: page.items.filter((c) => c.id !== commentId),
                total: Math.max(page.total - 1, 0),
              })),
            }
          : old
      );

      return { previous };
    },
    onError: (_err, _commentId, context) => {
      if (context?.previous)
        queryClient.setQueryData(
          queryKeys.comments(resourceId, resourceType, user?.id),
          context.previous
        );
    },
  });

  const deleteComment = async (commentId: number) => {
    if (!enabled || !user) return;
    await deleteCommentMutation.mutateAsync(commentId);
  };

  const blockCommentAuthor = async (targetUserId: string) => {
    if (!user) return;
    await blockUserMutation(targetUserId);
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
    deleteComment,
    blockCommentAuthor,
    blockingUser: isBlocking,
    currentUserId: user?.id,
  };
};
