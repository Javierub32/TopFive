import { useAuth } from "context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "lib/supabase";
import { useState } from "react";
import { Alert } from "react-native";
import { useNotification } from "context/NotificationContext";

export const useSettings = () => {
	const { username, description } = useLocalSearchParams<{ username: string; description: string }>();
	const { user } = useAuth();
	const {showNotification} = useNotification();
	const [loading, setLoading] = useState(false);
	const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);
	const [ uname, setUsername] = useState(username || '');
	const [ udesc, setDescription] = useState(description || '');

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
				//Alert.alert('Error', 'El nombre de usuario ya está en uso. Por favor, elige otro.');
				
			}
			else if (error) {
				setUsernameAlreadyExists(false);
				//Alert.alert('Error', 'Hubo un error al actualizar tu perfil. Por favor, intenta de nuevo.');
				showNotification({
					title: 'Error',
					description: 'Hubo un error al actualizar tu perfil. Por favor, intenta de nuevo.',
					isChoice: false,
					delete: false,
					success: false,
				});
			} else {
				setUsernameAlreadyExists(false);
				//Alert.alert('Éxito', 'Tu perfil ha sido actualizado correctamente.');
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