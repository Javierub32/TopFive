import { MaterialIcons } from 'components/Icons';
import { useTheme } from 'context/ThemeContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { notificationServices } from '../services/notificationServices';
import { useAuth } from 'context/AuthContext';
import {AppText} from 'components/AppText';
interface NotificationProps {
  from: string;
}

export const NotificationButton = (props: NotificationProps ) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
	const fetchNotifications = async () => {
		try {
		if (!user?.id) return;

		const count = await notificationServices.countPendingNotifications(user.id);
		setNotificationCount(count);
		} catch (error) {
		console.error('Error counting notifications:', error);
		}
	};
	fetchNotifications();
  }, []);

  const visibility = notificationCount > 0;
  const displayCount = notificationCount > 10 ? '10+' : notificationCount.toString();
  return (
  <Pressable
    className="rounded-full p-3"
    onPress={() => router.push({ pathname: '/notifications', params: { from: props.from } })}>
    <MaterialIcons name="notifications-none" size={22} color={colors.primaryText} />
	<View className="absolute top-[0.67rem] left-[1.6rem] px-1 rounded-full flex-1  " style={{backgroundColor: colors.error, display: visibility ? 'flex' : 'none'}}>
		<AppText className="mb-[0.05rem]" style={{color: colors.primaryText, fontSize: 12}}>{displayCount}</AppText>
	</View>
  </Pressable>
  );
};
