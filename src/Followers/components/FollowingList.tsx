import { FlatList } from "react-native";
import { UserResultItem } from "@/Search/components/UserResultItem";
import { router } from "expo-router";
import { LoadingIndicator } from "components/LoadingIndicator";
import { useFollowing } from "../hooks/useFollowing";

export default function FollowingList() {
	const { loading, following } = useFollowing();
	if (loading) {
		return <LoadingIndicator />;
	}
	return (
		<FlatList 
			data={following}
			keyExtractor={(user) => user.id.toString()}
			renderItem={({ item }) => <UserResultItem item={item} onPress={() =>
              router.push({
                pathname: 'details/user/',
                params: { id: item.id },
              })} />}
			contentContainerStyle={{ paddingBottom: 20 }}
		/>
	);
} 