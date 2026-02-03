import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';

export const SocialIcon = (props) => (
  <FontAwesome name="users" size={24} color="black"  {...props} />
);

export const SearchIcon = (props) => (
  <FontAwesome name="search" size={24} color="black" {...props} />
);

export const UserIcon = (props) => (
<MaterialCommunityIcons name="account" size={24} color="black" {...props} />
);

export const HomeIcon = (props) => (
	<MaterialCommunityIcons name="home" size={24} color="black" {...props} />
);

export const AddIcon = (props) => (
	<FontAwesome name="plus-circle" size={24} color="black" {...props} />
);

export const SettingsIcon = (props) => (
	<FontAwesome name="gear" size={24} color="black" {...props} />
);

export const CameraIcon = (props) => (
<MaterialCommunityIcons name="camera" size={24} color="white" {...props} />
);

export const CardsIcon = (props) => (
  <MaterialCommunityIcons name="cards" size={24} color="black" {...props} />
);

export const BookIcon = (props) => (
  <FontAwesome5 name="book" size={24} color="white" {...props}/>
);

export const FilmIcon = (props) => (
  <FontAwesome name="film" size={24} color="white" {...props}/>
);

export const ShowIcon = (props) => (
  <MaterialCommunityIcons name="television-play" size={24} color="white" {...props}/>
);

export const MusicIcon = (props) => (
  <FontAwesome name="music" size={24} color="white" {...props}/>
);

export const GameIcon = (props) => (
  <Ionicons name="game-controller" size={24} color="white" {...props}/>
);

export const LeftArrowIcon = (props) => (
  <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" {...props} />
);

export const CancelIcon = (props) => (
  <Feather name="x" size={24} color="white" {...props} />
);

export const AcceptIcon = (props) => (
  <Feather name="check" size={24} color="white" {...props} />
);

export const WrenchIcon = (props) => (
  <MaterialCommunityIcons name="hammer-wrench" size={24} color="white" {...props} />
);