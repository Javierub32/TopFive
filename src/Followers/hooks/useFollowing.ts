import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { followersServices } from "../services/followersServices";
import { User } from "@/User/hooks/useUser";
import { Alert } from "react-native";


export const useFollowing = (username: string) => {
	  const { user } = useAuth();
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
		} catch (error) {
			console.error('Error removing follower:', error);
		} finally {
			setLoading(false);
		}
	  };
	
	  const handleRemovePress = (username: string, deleteId: string) => {
		Alert.alert('Eliminar seguidor', `¿Deseas eliminar a ${username} de tus seguidos?`, [
		  { text: 'Cancelar', style: 'cancel' },
		  { text: 'Eliminar', style: 'destructive', onPress: () => handleRemoveFollower(username, deleteId) },
		]);
	  };

	return { following, loading, handleRemovePress, ownList };
}