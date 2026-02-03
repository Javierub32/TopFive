import { Children, createContext, use, useContext, useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DARK_MODE_COLORS, LIGHT_MODE_COLORS } from "constants/colors";
import { vars } from "nativewind";



//Creamos el contexto
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme(); //Utiliza el tema por defecto del dispositivo.
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(systemScheme === 'dark');

    //Decidimos qué objeto de colores usar según el estado
    const colors = isDark ? DARK_MODE_COLORS : LIGHT_MODE_COLORS;

    //Carga la preferencia guardada al iniciar la app
    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true);
                const savedTheme = await AsyncStorage.getItem('user_theme_preference');
                if (savedTheme !== null) {
                    //Si no había nada guardado, lo establecemos a modo oscuro
                    setIsDark(savedTheme === 'dark');
                }
            } catch (error) {
                console.error('Error loading settings: ', error);
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    const themeVars = vars({
        "--primary": colors.primary,
        "--secondary": colors.secondary,
        "--accent": colors.accent,
        "--error": colors.error,
        "--primaryVariant": colors.primaryVariant,
        "--background": colors.background,
        "--surfaceButton": colors.surfaceButton,
        "--borderButton": colors.borderButton,
        "--primaryText": colors.primaryText,
        "--secondaryText": colors.secondaryText,
        "--placeholderText": colors.placeholderText,
        "--title": colors.title,
        "--marker": colors.marker,
        "--markerText": colors.markerText,
        "--rating": colors.rating,
    })

    //Funcion para alternar el tema que usaremos en los ajustes.
    const toggleTheme = async () => {
        try {
            const newMode = !isDark;
            setIsDark(newMode);
            await AsyncStorage.setItem('user_theme_preference', newMode ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme preferences: ', error);
        }
    }

    return (
        <ThemeContext.Provider value={{ colors, isDark, toggleTheme, loading}}>
            <View style={[themeVars, { flex: 1, backgroundColor: colors.background }]}>
                {children}
            </View>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);