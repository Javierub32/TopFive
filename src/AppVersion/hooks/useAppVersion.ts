import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';
import { supabase } from 'lib/supabase';
import { queryKeys } from '@/query/queryKeys';

export type AppVersion = {
  version: string;
  version_android: string | null;
  min_version: string | null;
  min_version_android: string | null;
  maintenance_enabled: boolean;
  maintenance_message_es: string | null;
  maintenance_message_en: string | null;
};

const fetchAppVersion = async (): Promise<AppVersion | null> => {
  if (Platform.OS === 'web') return null;

  const { data, error } = await supabase
    .from('version')
    .select(
      'min_version, version, min_version_android, version_android, maintenance_enabled, maintenance_message_es, maintenance_message_en',
    )
    .eq('id', 1)
    .single();

  if (error) throw error;

  return data as AppVersion;
};

export const compareVersions = (version1: string, version2: string): number => {
  const parse = (value: string) => {
    if (!/^\d+(\.\d+)*$/.test(value)) {
      throw new Error(`Versión inválida: ${value}`);
    }

    return value.split('.').map(Number);
  };

  const left = parse(version1);
  const right = parse(version2);

  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const x = left[i] ?? 0;
    const y = right[i] ?? 0;

    if (x !== y) return x > y ? 1 : -1;
  }

  return 0;
};

export const useAppVersion = ({
  refetchOnMount = 'always',
}: {
  refetchOnMount?: boolean | 'always';
} = {}) => {

  const query = useQuery({
    queryKey: queryKeys.appVersion(Platform.OS),
    queryFn: fetchAppVersion,
    enabled: Platform.OS !== 'web',
    staleTime: 0,
    refetchOnMount,
    retry: 1,
  });

  return {
    appVersion: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    compareVersions,
  };
};
