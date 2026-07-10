import { useAuth } from 'context/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from 'lib/supabase';
import { useEffect, useState } from 'react';
import { useNotification } from 'context/NotificationContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

export const useSettings = (userData?: any) => {
  const { username, description } = useLocalSearchParams<{
    username: string;
    description: string;
  }>();
  const { user, refreshProfile } = useAuth();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);
  const [uname, setUsername] = useState(username || '');
  const [udesc, setDescription] = useState(description || '');

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

  const updateProfileMutation = useMutation({
    mutationFn: async ({
      newUsername,
      newDescription,
    }: {
      newUsername: string;
      newDescription: string;
    }) => {
      const { error } = await supabase
        .from('usuario')
        .update({ username: newUsername, description: newDescription })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile(user?.id) });
      refreshProfile();
    },
  });

  const handleSubmit = async (newUsername: string, newDescription: string) => {
    try {
      await updateProfileMutation.mutateAsync({ newUsername, newDescription });
      setUsernameAlreadyExists(false);

      showNotification({
        title: '¡Éxito!',
        description: 'Tu perfil ha sido actualizado correctamente.',
        isChoice: false,
        delete: false,
        success: true,
      });
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      if (error?.code == '23505') {
        setUsernameAlreadyExists(true);

        showNotification({
          title: 'Error',
          description: 'El nombre de usuario ya está en uso. Por favor, elige otro.',
          isChoice: false,
          delete: false,
          success: false,
        });
        return;
      }

      setUsernameAlreadyExists(false);
      showNotification({
        title: 'Error',
        description: 'Hubo un error al actualizar tu perfil. Por favor, intenta de nuevo.',
        isChoice: false,
        delete: false,
        success: false,
      });
    }
  };

  return {
    loading: updateProfileMutation.isPending,
    uname,
    handleUsernameChange,
    udesc,
    setDescription,
    usernameAlreadyExists,
    handleSubmit,
  };
};
