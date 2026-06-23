import { FormInput } from "@/Settings/components/DescriptionInput";
import { useSettings } from "@/Settings/hooks/useSettings";
import { LoadingIndicator } from "components/LoadingIndicator";
import { ReturnButton } from "components/ReturnButton";
import { Screen } from "components/Screen";
import { ProfileAvatar } from 'src/Profile/components/ProfileAvatar';
import { useProfile } from 'src/Profile/hooks/useProfile';
import { useTheme } from "context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTranslation } from 'react-i18next';
import {AppText} from 'components/AppText';
import { useState } from 'react';



export default function EditProfileScreen() {
	const { uname, udesc, handleUsernameChange, setDescription, usernameAlreadyExists, handleSubmit, loading } = useSettings();
	const { pickImage, userData } = useProfile();
	const { avatar_url, frame, from } = useLocalSearchParams();  //No les paso desde PROFILE/SETTINGS porque se modifican
	const { colors } = useTheme();
	const { t } = useTranslation();

	// Usar datos actualizados de userData (que se refrescan al volver del focus)
	const avatarUrlString = userData?.avatar_url || (typeof avatar_url === 'string' ? avatar_url : undefined);	 
	const frameString = userData?.frame || (typeof frame === 'string' ? frame : 'none');

	if (loading) {
		return (
			<Screen>
				<LoadingIndicator />
			</Screen>
		);
	}

	return (
		<Screen>
			
			<ReturnButton 
				route={from === 'Profile' ? '/(tabs)/Profile' : '/settings'} 
				title="Editar perfil"
				params={from === 'Settings' ? { username: uname, description: udesc } : {}}
			/>

			<View className="flex-col gap-2 py-4 px-6">
			<ProfileAvatar
				avatarUrl={avatarUrlString || null}
				onPickImage={pickImage}
				frame={frameString}
			/>								

			<TouchableOpacity
				activeOpacity={0.4}
		  		onPress={() => {
					router.push({
					pathname: '/frameSelector',
					params: { avatarUrl: avatarUrlString || '', currentFrame: frameString || 'none' }
					});
				}}
			>
				<AppText className="text-base font-bold mt-3 mb-3" style={{ color: colors.primaryText, textAlign: "center" }}> 
					{t('settings.personalization.editPhoto')}
				</AppText>

			</TouchableOpacity>

			<FormInput		
				description={uname}
				onChange={handleUsernameChange}
				title="Nombre de usuario"
				placeholder="Escribe tu nombre de usuario..."
				maxLength={20}
				numberOfLines={1}
				hasError={usernameAlreadyExists}
			/>
			<FormInput		
				description={udesc}
				onChange={setDescription}
				title="Descripción"
				placeholder="Escribe algo sobre ti..."
				maxLength={110}
				numberOfLines={4}
			/>
			<TouchableOpacity
				className="mt-4 w-full items-center rounded-xl py-3"
				style={{ backgroundColor: colors.primary }}
				onPress={() => handleSubmit(uname.trim(), udesc.trim())}>
				<AppText className="text-lg font-bold" style={{color: colors.background}}>Guardar cambios</AppText>
			</TouchableOpacity>
		 </View>

		</Screen>
	);
}