import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { followersServices } from '../services/followersServices';
import { User } from '@/User/hooks/useUser';
import { useNotification } from 'context/NotificationContext';
import { useTranslation } from 'react-i18next';

export const useFollowers = (username: string) => {
  const { user } = useAuth();
  const {showNotification, hideNotification} = useNotification();
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const ownList = user?.user_metadata.username === username;
  const { t } = useTranslation();


  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      try {
        const data = await followersServices.fetchFollowers(username);
        setFollowers(data || []);
      } catch (error) {
        console.error('Error fetching followers:', error);
      } finally {
        setLoading(false);
      }
    };
    if (username) {
      fetchFollowers();
    }
  }, [username]);

  const handleRemoveFollower = async (usernameToRemove: string, deleteId: string) => {
	setLoading(true);
    try {
		await followersServices.removeFollower(user.id, deleteId);
		// Actualizar la lista de seguidores localmente
		setFollowers((prevFollowers) => prevFollowers.filter(follower => follower.username !== usernameToRemove));
	  showNotification({
      title: t('common.success'),
      description: t('profile.deleteFollowers.successDescription', { username: usernameToRemove }),
      isChoice: false,
      delete: false,
      success: true,
    });
  } catch (error) {
		console.error('Error removing follower:', error);
    showNotification({
      title: t('common.error'),
      description: t('profile.deleteFollowers.errorDescription', { username: usernameToRemove }),
      isChoice: false,
      delete: false,
      success: false,
    });
	} finally {
		setLoading(false);
	}
  };

  const handleRemovePress = (username: string, deleteId: string) => {
    /*Alert.alert('Eliminar seguidor', `¿Deseas eliminar a ${username} de tus seguidores?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => handleRemoveFollower(username, deleteId) },
    ]);*/
    showNotification({
      title: t('profile.deleteFollowers.title'),
      description: t('profile.deleteFollowers.description', { username }),
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

  return { followers, loading, handleRemovePress, ownList };
};
