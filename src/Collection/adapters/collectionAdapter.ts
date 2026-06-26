import { ResourceMap, ResourceType } from "hooks/useResource";
import { TFunction } from "i18next";


export const collectionAdapter = {
  // Normaliza el título según la categoría
  getTitle: (item: ResourceMap[ResourceType], category: ResourceType, t : TFunction) => {
    const map: Record<ResourceType, string> = {
      'pelicula': item.contenido?.titulo,
      'serie': item.contenido?.titulo,
      'videojuego': item.contenido?.titulo,
      'libro': item.contenido?.titulo,
      'cancion': item.contenido?.titulo,
    };
    return map[category] || t('common.noTitle');
  },

  // Normaliza la imagen
  getImage: (item: ResourceMap[ResourceType], category: ResourceType) => {
    const map: Record<ResourceType, string> = {
      'pelicula': item.contenido?.imagenUrl,
      'serie': item.contenido?.imagenUrl,
      'videojuego': item.contenido?.imagenUrl,
      'libro': item.contenido?.imagenUrl,
      'cancion': item.contenido?.imagenUrl,
    };
    return map[category] ;
  },

  // Lógica visual de estados (Mantenemos tu lógica original)
  getStatusColor: (status: string) => {
    switch (status) {
      case 'PENDIENTE': return '#6b7280'; // Gris
      case 'EN_CURSO': return '#2563eb'; // Azul
      case 'COMPLETADO': return '#16a34a'; // Verde
      default: return '#6b7280';
    }
  },

  getStatusText: (status: string, category: ResourceType, t: TFunction) => {
    if (status === 'PENDIENTE') return t('status.pending');
    if (status === 'COMPLETADO') return t('status.completed');
    if (status === 'EN_CURSO') {
      if (category === 'libro') return t('status.reading');
      if (category === 'videojuego') return t('status.playing');
      if (category === 'serie') return t('status.watching');
      return t('status.inProgress');
    }
    return '';
  }
};