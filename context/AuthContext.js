import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
const AuthContext = createContext();
import * as Linking from 'expo-linking';

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		// --- NUEVO: PARSEO ROBUSTO DE ENLACES ---
		const handleDeepLink = async (event) => {
			const url = typeof event === 'string' ? event : event?.url;
			if (!url) return;

			try {
				// 1. Manejo de PKCE Flow (trae un ?code=...)
				const codeMatch = url.match(/code=([^&]+)/);
				if (codeMatch) {
					const code = codeMatch[1];
					await supabase.auth.exchangeCodeForSession(code);
					return;
				}

				// 2. Manejo de Implicit Flow (trae un #access_token=...)
				const accessMatch = url.match(/access_token=([^&]+)/);
				const refreshMatch = url.match(/refresh_token=([^&]+)/);
				if (accessMatch && refreshMatch) {
					const access_token = accessMatch[1];
					const refresh_token = refreshMatch[1];
					await supabase.auth.setSession({ access_token, refresh_token });
				}
			} catch (err) {
				console.error('Error procesando el enlace:', err);
			}
		};

		Linking.getInitialURL().then((url) => {
			if (url) handleDeepLink(url);
		});

		const subscriptionLink = Linking.addEventListener('url', handleDeepLink);
		// ----------------------------------------

		const initializeAuth = async () => {
			try {
				const { data: { session }, error: sessionError } = await supabase.auth.getSession();

				if (sessionError) throw sessionError;

				if (session?.user) {
					const { data: userExists, error: dbError } = await supabase
						.from('usuario')
						.select('id')
						.eq('id', session.user.id)
						.maybeSingle();

					if (dbError) throw dbError;

					if (!userExists) {
						await supabase.auth.signOut();
						if (mounted) {
							setSession(null);
							setUser(null);
						}
					} else {
						if (mounted) {
							setSession(session);
							setUser(session.user);
						}
					}
				}
			} catch (error) {
				console.error("Error en la autenticación inicial:", error);
				if (mounted) {
					setSession(null);
					setUser(null);
				}
			} finally {
				if (mounted) {
					setLoading(false);
				}
			}
		};

		initializeAuth();

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
			subscriptionLink.remove(); 
		};
	}, []);

	const signIn = async (email, password) => {
		const normalizedEmail = typeof email === 'string' ? email.trim() : '';
		const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
		if (error) throw error;
	};

	const signUp = async (email, password, username) => {
		const normalizedEmail = typeof email === 'string' ? email.trim() : '';

		// A. Campos vacíos
		if (!normalizedEmail || !password || !username) {
			throw new Error('Por favor completa todos los campos.');
		}

		if (/\s/.test(password)) {
			throw new Error('La contraseña no puede contener espacios.');
		}

		// B. Validación básica de Email
		const emailRegex = /\S+@\S+\.\S+/;
		if (!emailRegex.test(normalizedEmail)) {
			throw new Error('El correo electrónico no es válido.');
		}

		// C. Contraseña muy corta
		if (password.length < 6) {
			throw new Error('La contraseña debe tener al menos 6 caracteres.');
		}

		// D. Verificar si el Username ya existe
		const { data: existingUser } = await supabase
			.from('usuario')
			.select('username')
			.eq('username', username)
			.maybeSingle();

		if (existingUser) {
			throw new Error('El nombre de usuario ya está en uso. Por favor elige otro.');
		}

		// --- 2. CREAR USUARIO EN SUPABASE ---
		const { data, error: authError } = await supabase.auth.signUp({
			email: normalizedEmail,
			password,
			options: {
				data: { username: username },
				emailRedirectTo: 'https://www.topfive5.me',
			},
		});

		if (authError) {
			// Traducir error de Supabase si es necesario, o lanzarlo directo
			if (authError.message.includes('User already registered')) {
				throw new Error('Este correo ya está registrado.');
			}
			throw authError;
		}

		if (data?.user?.identities?.length === 0) {
			throw new Error('Este correo ya está registrado.');
		}
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	const requestReset = async (email) => {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			// Esta es la página de tu web donde el usuario escribirá la NUEVA clave
			redirectTo: 'https://www.topfive5.me/reset-password',
		});

		if (error) throw error;
	};

	const changePassword = async (newPassword) => {
		if (/\s/.test(newPassword)) {
			throw new Error('La contraseña no puede contener espacios.');
		}

		const { error } = await supabase.auth.updateUser({
			password: newPassword,
		});

		if (error) throw error;

		await signOut();
	};

	const deleteAccount = async () => {
		try {
			const { error } = await supabase.rpc('delete_user_account');

			if (error) throw error;

			await signOut();
		} catch (error) {
			console.error('Error al eliminar la cuenta:', error.message);
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
				loading,
				signIn,
				signUp,
				signOut,
				requestReset,
				changePassword,
				deleteAccount,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
