import { FlatList } from "react-native";
import { useFollowers } from "../hooks/useFollowers";
import { UserResultItem } from "@/Search/components/UserResultItem";
import { router } from "expo-router";
import { LoadingIndicator } from "components/LoadingIndicator";

export default function FollowersList() {
	const { loading, followers } = useFollowers();
	if (loading) {
		return <LoadingIndicator />;
	}
	return (
		<FlatList 
			data={followers}
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