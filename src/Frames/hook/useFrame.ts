import { useAuth } from 'context/AuthContext';
import { useNotification } from 'context/NotificationContext';
import { router } from 'expo-router';
import { supabase } from 'lib/supabase';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';

export const useFrame = () => {
  const { user, refreshProfile } = useAuth();
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: userFrames = [],
    isLoading,
    isFetching,
  } = useQuery<string[]>({
    queryKey: queryKeys.frames(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario_frame')
        .select(
          `
        frame!fk_frame (
          codigo
        )
      `
        )
        .eq('usuario_id', user!.id);

      if (error) throw error;

      const codes = data?.map((item: any) => item.frame.codigo) || [];

      if (!codes.includes('none')) {
        codes.push('none');
      }

      return codes;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  });

  const saveFrameMutation = useMutation({
    mutationFn: async (selectedFrameCode: string) => {
      const { data: frameData, error: frameError } = await supabase
        .from('frame')
        .select('id')
        .eq('codigo', selectedFrameCode)
        .single();

      if (frameError) throw frameError;

      const { error } = await supabase
        .from('usuario')
        .update({ frame_id: frameData.id })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile(user?.id) });
      refreshProfile();
    },
  });

  const handleSaveFrame = async (selectedFrameCode: string) => {
    if (!user) return;
    try {
      await saveFrameMutation.mutateAsync(selectedFrameCode);
      showNotification({
        title: t('common.success'),
        description: t('frameSelector.updatedNotification'),
        isChoice: false,
        delete: false,
        success: true,
      });

      router.back();
    } catch (error) {
      console.error('Error al guardar el marco:', error);
      showNotification({
        title: t('common.error'),
        description: t('frameSelector.errorUpdatingNotification'),
        isChoice: false,
        delete: false,
        success: false,
      });
    }
  };

  const unlockFrameMutation = useMutation({
    mutationFn: async (frameCode: string) => {
      const { data: frameData, error: frameError } = await supabase
        .from('frame')
        .select('id')
        .eq('codigo', frameCode)
        .single();

      if (frameError) throw frameError;

      const { error: insertError } = await supabase
        .from('usuario_frame')
        .insert({ usuario_id: user!.id, frame_id: frameData.id });

      if (insertError) throw insertError;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.frames(user?.id) });
    },
  });

  const unlockFrame = async (frameCode: string) => {
    if (!user) return;
    try {
      await unlockFrameMutation.mutateAsync(frameCode);

      showNotification({
        title: t('frameSelector.unlockedNotificationTitle'),
        description: t('frameSelector.unlockedNotificationDescription'),
        isChoice: false,
        delete: false,
        success: true,
      });
    } catch (error) {
      console.error('Error al desbloquear el marco:', error);
      showNotification({
        title: t('common.error'),
        description: t('frameSelector.errorUnlockingNotification'),
        isChoice: false,
        delete: false,
        success: false,
      });
    }
  };

  return {
    loading: isLoading || isFetching,
    saving: saveFrameMutation.isPending || unlockFrameMutation.isPending,
    handleSaveFrame,
    userFrames,
    unlockFrame,
  };
};
