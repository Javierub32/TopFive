import { useEffect, useState } from "react";
import { userService } from "../services/userService";

interface User {
	id: string;
	username: string;
	avatar_url: string;
	description: string;
	followers_count: number;
	following_count: number;
}
interface UseUserResult {
	userData: User | null;
	loading: boolean;
}


export const useUser = (userId: string) => {
	const [userData, setUserData] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			setLoading(true);
			try {
				const data = await userService.fetchUserById(userId);
				setUserData(data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUserData();
	}, [userId]);

	return { userData , loading } as UseUserResult;


}