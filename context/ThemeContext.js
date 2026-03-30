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
    const [themePreference, setThemePreference] = useState('system') // 'light', 'dark' o 'system'

    let isDark;
    if (themePreference === 'system'){
        isDark = (systemScheme === 'dark')
    } else {
        isDark = (themePreference === 'dark')
    }

    const colors = isDark ? DARK_MODE_COLORS : LIGHT_MODE_COLORS;

    //Carga la preferencia guardada al iniciar la app
    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true);
                const savedTheme = await AsyncStorage.getItem('user_theme_preference');
                if (savedTheme !== null) {
                    //Aplicamos la preferencia guardad
                    setThemePreference(savedTheme)
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
        "--favorite": colors.favorite,
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

    const changeTheme = async (preferences) => {
        try {
            setThemePreference(preferences)
            await AsyncStorage.setItem('user_theme_preference', preferences)
        } catch (error) {
            console.error('Error saving theme preferences: ', error)
        }
    }

    return (
        <ThemeContext.Provider value={{ colors, isDark, changeTheme, themePreference, loading}}>
            <View style={[themeVars, { flex: 1, backgroundColor: colors.background }]}>
                {children}
            </View>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);