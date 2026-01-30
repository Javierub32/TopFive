import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { followersServices } from "../services/followersServices";
import { User } from "@/User/hooks/useUser";


export const useFollowers = () => {
	const {user} = useAuth();

	const [followers, setFollowers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchFollowers = async () => {
			setLoading(true);
			try {
				const data = await followersServices.fetchFollowers(user!.id);
				setFollowers(data || []);
			} catch (error) {
				console.error("Error fetching followers:", error);
			} finally {
				setLoading(false);
			}
		};
		if (user) {
			fetchFollowers();
		}
	}, [user]);

	return { followers, loading };

}