import { supabase } from 'lib/supabase';
import { decode } from 'base64-arraybuffer';

export const userService = {
  async fetchUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('usuario')
      .select('username, avatar_url')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async deletePreviousAvatar(avatarUrl: string | null) {
    if (!avatarUrl) return;
    try {
      const oldPath = avatarUrl.split('/avatars/')[1];
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
      }
    } catch (error) {
      console.log('No se pudo eliminar la foto anterior:', error);
    }
  },


  async uploadAvatar(userId: string, uri: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;
          const base64String = base64data.split(',')[1];
          const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
          const fileName = `avatar.${fileExt}`;
          const filePath = `${userId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, decode(base64String), {
              contentType: `image/${fileExt}`,
              upsert: true,
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          const publicUrlWithTimestamp = `${publicUrl}?t=${Date.now()}`;

          const { error: updateError } = await supabase
            .from('usuario')
            .update({ avatar_url: publicUrlWithTimestamp })
            .eq('id', userId);

          if (updateError) throw updateError;

          resolve(publicUrlWithTimestamp);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error en FileReader'));
      reader.readAsDataURL(blob);
    });
  }
};