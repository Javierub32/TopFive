const colors = require('tailwindcss/colors');
const { COLORS } = require('./constants/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // == COLORES PRINCIPALES ==
        primary: COLORS.primary,       // #8b5cf6


		// == FONDOS ==
        // Clase: bg-background (Pantalla principal)
        background: COLORS.background,   // #0f111a
        
        // Clase: bg-surfaceButton (Search bar, tarjetas)
        surfaceButton: COLORS.surfaceButton,// #1e293b
        

        // == TEXTOS ==
        primaryText: COLORS.primaryText,          // #ffffff
        secondaryText: COLORS.secondaryText,     // #9ca3af
        placeholderText: COLORS.placeholderText, // #64748b
		title: COLORS.title, // #c084fc

        // == BORDES ==
        borderButton: COLORS.borderButton,   // #334155
		marker: COLORS.marker,       // 'rgb(88 28 135 / 0.4)'
		markerText: COLORS.markerText, // '#e9d5ff'
      },
    },
  },
  plugins: [],
}