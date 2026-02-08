import { ResourceType, useResource } from 'hooks/useResource';
import { useState, useEffect } from 'react';

type GroupState = 'enCurso' | 'pendientes' | 'completados';

export const useGroupData = (category: ResourceType, state: GroupState) => {
  const { fetchResources } = useResource();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
		const stateMap: any = {
			enCurso: 'EN_CURSO',
			pendientes: 'PENDIENTE',
			completados: 'COMPLETADO',
		};
		const estado = stateMap[state];
        const resultado = await fetchResources(category, null, null, estado);
        setData(resultado || []);
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
