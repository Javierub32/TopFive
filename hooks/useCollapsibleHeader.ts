import { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';

export const useCollapsibleHeader = (headerHeight: number = 80) => {
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
    }, [headerHeight]);

    const headerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    //que se vaya desapareciendo la cabecera con la opacidad
    const headerOpacityStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateY.value,
            [-headerHeight, 0], // Rango de entrada: de oculto (-80) a visible (0)
            [0, 1],             // Rango de salida: de invisible (0) a completamente opaco (1)
            Extrapolation.CLAMP // Evita que la opacidad baje de 0 o suba de 1 si hay rebotes
        );
        return { opacity };
    });

    return { scrollHandler, headerStyle, headerHeight, headerOpacityStyle };
};