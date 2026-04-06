import { useAuth } from 'context/AuthContext';
import { useNotification } from 'context/NotificationContext';
import { router } from 'expo-router';
import { supabase } from 'lib/supabase';
import { useState } from 'react';

export const useFrame = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();

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
        title: '¡Éxito!',
        description: 'Tu marco de perfil ha sido actualizado.',
        isChoice: false,
        delete: false,
        success: true,
      });

      router.back();
    } catch (error) {
      console.error('Error al guardar el marco:', error);
      showNotification({
        title: 'Error',
        description: 'No se pudo actualizar el marco. Por favor, inténtalo de nuevo.',
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

	} catch (error) {
		console.error('Error al cargar los marcos:', error);
		showNotification({
			title: 'Error',
			description: 'No se pudieron cargar los marcos del usuario. Por favor, inténtalo de nuevo.',
			isChoice: false,
			delete: false,
			success: false,
		});
	} finally {
		setLoading(false);
	}};

  return {
	loading,
	saving,
	handleSaveFrame,
  };
};
