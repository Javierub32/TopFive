import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Verificar sesión al inicio
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			if (session?.user) {
				// Verificar que el usuario existe en la base de datos
				const { data: userExists, error } = await supabase
					.from('usuario')
					.select('id')
					.eq('id', session.user.id)
					.maybeSingle();

				if (error || !userExists) {
					// Si el usuario no existe, cerrar sesión
					await supabase.auth.signOut();
					setSession(null);
					setUser(null);
				} else {
					setSession(session);
					setUser(session.user);
				}
			} else {
				setSession(null);
				setUser(null);
			}
			setLoading(false);
		});

		// Escuchar cambios de sesión
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (session?.user) {
				// Verificar que el usuario existe en la base de datos
				const { data: userExists, error } = await supabase
					.from('usuario')
					.select('id')
					.eq('id', session.user.id)
					.maybeSingle();

				if (error || !userExists) {
					// Si el usuario no existe, cerrar sesión
					await supabase.auth.signOut();
					setSession(null);
					setUser(null);
				} else {
					setSession(session);
					setUser(session.user);
				}
			} else {
				setSession(null);
				setUser(null);
			}
			setLoading(false);
		});

	
		return () => subscription.unsubscribe();
	}, []);	const signIn = async (email, password) => {
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
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);