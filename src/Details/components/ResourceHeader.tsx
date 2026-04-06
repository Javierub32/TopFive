import { ReturnButton } from "components/ReturnButton";
import { useTheme } from "context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { ResourceType } from "hooks/useResource";
import { StyleSheet, View, Image, Pressable, Platform, useWindowDimensions } from "react-native";
import { useState } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { BookResource, FilmResource, GameResource, SeriesResource, SongResource } from "app/types/Resources";
import { ResourceAttributes } from "./ResourceAttributes";
import { EditResourceButton } from "./EditResourceButton";
import { DeleteResourceButton } from "./DeleteResourceButton";



interface Props {
    imageUrl : string | null;
    returnRoute : string;
    resource: BookResource | FilmResource | SeriesResource | SongResource | GameResource;
    type: ResourceType;
    isOwner?: boolean;
    from: string | string[];
}

export const ResourceHeader = ({imageUrl, returnRoute, resource, type, isOwner, from}: Props) => {
    const {colors} = useTheme();

    const [showUI, setShowUI] = useState(true);

    const { height: SCREEN_HEIGHT } = useWindowDimensions();
    const HEADER_HEIGHT = SCREEN_HEIGHT *0.6;

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: HEADER_HEIGHT,
            position: 'relative',
        },
        coverImage: {
            ...StyleSheet.absoluteFillObject,
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 5,
        },
        gradient: {
            position: 'absolute',
            left:0,
            right:0,
            bottom:0,
            height:'100%',
        },
        returnButtonContainer:{
            position: 'absolute',
            top: 5,
            left: 0,
            right: 0,
            zIndex: 10,
        },
        tagsContainer:{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 16,
            paddingVertical: 10,
            zIndex: 5,
        }
    })

    return ( 
        
        <Pressable style={styles.container} onPressIn={() => setShowUI(false)} onPressOut={() => setShowUI(true)}>
            <Image 
                source={{uri: imageUrl || 'https://via.placeholder.com/600x900'}}
                style={styles.coverImage}
                resizeMode="cover"
            />
            {showUI && (
                <Animated.View
                    style={styles.overlay}
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(300)}
                >
                    <LinearGradient colors={['transparent', `${colors.background}99`, colors.background]} locations={[0.0, 0.5, 1.0]} style={styles.gradient} />
                    <View style={styles.tagsContainer}>
                        <ResourceAttributes resource={resource} isOwner={isOwner}/>
                    </View>
                    
                    <View style={styles.returnButtonContainer} className="flex-row px-4 pt-2 pb-4 justify-between">
                        <ReturnButton route={returnRoute} title="" style={' '} />
                        {isOwner && (
                            <View className="flex-row">
                                <EditResourceButton resource={resource} type={type} from={from} />
                                <DeleteResourceButton resource={resource} type={type} />
                            </View>
                        )}
                    </View>
                </Animated.View>
                
            )}
            
        </Pressable>
    )
}
