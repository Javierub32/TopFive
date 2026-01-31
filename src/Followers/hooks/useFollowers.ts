import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { followersServices } from '../services/followersServices';
import { User } from '@/User/hooks/useUser';
import { Alert } from 'react-native';

export const useFollowers = (username: string) => {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const ownList = user?.user_metadata.username === username;


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
	} catch (error) {
		console.error('Error removing follower:', error);
	} finally {
		setLoading(false);
	}
  };

  const handleRemovePress = (username: string, deleteId: string) => {
    Alert.alert('Eliminar seguidor', `¿Deseas eliminar a ${username} de tus seguidores?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => handleRemoveFollower(username, deleteId) },
    ]);
  };

  return { followers, loading, handleRemovePress, ownList };
};
