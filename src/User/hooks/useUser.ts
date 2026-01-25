import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { useAuth } from "context/AuthContext";

interface User {
	id: string;
	username: string;
	avatar_url: string;
	description: string;
	followers_count: number;
	following_count: number;
	is_requested: boolean;
	following_status: 'pending' | 'accepted' | null;
}
interface UseUserResult {
	userData: User | null;
	loading: boolean;
	handleFollow: () => Promise<void>;
}


export const useUser = (userId: string) => {
	const {user} = useAuth();
	const [userData, setUserData] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			try {
				const data = await userService.fetchUserById(userId, user?.id);
				setUserData(data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUserData();
	}, [userId, user?.id]);

	const handleFollow = async () => {
		if (!user) return;
		try {
			await userService.requestFollow(user.id, userId);
			setUserData((prevData: User) => ({
				...prevData,
				is_following: false,
				following_status: 'pending'
			}));
		} catch (error) {
			console.error("Error requesting follow:", error);
		}
	};

	return { userData , loading, handleFollow } as UseUserResult;
}