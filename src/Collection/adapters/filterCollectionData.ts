
export const filterCollectionData = (data: any[], categoria: string): any[] => {
  return data.filter(item => {
    // Verificar que tenga título según la categoría
    if (categoria === 'Películas' && item.contenidopelicula?.titulo) return true;
    if (categoria === 'Series' && item.contenidoserie?.titulo) return true;
    if (categoria === 'Videojuegos' && item.contenidovideojuego?.titulo) return true;
    if (categoria === 'Libros' && item.contenidolibro?.titulo) return true;
    if (categoria === 'Canciones' && item.contenidocancion?.titulo) return true;
    return false;
  });
};
