import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { followersServices } from "../services/followersServices";
import { User } from "@/User/hooks/useUser";
import { Alert } from "react-native";
import { useNotification } from "context/NotificationContext";


export const useFollowing = (username: string) => {
	  const { user } = useAuth();
	  const {showNotification, hideNotification} = useNotification();
	const [following, setFollowing] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const ownList = user?.user_metadata.username === username;

	useEffect(() => {
		const fetchFollowing = async () => {
			setLoading(true);
			try {
				const data = await followersServices.fetchFollowing(username);
				setFollowing(data || []);
			} catch (error) {
				console.error("Error fetching followers:", error);
			} finally {
				setLoading(false);
			}
		};
		if (username) {
			fetchFollowing();
		}
	}, [username]);

	  const handleRemoveFollower = async (usernameToRemove: string, deleteId: string) => {
		setLoading(true);
		try {
			await followersServices.removeFollowing(user.id, deleteId);
			// Actualizar la lista de seguidore localmente
			setFollowing((prevFollowing) => prevFollowing.filter(following => following.username !== usernameToRemove));
			showNotification({
				title: '¡Éxito!',
				description: `${usernameToRemove} ha sido eliminado de tus seguidos`,
				isChoice: false,
				delete: false,
				success: true,
			});
		} catch (error) {
			console.error('Error removing follower:', error);
			showNotification({
				title: 'Error',
				description: `No se pudo eliminar a ${usernameToRemove} de tus seguidos. Por favor, intenta de nuevo.`,
				isChoice: false,
				delete: false,
				success: false,
			});
		} finally {
			setLoading(false);
		}
	  };
	
	  const handleRemovePress = (username: string, deleteId: string) => {
		/*Alert.alert('Eliminar seguidor', `¿Deseas eliminar a ${username} de tus seguidos?`, [
		  { text: 'Cancelar', style: 'cancel' },
		  { text: 'Eliminar', style: 'destructive', onPress: () => handleRemoveFollower(username, deleteId) },
		]);*/
		showNotification({
		  title: 'Eliminar seguidor',
		  description: `¿Deseas eliminar a ${username} de tus seguidos?`,
		  leftButtonText: 'Cancelar',
		  rightButtonText: 'Eliminar',
		  isChoice: true,
		  delete: true,
		  success: false,
		  onLeftPress: () => hideNotification(),
		  onRightPress: () => {
			hideNotification();
			handleRemoveFollower(username, deleteId)
		  }
		});
	  };

	return { following, loading, handleRemovePress, ownList };
}