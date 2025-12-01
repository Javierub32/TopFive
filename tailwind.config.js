/** @type {import('tailwindcss').Config} */
module.exports = {
  // Asegúrate de incluir "./app/**/*.{js,jsx,ts,tsx}"
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}" // (Si tienes algo en src, déjalo, si no, bórralo)
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}