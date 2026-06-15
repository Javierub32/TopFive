import RNFontAwesome from '@expo/vector-icons/FontAwesome';
import RNMaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import RNIonicons from '@expo/vector-icons/Ionicons';
import RNFontAwesome5 from '@expo/vector-icons/FontAwesome5';
import RNFeather from '@expo/vector-icons/Feather';
import RNEntypo from '@expo/vector-icons/Entypo';
import RNAntDesign from '@expo/vector-icons/AntDesign';
import RNMaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useTheme } from 'context/ThemeContext';
import { useFontSize } from 'context/FontSizeContext';
// Para el tamaño de los iconos
const withScalableSize = (IconComponent) => {
  return function ScalableIcon({ size = 24, ...props }) {
    const { fontSizeMultiplier } = useFontSize();
    return <IconComponent size={size * fontSizeMultiplier} {...props} />;
  };
};
export const FontAwesome = withScalableSize(RNFontAwesome);
export const MaterialCommunityIcons = withScalableSize(RNMaterialCommunityIcons);
export const Ionicons = withScalableSize(RNIonicons);
export const FontAwesome5 = withScalableSize(RNFontAwesome5);
export const Feather = withScalableSize(RNFeather);
export const Entypo = withScalableSize(RNEntypo);
export const AntDesign = withScalableSize(RNAntDesign);
export const MaterialIcons = withScalableSize(RNMaterialIcons);


//-----ICONOS-----//
export const SocialIcon = (props) => (
  <FontAwesome name="users" size={24} color="black"  {...props} />
);

export const SocialBubblesIcon = (props) => (
  <Ionicons name="chatbubbles-outline" size={24} color="black" {...props} />
);

export const SearchIcon = (props) => (
  <MaterialCommunityIcons name="magnify" size={20} color="white" {...props} />
);

export const UserIcon = (props) => (
<MaterialCommunityIcons name="account" size={24} color="black" {...props} />
);

export const HomeIcon = (props) => (
	<MaterialCommunityIcons name="home" size={24} color="black" {...props} />
);

export const AddIcon = (props) => (
	<FontAwesome name="search-plus" size={24} color="black" {...props} />
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
  <MaterialCommunityIcons name="play-box-multiple" size={24} color="white" {...props}/>
);

export const SearchIcon2 = (props) => (
  <Feather name="search" size={24} color="black" {...props} />
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

export const CancelIcon2 = (props) => (
  <FontAwesome name="remove" size={24} color="white" {...props} />
);

export const AcceptIcon = (props) => (
  <Feather name="check" size={24} color="white" {...props} />
);

export const WrenchIcon = (props) => (
  <MaterialCommunityIcons name="hammer-wrench" size={24} color="white" {...props} />
);

export const RatingIcon = (props) => {
  const {colors} = useTheme();
  return (
    <MaterialCommunityIcons name="star-circle" size={20} color={colors.rating} {...props} />
  )
}

export const ProgressIcon = (props) => {
  const {colors} = useTheme();
  return (
    <MaterialCommunityIcons name="clock" size={20} color={colors.primary} {...props} />
  )
}

export const ReviewIcon = (props) => {
  const {colors} = useTheme();
  return (
    <MaterialCommunityIcons name="comment-quote" size={20} color={colors.secondary} {...props} />
  )
}

export const CalendarIcon = (props) => {
  const { colors } = useTheme();
  return(
    <MaterialCommunityIcons name="calendar" size={24} color={colors.primary} {...props}/>
  )
}

export const DeleteIcon = (props) => {
  const { colors } = useTheme();
  return(
    <MaterialCommunityIcons name="delete" size={24} color={colors.primaryText} {...props}/>
  )
}

export const FavoriteIcon = (props) => {
  const { colors } = useTheme();
  return (
    <MaterialCommunityIcons name="heart" size={20} color={colors.favorite} {...props}/>
  )
}

export const NonFavoriteIcon = (props) => {
  const { colors } = useTheme();
  return (
    <MaterialCommunityIcons name="heart-outline" size={20} color={colors.secondaryText} {...props} />
  )
}

export const TimerIcon = (props) => {
  const { colors } = useTheme();
  return (
    <MaterialCommunityIcons name="timer-outline" size={24} color={colors.primaryText} {...props}/>
  )
}

export const TimesWatchedIcon = (props) => {
  const { colors } = useTheme();
  return (
    <MaterialCommunityIcons name="eye" size={20} color={colors.accent} {...props}/>
  )
}

export const DificultyIcon = (props) => {
  const { colors } = useTheme();
  return (
    <MaterialCommunityIcons name="speedometer" size={20} color="white" {...props}/>
  )
}

export const RatingStarIcon = (props) => {
  const { colors } = useTheme();
  return(
    <FontAwesome5 name="star" size={16} color={colors.rating} solid={true} {...props}/>
  )
}

export const AuthorIcon = (props) => {
  const { colors } = useTheme();
  return(
    <MaterialCommunityIcons name="account" size={20} color={colors.primary} {...props} />

  )
}

export const UploadIcon = (props) => {
  const { colors } = useTheme();
  return (
    <FontAwesome5 name="cloud-upload-alt" size={20} color={colors.background} {...props}/>
  )
}

export const GameModeIcon = (props) => {
  const { colors } = useTheme();
  return (
    <Ionicons name="game-controller" size={20} color={colors.primary} {...props}/>
  )
}

export const AlbumIcon = (props) => {
  const { colors } = useTheme();
  return (
    <MaterialCommunityIcons name="album" size={20} color={colors.primary} {...props}/>
  )
}

export const CalendarStartIcon = (props) => {
  const { colors } = useTheme();
  return (
    <MaterialCommunityIcons name="calendar-start" size={24} color={colors.primary} {...props}/>
  )
}

export const CalendarEndIcon = (props) => {
  const { colors } = useTheme();
  return (
    <MaterialCommunityIcons name="calendar-end" size={24} color={colors.primary} {...props}/>
  )
}

export const ListIcon = (props) => {
  const { colors } = useTheme();
  return (
	<MaterialCommunityIcons name="format-list-bulleted" size={24} color={colors.primaryText} {...props} />
  )
}

export const CrossIcon = (props) => {
  return <Entypo name="cross" size={24} color="black" {...props} />;
}

export const PlusIcon = (props) => {
  return <Entypo name="plus" size={16} color="black" {...props} />;
}

export const EditIcon = (props) => {
  return <AntDesign name="edit" size={16} color="black" {...props} />;
}
export const TrashIcon = (props) => {
  return <AntDesign name="delete" size={16} color="black" {...props} />;
}