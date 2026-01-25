import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

interface FollowButtonProps {
	isFollowed: boolean;
	isRequested: boolean;
	handleFollow: () => void;
}

export function FollowButton({isFollowed, isRequested, handleFollow}: FollowButtonProps) {
	const [justClicked, setJustClicked] = useState(false);
	
	if (!isFollowed && !isRequested) {
		return (
			<TouchableOpacity className="px-4 py-2 rounded-full bg-secondary" onPress={handleFollow}>
				<Text className="text-white font-semibold">Seguir</Text>
			</TouchableOpacity>
		);
	}
	if (!isFollowed && isRequested) {
		return (
			<TouchableOpacity className="px-4 py-2 rounded-full bg-surfaceButton">
				<Text className="text-white font-semibold">Solicitud enviada</Text>
			</TouchableOpacity>
		);
	}
	return (null);
}