import { supabase } from 'lib/supabase';
import DiaryEntity from '../entity/diaryEntity';

export const diaryService = {
  async getDiaryEntries(userId: string, page = 0, pageSize = 10): Promise<DiaryEntity[]> {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('vista_actividad_reciente_v2')
      .select('*')
      .eq('usuarioId', userId)
      .eq('estado', 'COMPLETADO')
      .order('fecha_orden', { ascending: false })
      .order('fechacreacion', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return (data ?? []) as DiaryEntity[];
  },
};