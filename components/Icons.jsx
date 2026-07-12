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

// Para el tamaño de los iconos escalables
const withScalableSize = (IconComponent) => {
  return function ScalableIcon({ size = 24, ...props }) {
    const { fontSizeMultiplier } = useFontSize();
    return <IconComponent size={size * fontSizeMultiplier} {...props} />;
  };
};

// Exportamos las bases escalables
export const ScalableFontAwesome = withScalableSize(RNFontAwesome);
export const ScalableMaterialCommunityIcons = withScalableSize(RNMaterialCommunityIcons);
export const ScalableIonicons = withScalableSize(RNIonicons);
export const ScalableFontAwesome5 = withScalableSize(RNFontAwesome5);
export const ScalableFeather = withScalableSize(RNFeather);
export const ScalableEntypo = withScalableSize(RNEntypo);
export const ScalableAntDesign = withScalableSize(RNAntDesign);
export const ScalableMaterialIcons = withScalableSize(RNMaterialIcons);

// Exportamos las bases originales para uso directo si es necesario
export const FontAwesome = RNFontAwesome;
export const MaterialCommunityIcons = RNMaterialCommunityIcons;
export const Ionicons = RNIonicons;
export const FontAwesome5 = RNFontAwesome5;
export const Feather = RNFeather;
export const Entypo = RNEntypo;
export const AntDesign = RNAntDesign;
export const MaterialIcons = RNMaterialIcons;

//-----ICONOS-----//

export const ScalableSocialIcon = (props) => <ScalableFontAwesome name="users" size={24} color="black" {...props} />;
export const SocialIcon = (props) => <RNFontAwesome name="users" size={24} color="black" {...props} />;

export const ScalableSocialBubbles = (props) => <ScalableIonicons name="chatbubbles-outline" size={24} color="black" {...props} />;
export const SocialBubblesIcon = (props) => <RNIonicons name="chatbubbles-outline" size={24} color="black" {...props} />;

export const ScalableSearchIcon = (props) => <ScalableMaterialCommunityIcons name="magnify" size={20} color="white" {...props} />;
export const SearchIcon = (props) => <RNMaterialCommunityIcons name="magnify" size={20} color="white" {...props} />;

export const ScalableUserIcon = (props) => <ScalableMaterialCommunityIcons name="account" size={24} color="black" {...props} />;
export const UserIcon = (props) => <RNMaterialCommunityIcons name="account" size={24} color="black" {...props} />;

export const ScalableHomeIcon = (props) => <ScalableMaterialCommunityIcons name="home" size={24} color="black" {...props} />;
export const HomeIcon = (props) => <RNMaterialCommunityIcons name="home" size={24} color="black" {...props} />;

export const ScalableAddIcon = (props) => <ScalableFontAwesome name="search-plus" size={24} color="black" {...props} />;
export const AddIcon = (props) => <RNFontAwesome name="search-plus" size={24} color="black" {...props} />;

export const ScalableSettingsIcon = (props) => <ScalableFeather name="settings" size={24} color="black" {...props} />;
export const SettingsIcon = (props) => <RNFeather name="settings" size={24} color="black" {...props} />;

export const ScalableCameraIcon = (props) => <ScalableMaterialCommunityIcons name="camera" size={24} color="white" {...props} />;
export const CameraIcon = (props) => <RNMaterialCommunityIcons name="camera" size={24} color="white" {...props} />;

export const ScalableCardsIcon = (props) => <ScalableMaterialCommunityIcons name="cards" size={24} color="black" {...props} />;
export const CardsIcon = (props) => <RNMaterialCommunityIcons name="cards" size={24} color="black" {...props} />;

export const ScalableBookIcon = (props) => <ScalableFontAwesome5 name="book" size={24} color="white" {...props} />;
export const BookIcon = (props) => <RNFontAwesome5 name="book" size={24} color="white" {...props} />;

export const ScalableFilmIcon = (props) => <ScalableFontAwesome name="film" size={24} color="white" {...props} />;
export const FilmIcon = (props) => <RNFontAwesome name="film" size={24} color="white" {...props} />;

export const ScalableShowIcon = (props) => <ScalableMaterialCommunityIcons name="play-box-multiple" size={24} color="white" {...props} />;
export const ShowIcon = (props) => <RNMaterialCommunityIcons name="play-box-multiple" size={24} color="white" {...props} />;

export const ScalableSearchIcon2 = (props) => <ScalableFeather name="search" size={24} color="black" {...props} />;
export const SearchIcon2 = (props) => <RNFeather name="search" size={24} color="black" {...props} />;

export const ScalableMusicIcon = (props) => <ScalableFontAwesome name="music" size={24} color="white" {...props} />;
export const MusicIcon = (props) => <RNFontAwesome name="music" size={24} color="white" {...props} />;

export const ScalableGameIcon = (props) => <ScalableIonicons name="game-controller" size={24} color="white" {...props} />;
export const GameIcon = (props) => <RNIonicons name="game-controller" size={24} color="white" {...props} />;

export const ScalableLeftArrowIcon = (props) => <ScalableMaterialCommunityIcons name="arrow-left" size={24} color="#fff" {...props} />;
export const LeftArrowIcon = (props) => <RNMaterialCommunityIcons name="arrow-left" size={24} color="#fff" {...props} />;

export const ScalableCancelIcon = (props) => <ScalableFeather name="x" size={24} color="white" {...props} />;
export const CancelIcon = (props) => <RNFeather name="x" size={24} color="white" {...props} />;

