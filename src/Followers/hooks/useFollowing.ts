import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { followersServices } from "../services/followersServices";
import { User } from "@/User/hooks/useUser";
import { useNotification } from "context/NotificationContext";
import { useTranslation } from "react-i18next";


export const useFollowing = (username: string) => {
	  const { user } = useAuth();
	  const {showNotification, hideNotification} = useNotification();
	const [following, setFollowing] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const ownList = user?.user_metadata.username === username;
	const { t } = useTranslation();

	useEffect(() => {
		const fetchFollowing = async () => {
			setLoading(true);
			try {
				const data = await followersServices.fetchFollowing(username);
				setFollowing(data || []);
			} catch (error) {
				console.error("Error fetching following:", error);
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
				title: t('common.success'),
				description: t('profile.deleteFollowing.successDescription', { username: usernameToRemove }),
				isChoice: false,
				delete: false,
				success: true,
			});
		} catch (error) {
			console.error('Error removing following:', error);
			showNotification({
				title: t('common.error'),
				description: t('profile.deleteFollowing.errorDescription', { username: usernameToRemove }),
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
		  title: t('profile.deleteFollowing.title'),
		  description: t('profile.deleteFollowing.description', { username }),
		  leftButtonText: t('common.cancel'),
		  rightButtonText: t('common.delete'),
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