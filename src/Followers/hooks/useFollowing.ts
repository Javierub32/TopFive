import { useAuth } from "context/AuthContext";
import { useEffect, useState } from "react";
import { followersServices } from "../services/followersServices";
import { User } from "@/User/hooks/useUser";


export const useFollowing = () => {
	const {user} = useAuth();

	const [following, setFollowing] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchFollowing = async () => {
			setLoading(true);
			try {
				const data = await followersServices.fetchFollowing(user!.id);
				setFollowing(data || []);
			} catch (error) {
				console.error("Error fetching followers:", error);
			} finally {
				setLoading(false);
			}
		};
		if (user) {
			fetchFollowing();
		}
	}, [user]);

	return { following, loading };
}