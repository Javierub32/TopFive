import { FlatList, TouchableOpacity, View } from "react-native";
import { UserResultItem } from "@/Search/components/UserResultItem";
import { router, useLocalSearchParams } from "expo-router";
import { LoadingIndicator } from "components/LoadingIndicator";
import { useFollowing } from "../hooks/useFollowing";
import { ScalableCancelIcon } from "components/Icons";
import { useTheme } from "context/ThemeContext";
import { useMemo, useState } from "react";
import { UserSearchBar } from "@/Search/components/UserSearchBar";

export default function FollowingList() {
	const {username } = useLocalSearchParams<{ username: string }>();
	const { loading, following, handleRemovePress, ownList } = useFollowing(username);
	const { colors } = useTheme();
	const [busqueda, setBusqueda] = useState('');

	//Con esto, filtramos de la lista de los seguidos y se actualiza directamente
	const userFiltered = useMemo(() => {
		if(!busqueda.trim()) return following;
		return following.filter(user => user.username.toLowerCase().includes(busqueda.toLowerCase()));
	}, [busqueda, following]);
	if (loading) {
		return <LoadingIndicator />;
	}
	return (
		<>
		<View className="mt-4 px-4">
		<UserSearchBar
			value={busqueda}
			onChangeText={setBusqueda}
			onSearch={() => {}}
		/>
		</View>
		<FlatList 
			data={userFiltered}
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
					<ScalableCancelIcon color={colors.primaryText} size={28} />
				</TouchableOpacity>
				}
			</View>
			}
			contentContainerStyle={{ paddingBottom: 20 }}
			showsVerticalScrollIndicator={false}
		/>
		</>
	);
} 
