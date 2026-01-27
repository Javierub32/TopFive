import { useEffect, useState } from "react";
import { notificationServices } from '../services/notificationServices';
import { useAuth } from "context/AuthContext";

export const useNotification = () => {
	const [loading, setLoading] = useState(false);
	const [notifications, setNotifications] = useState([] as any[]);
	const { user } = useAuth();

	const fetchNotifications = async () => {
		try {
			setLoading(true);
			const data = await notificationServices.fetchNotifications(user.id);
			setNotifications(data);
		} catch (error) {
			console.error('Error fetching notifications:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, [user.id]);

	const handleAcceptNotification = async (notificationId: string, follower_id: string, following_id: string) => {
		try {
			await notificationServices.acceptNotification(follower_id, following_id);
			setNotifications(prev => prev.filter(n => n.id !== notificationId));
		} catch (error) {
			console.error('Error accepting notification:', error);
		}
	};

	const handleDeclineNotification = async (notificationId: string, follower_id: string, following_id: string) => {
		try {
			await notificationServices.declineNotification(follower_id, following_id);
			setNotifications(prev => prev.filter(n => n.id !== notificationId));
		} catch (error) {
			console.error('Error declining notification:', error);
		}
	};

	return { loading, notifications, handleAcceptNotification, handleDeclineNotification };
};