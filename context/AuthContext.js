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

const signUp = async (email, password, username) => {
    
    // A. Campos vacíos
    if (!email || !password || !username) {
        throw new Error("Por favor completa todos los campos.");
    }

    // B. Validación básica de Email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        throw new Error("El correo electrónico no es válido.");
    }

    // C. Contraseña muy corta
    if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
    }

    // D. Verificar si el Username ya existe
    const { data: existingUser } = await supabase
        .from('usuario')
        .select('username')
        .eq('username', username)
        .maybeSingle();

    if (existingUser) {
        throw new Error("El nombre de usuario ya está en uso. Por favor elige otro.");
    }

    // --- 2. CREAR USUARIO EN SUPABASE ---
    const {data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username: username }
        }
    });

    if (authError) {
        // Traducir error de Supabase si es necesario, o lanzarlo directo
        if (authError.message.includes("User already registered")) {
             throw new Error("Este correo ya está registrado.");
        }
        throw authError; 
    }

	if (data?.user?.identities?.length === 0) {
        throw new Error("Este correo ya está registrado.");
    }
};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	const requestReset = async (email) => {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			// Esta es la página de tu web donde el usuario escribirá la NUEVA clave
			redirectTo: 'https://www.topfive5.me/reset-password', 
		})
		
		if (error) throw error;
	}

	const changePassword = async (newPassword) => {
		const { error } = await supabase.auth.updateUser({
			password: newPassword
		})

		if (error) throw error;
	}

	return (
		<AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, requestReset, changePassword }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);