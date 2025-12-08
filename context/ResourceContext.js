import { useContext, createContext, useState, useEffect, use } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from 'context/AuthContext';

const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
	const [peliculas, setPeliculas] = useState([]);
	const [series, setSeries] = useState([]);
	const [videojuegos, setVideojuegos] = useState([]);
	const [libros, setLibros] = useState([]);
	const [canciones, setCanciones] = useState([]);
	const [colecciones, setColecciones] = useState([]);

	const [loading, setLoading] = useState(true);

	const { user } = useAuth();


	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const [fetchedPeliculas, fetchedSeries, fetchedVideojuegos, fetchedLibros, fetchedCanciones] = await Promise.all([
				fetchPeliculas(2),
				fetchSeries(2),
				fetchVideojuegos(2),
				fetchLibros(2),
				fetchCanciones(2),
			]);
			setPeliculas(fetchedPeliculas);
			setSeries(fetchedSeries);
			setVideojuegos(fetchedVideojuegos);
			setLibros(fetchedLibros);
			setCanciones(fetchedCanciones);
			setLoading(false);
		};

		if (user) {
			//fetchData();
		}
	}, [user]);

	const fetchPeliculas = async (term, favorito, estado, cantidad, ordenarPorFecha) => {
		try {
			if (!user) throw new Error('User not authenticated');

			let query = supabase
				.from('recursopelicula') 
				.select(`
					*, 
					contenidopelicula (
					titulo,
					imagenUrl,
					fechaLanzamiento
					)
				`) 
				.eq('usuarioId', user.id);

			// Solo aplicar filtro de favorito si es true
			if (favorito === true) {
				query = query.eq('favorito', true);
			}

			// Solo aplicar filtro de estado si se proporciona
			if (estado !== undefined && estado !== null) {
				query = query.eq('estado', estado);
			}

			// Solo aplicar filtro de término de búsqueda si se proporciona
			if (term !== undefined && term !== null && term !== '') {
				query = query.ilike('contenidopelicula.titulo', `%${term}%`);
			}

			// Aplicar ordenamiento por fecha si se especifica
			if (ordenarPorFecha === true) {
				query = query.order('fechacreacion', { ascending: false }); // Más recientes primero
			} else if (ordenarPorFecha === false) {
				query = query.order('fechacreacion', { ascending: true }); // Más antiguos primero
			}
			// Si es null o undefined, no se ordena

			// Solo aplicar límite si se proporciona
			if (cantidad !== undefined && cantidad !== null) {
				query = query.limit(cantidad);
			}

			const { data, error } = await query;

			if (error) {
				throw error;
			}
			console.log("Peliculas recuperadas:", data);
			return data;
		} catch (error) {
			console.error('Error al obtener películas:', error);
			return null;
		}
	};
