import { searchContentService } from '@/Add/services/searchContentService';
import { queryKeys } from '@/query/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { Book, Film, Game, Series, Song } from 'app/types/Content';
import { ResourceType } from 'hooks/useResource';

export const useContent = (id: string | number, type: ResourceType) => {
  const { data, isLoading, isFetching } = useQuery<Book | Film | Series | Game | Song | null>({
    queryKey: queryKeys.contentDetails(type, id),
    queryFn: () => searchContentService.fetchContentDetails(id, type),
    enabled: !!id && !!type,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  return { content: data ?? null, loading: isLoading || isFetching };
};