export const ScalableCancelIcon2 = (props) => <ScalableFontAwesome name="remove" size={24} color="white" {...props} />;
export const CancelIcon2 = (props) => <RNFontAwesome name="remove" size={24} color="white" {...props} />;

export const ScalableAcceptIcon = (props) => <ScalableFeather name="check" size={24} color="white" {...props} />;
export const AcceptIcon = (props) => <RNFeather name="check" size={24} color="white" {...props} />;

export const ScalableWrenchIcon = (props) => <ScalableMaterialCommunityIcons name="hammer-wrench" size={24} color="white" {...props} />;
export const WrenchIcon = (props) => <RNMaterialCommunityIcons name="hammer-wrench" size={24} color="white" {...props} />;

// Iconos con contexto (Theme)
export const ScalableRatingIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="star-circle" size={20} color={colors.rating} {...props} />;
};
export const RatingIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="star-circle" size={20} color={colors.rating} {...props} />;
};

export const ScalableProgressIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="clock" size={20} color={colors.primary} {...props} />;
};
export const ProgressIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="clock" size={20} color={colors.primary} {...props} />;
};

export const ScalableReviewIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="comment-quote" size={20} color={colors.secondary} {...props} />;
};
export const ReviewIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="comment-quote" size={20} color={colors.secondary} {...props} />;
};

export const ScalableCalendarIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="calendar" size={24} color={colors.primary} {...props} />;
};
export const CalendarIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="calendar" size={24} color={colors.primary} {...props} />;
};

export const ScalableDeleteIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="delete" size={24} color={colors.primaryText} {...props} />;
};
export const DeleteIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="delete" size={24} color={colors.primaryText} {...props} />;
};

export const ScalableFavoriteIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="heart" size={20} color={colors.favorite} {...props} />;
};
export const FavoriteIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="heart" size={20} color={colors.favorite} {...props} />;
};

export const ScalableNonFavoriteIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="heart-outline" size={20} color={colors.secondaryText} {...props} />;
};
export const NonFavoriteIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="heart-outline" size={20} color={colors.secondaryText} {...props} />;
};

export const ScalableTimerIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="timer-outline" size={24} color={colors.primaryText} {...props} />;
};
export const TimerIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="timer-outline" size={24} color={colors.primaryText} {...props} />;
};

export const ScalableTimesWatchedIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="eye" size={20} color={colors.accent} {...props} />;
};
export const TimesWatchedIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="eye" size={20} color={colors.accent} {...props} />;
};

export const ScalableDificultyIcon = (props) => {
  return <ScalableMaterialCommunityIcons name="speedometer" size={20} color="white" {...props} />;
};
export const DificultyIcon = (props) => {
  return <RNMaterialCommunityIcons name="speedometer" size={20} color="white" {...props} />;
};

export const ScalableRatingStarIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableFontAwesome5 name="star" size={16} color={colors.rating} solid={true} {...props} />;
};
export const RatingStarIcon = (props) => {
  const { colors } = useTheme();
  return <RNFontAwesome5 name="star" size={16} color={colors.rating} solid={true} {...props} />;
};

export const ScalableAuthorIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="account" size={20} color={colors.primary} {...props} />;
};
export const AuthorIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="account" size={20} color={colors.primary} {...props} />;
};

export const ScalableUploadIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableFontAwesome5 name="cloud-upload-alt" size={20} color={colors.background} {...props} />;
};
export const UploadIcon = (props) => {
  const { colors } = useTheme();
  return <RNFontAwesome5 name="cloud-upload-alt" size={20} color={colors.background} {...props} />;
};

export const ScalableGameModeIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableIonicons name="game-controller" size={20} color={colors.primary} {...props} />;
};
export const GameModeIcon = (props) => {
  const { colors } = useTheme();
  return <RNIonicons name="game-controller" size={20} color={colors.primary} {...props} />;
};

export const ScalableAlbumIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="album" size={20} color={colors.primary} {...props} />;
};
export const AlbumIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="album" size={20} color={colors.primary} {...props} />;
};

export const ScalableCalendarStartIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="calendar-start" size={24} color={colors.primary} {...props} />;
};
export const CalendarStartIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="calendar-start" size={24} color={colors.primary} {...props} />;
};

export const ScalableCalendarEndIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="calendar-end" size={24} color={colors.primary} {...props} />;
};
export const CalendarEndIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="calendar-end" size={24} color={colors.primary} {...props} />;
};

export const ScalableListIcon = (props) => {
  const { colors } = useTheme();
  return <ScalableMaterialCommunityIcons name="format-list-bulleted" size={24} color={colors.primaryText} {...props} />;
};
export const ListIcon = (props) => {
  const { colors } = useTheme();
  return <RNMaterialCommunityIcons name="format-list-bulleted" size={24} color={colors.primaryText} {...props} />;
};

export const ScalableCrossIcon = (props) => <ScalableEntypo name="cross" size={24} color="black" {...props} />;
export const CrossIcon = (props) => <RNEntypo name="cross" size={24} color="black" {...props} />;

export const ScalablePlusIcon = (props) => <ScalableEntypo name="plus" size={16} color="black" {...props} />;
export const PlusIcon = (props) => <RNEntypo name="plus" size={16} color="black" {...props} />;

export const ScalableEditIcon = (props) => <ScalableAntDesign name="edit" size={16} color="black" {...props} />;
export const EditIcon = (props) => <RNAntDesign name="edit" size={16} color="black" {...props} />;

export const ScalableTrashIcon = (props) => <ScalableAntDesign name="delete" size={16} color="black" {...props} />;
export const TrashIcon = (props) => <RNAntDesign name="delete" size={16} color="black" {...props} />;