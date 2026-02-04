const colors = require('tailwindcss/colors');
const { COLORS } = require('./constants/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // == Colores de la paleta principal ==
        primary: 'var(--primary)',       
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        error: 'var(--error)',
        favorite: 'var(--favorite)',
        primaryVariant: 'var(--primaryVariant)', 


		    // == FONDOS ==
        // Clase: bg-background (Pantalla principal)
        background: 'var(--background)', 
        
        // Clase: bg-surfaceButton (Search bar, tarjetas)
        surfaceButton: 'var(--surfaceButton)',
        borderButton: 'var(--borderButton)',
        

        // == TEXTOS ==
        primaryText: 'var(--primaryText)',         
        secondaryText: 'var(--secondaryText)',     
        placeholderText: 'var(--placeholderText)', 
		    title: 'var(--title)', 

        // == BORDES ==
		    marker: 'var(--marker)',  
		    markerText: 'var(--markerText)', 
        rating: 'var(--rating)',
      },
    },
  },
  plugins: [],
}