export const collectionAdapter = {
  // Normaliza el título según la categoría
  getTitle: (item: any, category: string) => {
    const map: Record<string, string> = {
      'Películas': item.contenidopelicula?.titulo,
      'Series': item.contenidoserie?.titulo,
      'Videojuegos': item.contenidovideojuego?.titulo,
      'Libros': item.contenidolibro?.titulo,
      'Canciones': item.contenidocancion?.titulo,
    };
    return map[category] || 'Sin título';
  },

  // Normaliza la imagen
  getImage: (item: any, category: string) => {
    const map: Record<string, string> = {
      'Películas': item.contenidopelicula?.imagenUrl,
      'Series': item.contenidoserie?.imagenUrl,
      'Videojuegos': item.contenidovideojuego?.imagenUrl,
      'Libros': item.contenidolibro?.imagenUrl,
      'Canciones': item.contenidocancion?.imagenUrl,
    };
    return map[category] || 'https://via.placeholder.com/150';
  },

  // Lógica visual de estados (Mantenemos tu lógica original)
  getStatusColor: (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-borderButton';
      case 'EN_CURSO': return 'bg-blue-600';
      case 'COMPLETADO': return 'bg-green-600';
      default: return 'bg-borderButton';
    }
  },

  getStatusText: (status: string, category: string) => {
    if (status === 'PENDIENTE') return 'Pendiente';
    if (status === 'COMPLETADO') return 'Completado';
    if (status === 'EN_CURSO') {
      if (category === 'Libros') return 'Leyendo';
      if (category === 'Videojuegos') return 'Jugando';
      if (category === 'Series') return 'Viendo';
      return 'En curso';
    }
    return '';
  }
};