import { useAuth } from "context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "lib/supabase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNotification } from "context/NotificationContext";

export const useSettings = (userData?: any) => {
	const { username, description } = useLocalSearchParams<{ username: string; description: string }>();
	const { user, refreshProfile } = useAuth();
	const {showNotification} = useNotification();
	const [loading, setLoading] = useState(false);
	const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);
	const [ uname, setUsername] = useState(username || '');
	const [ udesc, setDescription] = useState(description || '');

	useEffect(() => {
		if (userData) {
			setUsername(userData.username || '');
			setDescription(userData.description || '');
		}
	}, [userData]);

	const handleUsernameChange = (newUsername: string) => {
		setUsername(newUsername);
		if (usernameAlreadyExists) {
			setUsernameAlreadyExists(false);
		}
	};
	


	const handleSubmit = async (newUsername: string, newDescription: string) => {
		setLoading(true);
		try {
			const {error} = await supabase
			.from('usuario')
			.update({ username: newUsername, description: newDescription })
			.eq('id', user.id)

			if (error?.code == '23505') {
				setUsernameAlreadyExists(true);
				
				showNotification({
					title: 'Error',
					description: 'El nombre de usuario ya está en uso. Por favor, elige otro.',
					isChoice: false,
					delete: false,
					success: false,
				});
			}
			else if (error) {
				setUsernameAlreadyExists(false);
				showNotification({
					title: 'Error',
					description: 'Hubo un error al actualizar tu perfil. Por favor, intenta de nuevo.',
					isChoice: false,
					delete: false,
					success: false,
				});
			} else {
				setUsernameAlreadyExists(false);
				
				refreshProfile();

				showNotification({
					title: '¡Éxito!',
					description: 'Tu perfil ha sido actualizado correctamente.',
					isChoice: false,
					delete: false,
					success: true,
				});
			}
		} catch (error) {
			console.error('Error al actualizar el perfil:', error);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		uname,
		handleUsernameChange,
		udesc,
		setDescription,
		usernameAlreadyExists,
		handleSubmit,
	};

};