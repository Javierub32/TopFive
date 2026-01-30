import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		const initializeAuth = async () => {
			try {
				// 1. Obtener la sesión inicial
				const { data: { session }, error: sessionError } = await supabase.auth.getSession();

				if (sessionError) throw sessionError;

				if (session?.user) {
					// 2. Verificar si el usuario existe en la tabla 'usuario'
					const { data: userExists, error: dbError } = await supabase
						.from('usuario')
						.select('id')
						.eq('id', session.user.id)
						.maybeSingle();

					if (dbError) throw dbError;

					if (!userExists) {
						// Si el usuario no existe en la DB, forzar logout
						await supabase.auth.signOut();
						if (mounted) {
							setSession(null);
							setUser(null);
						}
					} else {
						// Usuario válido
						if (mounted) {
							setSession(session);
							setUser(session.user);
						}
					}
				}
			} catch (error) {
				console.error("Error en la autenticación inicial:", error);
				// En caso de error, limpiamos estados por seguridad
				if (mounted) {
					setSession(null);
					setUser(null);
				}
			} finally {
				// ESTO ES LO QUE ARREGLA TU PROBLEMA:
				// Se ejecuta siempre, haya error o no.
				if (mounted) {
					setLoading(false);
				}
			}
		};

		initializeAuth();

		// Escuchar cambios de estado (Login, Logout, etc.)
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
			if (mounted) {
				if (session) {
					setSession(session);
					setUser(session.user);
				} else {
					setSession(null);
					setUser(null);
				}
				setLoading(false);
			}
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);

	const signIn = async (email, password) => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) throw error;
	};

	const signUp = async (email, password, username) => { // <--- Añade username aquí
		// 1. Crear el usuario en el sistema de Autenticación
		const { data, error: authError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					username: username, // <--- Esto se enviará a raw_user_meta_data
					// avatar_url: '...' // Puedes añadir más campos aquí si quieres
				}
			}
		});

		if (authError) throw authError;
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	return (
		<AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);