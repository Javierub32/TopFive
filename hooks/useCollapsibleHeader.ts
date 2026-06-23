import { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle } from 'react-native-reanimated';

export const useCollapsibleHeader = (headerHeight: number) => {
    const translateY = useSharedValue(0); //posicion de la cabecera ahora mismo
    const lastScrollY = useSharedValue(0); //para saber si estabamos subiendo o bajando

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const currentY = event.contentOffset.y;
            
            if (currentY < 0) return; 

            const deltaY = currentY - lastScrollY.value; //diferencia de movimiento, 
            let newTranslateY = translateY.value - deltaY;

            //  0 es visible, -headerHeight es oculto arriba
            if (newTranslateY > 0) {
                newTranslateY = 0;
            } else if (newTranslateY < -headerHeight) {
                newTranslateY = -headerHeight;
            }

            translateY.value = newTranslateY; // lo que va a hacer la cabecera ahora, lo aplicamos abajo con transfrom
            lastScrollY.value = currentY;
        },
    });

    const headerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return { scrollHandler, headerStyle, headerHeight };
};