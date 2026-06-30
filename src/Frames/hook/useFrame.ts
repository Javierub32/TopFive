import { useAuth } from 'context/AuthContext';
import { useNotification } from 'context/NotificationContext';
import { router } from 'expo-router';
import { supabase } from 'lib/supabase';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

export const useFrame = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userFrames, setUserFrames] = useState<string[]>([]);
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  const handleSaveFrame = async (selectedFrameCode: string) => {
    if (!user) return;
    setSaving(true);
    try {
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
    } finally {
      setSaving(false);
    }
  };

  const fetchUserFrames = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuario_frame')
        .select(
          `
        frame!fk_frame (
          codigo
        )
      `
        )
        .eq('usuario_id', user.id);

      if (error) throw error;

      const codes = data?.map((item: any) => item.frame.codigo) || [];

      if (!codes.includes('none')) {
        codes.push('none');
      }

      setUserFrames(codes);
    } catch (error) {
      console.error('Error al cargar los marcos:', error);
      showNotification({
        title: t('common.error'),
        description: t('frameSelector.errorLoadingNotification'),
        isChoice: false,
        delete: false,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserFrames();
  }, [user?.id]);

  const unlockFrame = async (frameCode: string) => {
    if (!user) return;
    setSaving(true);
    try {
      // Obtenemos el ID del marco
      const { data: frameData, error: frameError } = await supabase
        .from('frame')
        .select('id')
        .eq('codigo', frameCode)
        .single();

      if (frameError) throw frameError;

      // Insertamos el marco en el inventario del usuario
      const { error: insertError } = await supabase
        .from('usuario_frame')
        .insert({ usuario_id: user.id, frame_id: frameData.id });

      if (insertError) throw insertError;

      // Actualizamos el estado local para que se refleje inmediatamente
      setUserFrames(prev => [...prev, frameCode]);

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
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    handleSaveFrame,
	userFrames,
	unlockFrame
  };
};
