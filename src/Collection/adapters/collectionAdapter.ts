import { ResourceMap, ResourceType } from "hooks/useResource";

export const collectionAdapter = {
  // Normaliza el título según la categoría
  getTitle: (item: ResourceMap[ResourceType], category: ResourceType) => {
    const map: Record<ResourceType, string> = {
      'pelicula': item.contenido?.titulo,
      'serie': item.contenido?.titulo,
      'videojuego': item.contenido?.titulo,
      'libro': item.contenido?.titulo,
      'cancion': item.contenido?.titulo,
    };
    return map[category] || 'Sin título';
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
    return map[category] || 'https://via.placeholder.com/150';
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

  getStatusText: (status: string, category: ResourceType) => {
    if (status === 'PENDIENTE') return 'Pendiente';
    if (status === 'COMPLETADO') return 'Completado';
    if (status === 'EN_CURSO') {
      if (category === 'libro') return 'Leyendo';
      if (category === 'videojuego') return 'Jugando';
      if (category === 'serie') return 'Viendo';
      return 'En curso';
    }
    return '';
  }
};