import { ReturnButton } from "components/ReturnButton";
import { Screen } from "components/Screen";
import { View } from "react-native";


export default function Lists() {
	return (
		<Screen>
			<View className="flex-1 px-4 pt-4">
				<ReturnButton route="/Collection" title="Volver a Mi Biblioteca" style={" "} params={{}}/>
			</View>
		</Screen>
	)
}