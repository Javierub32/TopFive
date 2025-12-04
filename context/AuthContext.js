import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Verificar sesión al inicio
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session ? session.user : null);
			setLoading(false); // SIEMPRE cambiar loading a false, haya o no sesión
		});

		// Escuchar cambios de sesión
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session ? session.user : null);
			setLoading(false); // SIEMPRE cambiar loading a false
		});

	
		return () => subscription.unsubscribe();
	}, []);

	const signIn = async (email, password) => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) throw error;
	};

	const signUp = async (email, password) => {
		// 1. Crear el usuario en el sistema de Autenticación
		const { data, error: authError } = await supabase.auth.signUp({
			email,
			password
		});

		if (authError) throw authError;
		if (!data.user) throw new Error("No se pudo crear el usuario");
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	return (
		<AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut}}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);