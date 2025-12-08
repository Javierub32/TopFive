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

	const fetchPeliculas = async (cantidad) => {
		try {
			if (!user) throw new Error('User not authenticated');

			const { data, error } = await supabase
				.from('recursopelicula') 
				.select(`
					*, 
					contenidopelicula (
					titulo,
					imagenUrl,
					fechaLanzamiento
					)
				`) 
				.eq('usuarioId', user.id)
				.order('fechacreacion', { ascending: false }) 
				.limit(cantidad);

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
const fetchSeries = async (cantidad) => {
		try {
			if (!user) throw new Error('User not authenticated');

			const { data, error } = await supabase
				.from('recursoserie') 
				.select(`
					*, 
					contenidoserie (
						titulo,
						imagenUrl,
						fechaLanzamiento
					)
				`) 
				.eq('usuarioId', user.id)
				.order('fechacreacion', { ascending: false }) 
				.limit(cantidad);

			if (error) throw error;
			
			console.log("Series recuperadas:", data);
			return data;
		} catch (error) {
			console.error('Error al obtener series:', error);
			return null;
		}
	};

	const fetchVideojuegos = async (cantidad) => {
		try {
			if (!user) throw new Error('User not authenticated');

			const { data, error } = await supabase
				.from('recursovideojuego') 
				.select(`
					*, 
					contenidovideojuego (
						titulo,
						imagenUrl,
						fechaLanzamiento
					)
				`) 
				.eq('usuarioId', user.id)
				.order('fechacreacion', { ascending: false }) 
				.limit(cantidad);

			if (error) throw error;

			console.log("Videojuegos recuperados:", data);
			return data;
		} catch (error) {
			console.error('Error al obtener videojuegos:', error);
			return null;
		}
	};

	const fetchLibros = async (cantidad) => {
		try {
			if (!user) throw new Error('User not authenticated');

			const { data, error } = await supabase
				.from('recursolibro')
				.select(`
					*, 
					contenidolibro (
						titulo,
						imagenUrl,
						fechaLanzamiento
					)
				`) 
				.eq('usuarioId', user.id)
				.order('fechacreacion', { ascending: false }) 
				.limit(cantidad);

			if (error) throw error;

			console.log("Libros recuperados:", data);
			return data;
		} catch (error) {
			console.error('Error al obtener libros:', error);
			return null;
		}
	};

	const fetchCanciones = async (cantidad) => {
		try {
			if (!user) throw new Error('User not authenticated');

			const { data, error } = await supabase
				.from('recursocancion')
				.select(`
					*, 
					contenidocancion (
						titulo,
						imagenUrl,
						fechaLanzamiento
					)
				`) 
				.eq('usuarioId', user.id)
				.order('fechacreacion', { ascending: false }) 
				.limit(cantidad);

			if (error) throw error;

			console.log("Canciones recuperadas:", data);
			return data;
		} catch (error) {
			console.error('Error al obtener canciones:', error);
			return null;
		}
	};

	return (
		<ResourceContext.Provider value={{}}>
			{children}
		</ResourceContext.Provider>
	);
};

export const useResource = () => useContext(ResourceContext);