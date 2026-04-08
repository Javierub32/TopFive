import { useEffect, useState } from "react";
import { notificationServices } from '../services/notificationServices';
import { useAuth } from "context/AuthContext";
import { supabase } from "lib/supabase";

export const useNotification = () => {
	const [loading, setLoading] = useState(false);
	const [notifications, setNotifications] = useState([] as any[]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const { user } = useAuth();

	const pageSize = 10;

	const fetchNotifications = async () => {
		if(loading || !hasMore || !user?.id) return;
		setLoading(true);
		try {
			const from = page * pageSize;
			const to = from + pageSize - 1;
			const data = await notificationServices.fetchNotifications(user.id, from, to);
			// Traemos los usuarios que seguimos para comprobar el estado del seguimiento
			const { data: myFollows } = await supabase
				.from('relationships')
				.select('following_id, status')
				.eq('follower_id', user.id);

			const followMap = new Map(myFollows?.map(f => [f.following_id, f.status]));

			const enriched = data.map(n => ({
				...n,
				myFollowStatus: followMap.get(n.follower_id) || 'none'
			}));
			//Evitar duplicados 
			setNotifications((prev) => {
				const existingIds = new Set(prev.map(item => item.id));
				const uniqueNew = enriched.filter(item => !existingIds.has(item.id));
				return [...prev, ...uniqueNew];
			});

			setPage((prev) => prev + 1); 
			if(data.length < pageSize){
				setHasMore(false);
			}
		} catch (error) {
			console.error('Error fetching notifications:', error);
		} finally {
			setLoading(false);
		}
	};

	const refreshNotifications = async () => {
		if(refreshing || !user?.id) return;
		setRefreshing(true);
		setPage(0);
		setHasMore(true);
		try {
			const data = await notificationServices.fetchNotifications(user.id, 0, pageSize - 1);
			const { data: myFollows } = await supabase.from('relationships').select('following_id, status').eq('follower_id', user.id);
			const followMap = new Map(myFollows?.map(f => [f.following_id, f.status]));

			const enriched = data.map(n => ({
				...n,
				myFollowStatus: followMap.get(n.follower_id) || 'none'
			}));

			setNotifications(enriched || []);
			setPage(1);
			if(data.length < pageSize) setHasMore(false);
		}catch (error){
			console.error('Error refreshing notifications:', error);
		}finally {
			setRefreshing(false);
		}
	}

	useEffect(() => {
		if (user?.id) refreshNotifications();
	}, [user?.id]);

	const handleAcceptNotification = async (notificationId: string, follower_id: string, following_id: string) => {
		try {
			await notificationServices.acceptNotification(follower_id, following_id);
			setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, status: 'accepted' } : n));
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

	return { 
    loading, 
    notifications, 
    fetchNotifications, // ¡No olvides exportar esto!
    refreshNotifications, 
    refreshing, 
    handleAcceptNotification, 
    handleDeclineNotification 
  };
};