const fetchSeries = async (term, favorito, estado, cantidad, ordenarPorFecha) => {
		try {
			if (!user) throw new Error('User not authenticated');

			let query = supabase
				.from('recursoserie') 
				.select(`
					*, 
					contenidoserie (
						titulo,
						imagenUrl,
						fechaLanzamiento
					)
				`) 
				.eq('usuarioId', user.id);

			// Solo aplicar filtro de favorito si es true
			if (favorito === true) {
				query = query.eq('favorito', true);
			}

			// Solo aplicar filtro de estado si se proporciona
			if (estado !== undefined && estado !== null) {
				query = query.eq('estado', estado);
			}

			// Solo aplicar filtro de término de búsqueda si se proporciona
			if (term !== undefined && term !== null && term !== '') {
				query = query.ilike('contenidoserie.titulo', `%${term}%`);
			}

			// Aplicar ordenamiento por fecha si se especifica
			if (ordenarPorFecha === true) {
				query = query.order('fechacreacion', { ascending: false }); // Más recientes primero
			} else if (ordenarPorFecha === false) {
				query = query.order('fechacreacion', { ascending: true }); // Más antiguos primero
			}
			// Si es null o undefined, no se ordena

			// Solo aplicar límite si se proporciona
			if (cantidad !== undefined && cantidad !== null) {
				query = query.limit(cantidad);
			}

			const { data, error } = await query;

			if (error) throw error;
			
			console.log("Series recuperadas:", data);
			return data;
		} catch (error) {
			console.error('Error al obtener series:', error);
			return null;
		}
	};

	const fetchVideojuegos = async (term, favorito, estado, cantidad, ordenarPorFecha) => {
		try {
			if (!user) throw new Error('User not authenticated');

			let query = supabase
				.from('recursovideojuego') 
				.select(`
					*, 
					contenidovideojuego (
						titulo,
						imagenUrl,
						fechaLanzamiento
					)
				`) 
				.eq('usuarioId', user.id);

			// Solo aplicar filtro de favorito si es true
			if (favorito === true) {
				query = query.eq('favorito', true);
			}

			// Solo aplicar filtro de estado si se proporciona
			if (estado !== undefined && estado !== null) {
				query = query.eq('estado', estado);
			}

			// Solo aplicar filtro de término de búsqueda si se proporciona
			if (term !== undefined && term !== null && term !== '') {
				query = query.ilike('contenidovideojuego.titulo', `%${term}%`);
			}

			// Aplicar ordenamiento por fecha si se especifica
			if (ordenarPorFecha === true) {
				query = query.order('fechacreacion', { ascending: false }); // Más recientes primero
			} else if (ordenarPorFecha === false) {
				query = query.order('fechacreacion', { ascending: true }); // Más antiguos primero
			}
			// Si es null o undefined, no se ordena

			// Solo aplicar límite si se proporciona
			if (cantidad !== undefined && cantidad !== null) {
				query = query.limit(cantidad);
			}

			const { data, error } = await query;

			if (error) throw error;

			console.log("Videojuegos recuperados:", data);
			return data;
		} catch (error) {
			console.error('Error al obtener videojuegos:', error);
			return null;
		}
	};

	const fetchLibros = async (term, favorito, estado, cantidad, ordenarPorFecha) => {
		try {
			if (!user) throw new Error('User not authenticated');

			let query = supabase
				.from('recursolibro')
				.select(`
					*, 
					contenidolibro (
						titulo,
						imagenUrl,
						fechaLanzamiento
					)
				`) 
				.eq('usuarioId', user.id);

			// Solo aplicar filtro de favorito si es true
			if (favorito === true) {
				query = query.eq('favorito', true);
			}

			// Solo aplicar filtro de estado si se proporciona
			if (estado !== undefined && estado !== null) {
				query = query.eq('estado', estado);
			}

			// Solo aplicar filtro de término de búsqueda si se proporciona
			if (term !== undefined && term !== null && term !== '') {
				query = query.ilike('contenidolibro.titulo', `%${term}%`);
			}

			// Aplicar ordenamiento por fecha si se especifica
			if (ordenarPorFecha === true) {
				query = query.order('fechacreacion', { ascending: false }); // Más recientes primero
			} else if (ordenarPorFecha === false) {
				query = query.order('fechacreacion', { ascending: true }); // Más antiguos primero
			}
			// Si es null o undefined, no se ordena

			// Solo aplicar límite si se proporciona
			if (cantidad !== undefined && cantidad !== null) {
				query = query.limit(cantidad);
			}

			const { data, error } = await query;

			if (error) throw error;

			console.log("Libros recuperados:", data);
			return data;
		} catch (error) {
			console.error('Error al obtener libros:', error);
			return null;
		}
	};

	const fetchCanciones = async (term, favorito, estado, cantidad, ordenarPorFecha) => {
		try {
			if (!user) throw new Error('User not authenticated');

			let query = supabase
				.from('recursocancion')
				.select(`
					*, 
					contenidocancion (
						titulo,
						imagenUrl,
						fechaLanzamiento
					)
				`) 
				.eq('usuarioId', user.id);

			// Solo aplicar filtro de favorito si es true
			if (favorito === true) {
				query = query.eq('favorito', true);
			}

			// Solo aplicar filtro de estado si se proporciona
			if (estado !== undefined && estado !== null) {
				query = query.eq('estado', estado);
			}

			// Solo aplicar filtro de término de búsqueda si se proporciona
			if (term !== undefined && term !== null && term !== '') {
				query = query.ilike('contenidocancion.titulo', `%${term}%`);
			}

			// Aplicar ordenamiento por fecha si se especifica
			if (ordenarPorFecha === true) {
				query = query.order('fechacreacion', { ascending: false }); // Más recientes primero
			} else if (ordenarPorFecha === false) {
				query = query.order('fechacreacion', { ascending: true }); // Más antiguos primero
			}
			// Si es null o undefined, no se ordena

			// Solo aplicar límite si se proporciona
			if (cantidad !== undefined && cantidad !== null) {
				query = query.limit(cantidad);
			}

			const { data, error } = await query;

			if (error) throw error;

			console.log("Canciones recuperadas:", data);
			return data;
		} catch (error) {
			console.error('Error al obtener canciones:', error);
			return null;
		}
	};

	return (
		<ResourceContext.Provider value={{
			fetchPeliculas,
			fetchSeries,
			fetchVideojuegos,
			fetchLibros,
			fetchCanciones
		}}>
			{children}
		</ResourceContext.Provider>
	);
};

export const useResource = () => useContext(ResourceContext);