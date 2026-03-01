import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'context/ThemeContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { notificationServices } from '../services/notificationServices';
import { useAuth } from 'context/AuthContext';

export const NotificationButton = () => {
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
    onPress={() => router.push('/notifications')}>
    <MaterialIcons name="notifications-none" size={24} color={colors.primaryText} />
	<View className="absolute top-[0.67rem] left-[1.6rem] px-1 rounded-full flex-1  " style={{backgroundColor: colors.error, display: visibility ? 'flex' : 'none'}}>
		<Text className="text-[0.6rem] mb-[0.05rem]" style={{color: colors.primaryText}}>{displayCount}</Text>
	</View>
  </Pressable>
  );
};
