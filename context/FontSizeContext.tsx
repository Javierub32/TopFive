import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type FontSizeContextType = {
  fontSizeMultiplier:number;
  changeFontSizeMultiplier: (multiplier:number) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider = ({children}: any) =>{
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);

  useEffect(() => {
    // Se carga el valor desde el ASYNCSOTRAGE (Local storgae pa moviles) cuando se monta el componente
const loadStoredMultiplier = async () => {
      try {
        const storedMultiplier = await AsyncStorage.getItem('fontSizeMultiplier');
        if (storedMultiplier !== null) {
          setFontSizeMultiplier(parseFloat(storedMultiplier));
        }
      } catch (error) {
        console.error('Error al cargar el tamaño de la fuente desde AsyncStorage', error);
      }
    };

    loadStoredMultiplier();
  }, []);

  // Para cambiar el tamaño de la fuente y guardarlo localmente
  const changeFontSizeMultiplier = async (multiplier: number) => {
      try {
        setFontSizeMultiplier(multiplier);
        await AsyncStorage.setItem('fontSizeMultiplier', multiplier.toString());
      } catch (error) {
        console.error('Error al guardar el tamaño de la fuente en AsyncStorage', error);
      }
  };
  
  return (
    <FontSizeContext.Provider value={{fontSizeMultiplier, changeFontSizeMultiplier}}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize debe ser usado dentro de un FontSizeProvider');
  }
  return context;
};