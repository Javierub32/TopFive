import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { supabase } from 'lib/supabase';
import { queryKeys } from '@/query/queryKeys';

async function fetchAppVersion() {
  if (Platform.OS === 'web') return null;

  const column = Platform.OS === 'android' ? 'version_android' : 'version';

  const { data, error } = await supabase.from('version').select(column).single();

  if (error) throw error;

  return Platform.OS === 'android'
    ? (data as { version_android: string }).version_android
    : (data as { version: string }).version;
}

export function useAppVersion() {
  return useQuery({
    queryKey: queryKeys.appVersion(Platform.OS),
    queryFn: fetchAppVersion,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 48,
    enabled: Platform.OS !== 'web',
  });
}
