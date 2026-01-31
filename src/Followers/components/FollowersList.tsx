import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import { useFollowers } from "../hooks/useFollowers";
import { UserResultItem } from "@/Search/components/UserResultItem";
import { router, useLocalSearchParams } from "expo-router";
import { LoadingIndicator } from "components/LoadingIndicator";
import { CancelIcon } from "components/Icons";
import { COLORS } from "constants/colors";

export default function FollowersList() {
	const { username } = useLocalSearchParams<{ username: string }>();
	const { loading, followers, handleRemovePress, ownList } = useFollowers(username);

	if (loading) {
		return <LoadingIndicator />;
	}
	return (
		<FlatList 
			data={followers}
			keyExtractor={(user) => user.id.toString()}
			renderItem={({ item }) => 
			<View className="flex flex-row items-center space-x-4 pl-4 pr-8 py-3">
				<View className="flex-1 pr-4">
					<UserResultItem item={item} onPress={() =>
					router.push({
						pathname: 'details/user/',
						params: { username: item.username },
					})} />
				</View>
				{ownList && 
				<TouchableOpacity onPress={() => handleRemovePress(item.username, item.id)}>
					<CancelIcon color={COLORS.primaryText} size={28} />
				</TouchableOpacity>
				}
			</View>
			}
			contentContainerStyle={{ paddingBottom: 20 }}
		/>
	);
} 