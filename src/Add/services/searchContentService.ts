import { ResourceType } from 'hooks/useResource';

export const searchContentService = {
  async fetchResources(termino: string, tipo: ResourceType) {
    // 1. Obtener variables de entorno
    const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
	const authorizationToken = process.env.EXPO_PUBLIC_BACKEND_AUTHORIZATION_TOKEN;

    // 2. Validación estricta de seguridad: Forzar HTTPS
    if (!baseUrl || !baseUrl.startsWith('https://')) {
      throw new Error(
        'Seguridad comprometida: La URL del backend debe usar HTTPS para encriptar las credenciales.'
      );
    }

    // 3. Mapear el tipo de recurso al endpoint de tu API en Hugging Face
    const endpointMap: Record<ResourceType, string> = {
      pelicula: '/fetchFilms',
      serie: '/fetchSeries',
      videojuego: '/fetchGames',
      libro: '/fetchBooks',
      cancion: '/fetchSong',
    };

    const endpoint = endpointMap[tipo];

    // 4. Construir la URL de forma segura (codificando el término por si tiene espacios o caracteres raros)
    const url = `${baseUrl}${endpoint}?term=${encodeURIComponent(termino)}`;

    try {
      // 5. Hacer la petición cifrada
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // Al viajar por HTTPS, este Header está 100% oculto para los atacantes de red
	     "Authorization": `Bearer ${authorizationToken}`,
    
          'X-API-Key': apiKey , 
        },
      });

      // 6. Manejo de errores HTTP (401, 404, 500, etc.)
      if (!response.ok) {
        console.error(`Error del servidor: ${response.status} ${response.statusText}`);
        throw new Error('Error al buscar contenido en la API');
      }

      // 7. Parsear y devolver los datos
      const data = await response.json();
	  console.log('Datos recibidos de Hugging Face:', data);
      return data;

    } catch (error) {
      console.error('Error haciendo fetch a Hugging Face:', error);
      throw new Error('Error de conexión al buscar contenido');
    }
  }
};