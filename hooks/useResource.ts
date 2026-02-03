import { useContext, createContext, useState, useEffect, use } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from 'context/AuthContext';

export const useResource = () => {

	const { user } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
		};

		if (user) {
			//fetchData();
		}
	}, [user]);

	const fetchPeliculas = async (
		term?: string | null,
		favorito?: boolean | null,
		estado?: number | null,
		cantidad?: number | null,
		ordenarPorFecha?: boolean | null,
		profile?: boolean
	) => {
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

			if (profile) {
				query = supabase
					.from('recursopelicula')
					.select(`fechaVisionado`)
					.eq('usuarioId', user.id);
			}

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

const fetchSeries = async (
		term?: string | null,
		favorito?: boolean | null,
		estado?: number | null,
		cantidad?: number | null,
		ordenarPorFecha?: boolean | null,
		profile?: boolean
	) => {
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

			if (profile) {
				query = supabase
					.from('recursoserie')
					.select(`fechaFin`)
					.eq('usuarioId', user.id);
			}

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

	const fetchVideojuegos = async (
		term?: string | null,
		favorito?: boolean | null,
		estado?: number | null,
		cantidad?: number | null,
		ordenarPorFecha?: boolean | null,
		profile?: boolean
	) => {
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

			if (profile) {
				query = supabase
					.from('recursovideojuego')
					.select(`fechaFin`)
					.eq('usuarioId', user.id);
			}

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

	const fetchLibros = async (
		term?: string | null,
		favorito?: boolean | null,
		estado?: number | null,
		cantidad?: number | null,
		ordenarPorFecha?: boolean | null,
		profile?: boolean
	) => {
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

			if (profile) {
				query = supabase
					.from('recursolibro')
					.select(`fechaFin`)
					.eq('usuarioId', user.id);
			}

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

	const fetchCanciones = async (
		term?: string | null,
		favorito?: boolean | null,
		estado?: number | null,
		cantidad?: number | null,
		ordenarPorFecha?: boolean | null,
		profile?: boolean
	) => {
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

			if (profile) {
				query = supabase
					.from('recursocancion')
					.select(`fechaEscucha`)
					.eq('usuarioId', user.id);
			}

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

	const borrarRecurso = async (recursoId: any, tipoRecurso: 'pelicula' | 'serie' | 'videojuego' | 'libro' | 'cancion') => {
		try {
			if (!user) throw new Error('User not authenticated');
			const tableMap: Record<string, string> = {
				pelicula: 'recursopelicula',
				serie: 'recursoserie',
				videojuego: 'recursovideojuego',
				libro: 'recursolibro',
				cancion: 'recursocancion'
			};
			const tableName = tableMap[tipoRecurso];
			if (!tableName) throw new Error('Tipo de recurso inválido');
			const { data, error } = await supabase
				.from(tableName)
				.delete()
				.eq('usuarioId', user.id)
				.eq('id', recursoId);
			if (error) throw error;
			console.log(`Recurso ${tipoRecurso} borrado:`, data);
			return data;
		} catch (error) {
			console.error(`Error al borrar recurso ${tipoRecurso}:`, error);
			return null;
		}
	};
 
  
  const calcularTotal = async (tipoRecurso: 'pelicula' | 'serie' | 'videojuego' | 'libro' | 'cancion', estado: 'COMPLETADO' | 'EN_CURSO' | 'PENDIENTE') => {
	try {
		if (!user) throw new Error('User not authenticated');
		const tableMap: Record<string, string> = {
			pelicula: 'recursopelicula',
			serie: 'recursoserie',
			videojuego: 'recursovideojuego',
			libro: 'recursolibro',
			cancion: 'recursocancion'
		};
		const tableName = tableMap[tipoRecurso];
		if (!tableName) throw new Error('Tipo de recurso inválido');
		const { count, error } = await supabase
			.from(tableName)
			.select('id', { count: 'exact', head: true })
			.eq('usuarioId', user.id)
			.eq('estado', estado);
		if (error) throw error;
		console.log(`Total de ${tipoRecurso} en estado ${estado}:`, count);
		return count || 0;
	} catch (error) {
		console.error(`Error al calcular total de ${tipoRecurso} en estado ${estado}:`, error);
		return 0;
	}
   };

  return {
	fetchPeliculas,
	fetchSeries,
	fetchVideojuegos,
	fetchLibros,
	fetchCanciones,
	borrarRecurso,
	calcularTotal
  };


};