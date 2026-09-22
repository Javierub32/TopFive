import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from 'context/AuthContext';
import { queryKeys } from 'src/query/queryKeys';
import { diaryService } from '../services/diaryService';
import DiaryEntity from '../entity/diaryEntity';

const PAGE_SIZE = 10;

interface DiaryPage {
  items: DiaryEntity[];
  nextPage?: number;
}

export const useDiary = (targetUserId?: string) => {
  const userId = targetUserId;

  const query = useInfiniteQuery<DiaryPage>({
    queryKey: queryKeys.diary(userId),
    enabled: !!userId,
    initialPageParam: 0,

    queryFn: async ({ pageParam }) => {
      const items = await diaryService.getDiaryEntries(userId!, pageParam as number, PAGE_SIZE);

      return {
        items,
        nextPage: items.length === PAGE_SIZE ? pageParam as number + 1 : undefined,
      };
    },

    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data]
  );

  const loadMore = () => {
    if (
      query.hasNextPage &&
      !query.isFetchingNextPage &&
      !query.isFetching
    ) {
      void query.fetchNextPage();
    }
  };

  return {
    items,
    loadMore,
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    refresh: query.refetch,
  };
};