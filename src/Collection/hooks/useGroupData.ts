import { useState, useEffect } from 'react';
import { useResource } from 'context/ResourceContext';

type GroupType = 'WATCHING' | 'PENDING' | 'COMPLETED';

export const useGroupData = (category: string, type: GroupType) => {
  const resources = useResource();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchMap: any = {
          'Películas': resources.fetchPeliculas,
          'Series': resources.fetchSeries,
          'Videojuegos': resources.fetchVideojuegos,
          'Libros': resources.fetchLibros,
          'Canciones': resources.fetchCanciones,
        };

        const fetchFunction = fetchMap[category];
        if (fetchFunction) {
          const resultado = await fetchFunction(null, null, null, null, true);
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
  }, [category]);

  const pendientes = data.filter(item => item.estado === 'PENDIENTE');
  const enCurso = data.filter(item => item.estado === 'EN_CURSO');
  const completados = data.filter(item => item.estado === 'COMPLETADO');

  let dataToShow: any[] = [];
  if (type === 'WATCHING') dataToShow = enCurso;
  else if (type === 'PENDING') dataToShow = pendientes;
  else if (type === 'COMPLETED') dataToShow = completados;

  return {
    loading,
    dataToShow,
  };
};
