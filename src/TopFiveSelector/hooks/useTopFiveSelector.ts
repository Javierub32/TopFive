import { topFiveService } from '@/Profile/services/topFiveServices';
import { useAuth } from 'context/AuthContext';
import { ResourceMap, ResourceType, useResource } from 'hooks/useResource';
import { useEffect, useState } from 'react';

export const useTopFiveSelector = () => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ResourceMap[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { fetchResources } = useResource();

  const PAGE_SIZE = 9; // Cantidad de elementos a cargar por página

  const fetchTopFiveSelector = async (category: ResourceType) => {
    if (loading) return; // Evitar fetch si ya está cargando
    setLoading(true);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const newItems = await fetchResources(category, null, null, null, null, null, null, from, to);
      if (newItems && newItems.length > 0) {
        setData((prevData) => [...prevData, ...newItems] as ResourceMap[]);
        setPage((prevPage) => prevPage + 1);
        if (newItems.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error al cargar recursos para Top Five Selector:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetTopFiveSelector = () => {
    setData([]);
    setPage(0);
    setHasMore(true);
  };

    const insertToTopFive = async (
	  posicion: number,
	  tipoRecurso: ResourceType,
	  recursoId: number
	) => {
	  try {
		await topFiveService.insertToTopFive(user.id, posicion, tipoRecurso, recursoId);
	  } catch (error) {
		console.error('Error al insertar en Top Five:', error);
	  }
	};

  return { data, loading, hasMore, fetchTopFiveSelector, resetTopFiveSelector, insertToTopFive };
};
