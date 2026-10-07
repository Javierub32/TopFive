import { MaterialIcons } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { router, useFocusEffect } from 'expo-router';
import { Pressable, View } from 'react-native';
import { notificationServices } from '../services/notificationServices';
import { useAuth } from 'context/AuthContext';
import { AppText } from 'components/AppText';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/query/queryKeys';
import { useCallback, useRef } from 'react';
interface NotificationProps {
  from: string;
}

export const NotificationButton = (props: NotificationProps) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { data: notificationCount = 0, refetch } = useQuery({
    queryKey: queryKeys.notificationCount(user?.id),
    queryFn: () => notificationServices.countUnreadNotifications(user!.id),
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnMount: 'always',
    gcTime: 1000 * 60 * 30,
  });

  /* Igual que en la lista: refetchOnMount cubre el montaje, así que refetchear también en
     el primer foco pediría el contador dos veces. */
  const hasFocusedOnce = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;

      if (hasFocusedOnce.current) {
        refetch();
      }
      hasFocusedOnce.current = true;
    }, [refetch, user?.id])
  );

  const visibility = notificationCount > 0;
  const displayCount = notificationCount > 10 ? '10+' : notificationCount.toString();
  return (
    <Pressable
      className="rounded-full p-3"
      onPress={() => router.push({ pathname: '/notifications', params: { from: props.from } })}>
      <MaterialIcons name="notifications-none" size={22} color={colors.primaryText} />
      <View
        className="absolute left-[1.6rem] top-[0.67rem] flex-1 rounded-full px-1  "
        style={{ backgroundColor: colors.error, display: visibility ? 'flex' : 'none' }}>
        <AppText className="mb-[0.05rem]" style={{ color: colors.primaryText, fontSize: 12 }}>
          {displayCount}
        </AppText>
      </View>
    </Pressable>
  );
};
