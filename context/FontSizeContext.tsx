import { createContext, useContext, useEffect, useState } from "react";

type FontSizeContextType = {
  fontSizeMultiplier:number;
  changeFontSizeMultiplier: (multiplier:number) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider = ({children}: any) =>{
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);

  useEffect(() => {
    // Se carga el valor desde el localStorage cuando se monta el componente
    const storedMultiplier = localStorage.getItem('fontSizeMultiplier');
    if (storedMultiplier) {
      setFontSizeMultiplier(parseFloat(storedMultiplier));
    }
  }, []);

  // Para cambiar el tamaño de la fuente y guardarlo localmente
  const changeFontSizeMultiplier = (multiplier:number) => {
    setFontSizeMultiplier(multiplier);
    localStorage.setItem('fontSizeMultiplier', multiplier.toString());
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