import { useEffect, useState } from "react";
import { userService } from "../services/userService";


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

	return { userData, loading };

}