// hooks/useResource.ts
import { useContext, createContext, useState, useEffect, use } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from 'context/AuthContext';
import { CategoryType } from '@/Collection/hooks/useCollection';

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

            // Detectar si hay búsqueda activa
            const isSearch = term !== undefined && term !== null && term !== '';
            // Si hay búsqueda, usamos !inner para filtrar las filas padre que no coincidan
            const joinModifier = isSearch ? '!inner' : '';

			let query = supabase
				.from('recursopelicula') 
				.select(`
					*, 
					contenidopelicula${joinModifier} (
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

			if (favorito === true) {
				query = query.eq('favorito', true);
			}

			if (estado !== undefined && estado !== null) {
				query = query.eq('estado', estado);
			}

			if (isSearch) {
				query = query.ilike('contenidopelicula.titulo', `%${term}%`);
			}

			if (ordenarPorFecha === true) {
				query = query.order('fechacreacion', { ascending: false }); 
			} else if (ordenarPorFecha === false) {
				query = query.order('fechacreacion', { ascending: true }); 
			}

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

            const isSearch = term !== undefined && term !== null && term !== '';
            const joinModifier = isSearch ? '!inner' : '';

			let query = supabase
				.from('recursoserie') 
				.select(`
					*, 
					contenidoserie${joinModifier} (
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

			if (favorito === true) {
				query = query.eq('favorito', true);
			}

			if (estado !== undefined && estado !== null) {
				query = query.eq('estado', estado);
			}

			if (isSearch) {
				query = query.ilike('contenidoserie.titulo', `%${term}%`);
			}

			if (ordenarPorFecha === true) {
				query = query.order('fechacreacion', { ascending: false });
			} else if (ordenarPorFecha === false) {
				query = query.order('fechacreacion', { ascending: true });
			}

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

            const isSearch = term !== undefined && term !== null && term !== '';
            const joinModifier = isSearch ? '!inner' : '';

			let query = supabase
				.from('recursovideojuego') 
				.select(`
					*, 
					contenidovideojuego${joinModifier} (
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

			if (favorito === true) {
				query = query.eq('favorito', true);
			}

			if (estado !== undefined && estado !== null) {
				query = query.eq('estado', estado);
			}

			if (isSearch) {
				query = query.ilike('contenidovideojuego.titulo', `%${term}%`);
			}

			if (ordenarPorFecha === true) {
				query = query.order('fechacreacion', { ascending: false });
			} else if (ordenarPorFecha === false) {
				query = query.order('fechacreacion', { ascending: true });
			}

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

            const isSearch = term !== undefined && term !== null && term !== '';
            const joinModifier = isSearch ? '!inner' : '';

			let query = supabase
				.from('recursolibro')
				.select(`
					*, 
					contenidolibro${joinModifier} (
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

			if (favorito === true) {
				query = query.eq('favorito', true);
			}

			if (estado !== undefined && estado !== null) {
				query = query.eq('estado', estado);
			}

			if (isSearch) {
				query = query.ilike('contenidolibro.titulo', `%${term}%`);
			}

			if (ordenarPorFecha === true) {
				query = query.order('fechacreacion', { ascending: false });
			} else if (ordenarPorFecha === false) {
				query = query.order('fechacreacion', { ascending: true });
			}

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

            const isSearch = term !== undefined && term !== null && term !== '';
            const joinModifier = isSearch ? '!inner' : '';

			let query = supabase
				.from('recursocancion')
				.select(`
					*, 
					contenidocancion${joinModifier} (
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

			if (favorito === true) {
				query = query.eq('favorito', true);
			}

			if (estado !== undefined && estado !== null) {
				query = query.eq('estado', estado);
			}

			if (isSearch) {
				query = query.ilike('contenidocancion.titulo', `%${term}%`);
			}

			if (ordenarPorFecha === true) {
				query = query.order('fechacreacion', { ascending: false });
			} else if (ordenarPorFecha === false) {
				query = query.order('fechacreacion', { ascending: true });
			}

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
 

  const calcularTotal = async (tipoRecurso: CategoryType, estado: 'COMPLETADO' | 'EN_CURSO' | 'PENDIENTE') => {
	try {
		if (!user) throw new Error('User not authenticated');
		const tableMap: Record<string, string> = {
			Películas: 'recursopelicula',
			Series: 'recursoserie',
			Videojuegos: 'recursovideojuego',
			Libros: 'recursolibro',
			Canciones: 'recursocancion'
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