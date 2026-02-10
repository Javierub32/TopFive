import { useAuth } from "context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "lib/supabase";
import { useState } from "react";
import { Alert } from "react-native";

export const useSettings = () => {
	const { username, description } = useLocalSearchParams<{ username: string; description: string }>();
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [ uname, setUsername] = useState(username || '');
	const [ udesc, setDescription] = useState(description || '');

	const handleSubmit = async (newUsername: string, newDescription: string) => {
		setLoading(true);
		try {
			const {error} = await supabase
			.from('usuario')
			.update({ username: newUsername, description: newDescription })
			.eq('id', user.id)

			if (error?.code == '23505') {
				Alert.alert('Error', 'El nombre de usuario ya está en uso. Por favor, elige otro.');
			}
			else if (error) {
				Alert.alert('Error', 'Hubo un error al actualizar tu perfil. Por favor, intenta de nuevo.');
			} else {
				Alert.alert('Éxito', 'Tu perfil ha sido actualizado correctamente.');
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
		setUsername,
		udesc,
		setDescription,
		handleSubmit,
	};

};