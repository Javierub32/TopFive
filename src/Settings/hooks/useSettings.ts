import { useAuth } from 'context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from 'lib/supabase';
import { useEffect, useState } from 'react';
import { useNotification } from 'context/NotificationContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';
import { useTranslation } from 'react-i18next';

export const useSettings = (userData?: any) => {
  const { username, description, is_private } = useLocalSearchParams<{
    username: string;
    description: string;
    is_private: string;
  }>();
  const { user, refreshProfile } = useAuth();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);
  const [uname, setUsername] = useState(username || '');
  const [udesc, setDescription] = useState(description || '');
  const [uprivate, setPrivate] = useState(is_private === 'true');
  const { t } = useTranslation();

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || '');
      setDescription(userData.description || '');
      setPrivate(userData.is_private ?? false);
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
      newIsPrivate,
    }: {
      newUsername: string;
      newDescription: string;
      newIsPrivate: boolean;
    }) => {
      const { error } = await supabase
        .from('usuario')
        .update({ username: newUsername, description: newDescription, is_private: newIsPrivate })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.profile(user?.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicProfilePrefix() }),
      ]);
      refreshProfile();
    },
  });

  const handleSubmit = async (newUsername: string, newDescription: string, newIsPrivate: boolean) => {
    try {
      await updateProfileMutation.mutateAsync({ newUsername, newDescription, newIsPrivate });
      if (newIsPrivate === false) {
        const { error } = await supabase
          .from('relationships')
          .update({ status: 'accepted' })
          .eq('following_id', user?.id)
          .eq('status', 'pending');
        if (error) throw error;
      }
      setUsernameAlreadyExists(false);
      await router.back();
      showNotification({
        title: t('common.success'),
        description: t('profile.editProfile.profileUpdated'),
        isChoice: false,
        delete: false,
        success: true,
      });
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      if (error?.code === '23505') {
        setUsernameAlreadyExists(true);

        showNotification({
          title: t('common.error'),
          description: t('profile.editProfile.usernameExists'),
          isChoice: false,
          delete: false,
          success: false,
        });
        return;
      }

      setUsernameAlreadyExists(false);
      showNotification({
        title: t('common.error'),
        description: t('profile.editProfile.profileUpdateError'),
        isChoice: false,
        delete: false,
        success: false,
      });
    }
  };

  return {
    loading: updateProfileMutation.isPending,
    uname,
    uprivate,
    setPrivate,
    handleUsernameChange,
    udesc,
    setDescription,
    usernameAlreadyExists,
    handleSubmit
  };
};
