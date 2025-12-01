import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const SocialIcon = (props) => (
  <FontAwesome name="users" size={24} color="black"  {...props} />
);

export const UserIcon = (props) => (
<MaterialCommunityIcons name="account" size={24} color="black" {...props} />
);

export const HomeIcon = (props) => (
	<MaterialCommunityIcons name="home" size={24} color="black" {...props} />
);

export const SettingsIcon = (props) => (
	<FontAwesome name="gear" size={24} color="black" {...props} />
);

export const CameraIcon = (props) => (
<MaterialCommunityIcons name="camera" size={24} color="black" {...props} />
);

export const CardsIcon = (props) => (
  <MaterialCommunityIcons name="cards" size={24} color="black" {...props} />
);