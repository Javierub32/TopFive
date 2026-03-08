import { searchContentService } from '@/Add/services/searchContentService';
import { Book, Film, Game, Series, Song } from 'app/types/Content';
import { ResourceType } from 'hooks/useResource';
import { useEffect, useState } from 'react';

export const useContent = (id: string | number, type: ResourceType) => {
  const [content, setContent] = useState<Book | Film | Series | Game | Song | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
	setLoading(true);
    try {
      const content = await searchContentService.fetchContentDetails(id, type);
      setContent(content);
    } catch (error) {
      console.error('Error fetching content details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [id, type]);



  return { content, loading };
};
