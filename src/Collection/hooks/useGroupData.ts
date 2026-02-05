import { useResource } from 'hooks/useResource';
import { useState, useEffect } from 'react';

type GroupState = 'enCurso' | 'pendientes' | 'completados';

export const useGroupData = (category: string, state: GroupState) => {
  const {fetchCanciones, fetchPeliculas, fetchSeries, fetchVideojuegos, fetchLibros} = useResource();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchMap: any = {
          'Películas': fetchPeliculas,
          'Series': fetchSeries,
          'Videojuegos': fetchVideojuegos,
          'Libros': fetchLibros,
          'Canciones': fetchCanciones,
        };

		const stateMap: any = {
			enCurso: 'EN_CURSO',
			pendientes: 'PENDIENTE',
			completados: 'COMPLETADO',
		};


        const fetchFunction = fetchMap[category];
		const estado = stateMap[state];
        if (fetchFunction) {
          const resultado = await fetchFunction(null, null, estado, null, true);
          setData(resultado || []);
        }
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      loadData();
    }
  }, [category, state]);

  return {
    loading,
    data,
  };
};
