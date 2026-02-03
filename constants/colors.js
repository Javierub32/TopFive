const COMMON_COLORS = {
    // Colores comunes a ambos modos

    //Colores principales de la paleta
    primary: '#fc6703',

    //Colores especiales
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',

    //Colores de texto
    placeholderText: '#64748b',
    title: '#42909f',     //Utilizado en los títulos de las secciones dentro del contenido

    //Colores de la barra del layout
    tabBarActiveTintColor: '#fc6703', 

    //Colores para elementos
    marker: 'rgb(48 101 165 / 0.4)', 	// Color de bg para marcadores (calificaciones, num visualizaciones, etc)
    rating: '#fbbf24', 				// Color para las estrellas de calificación
    statsColor: '252, 103, 3', //Color de las barras de la gráfica (en la implementación se le añade una opacidad)
  };

  export const DARK_MODE_COLORS = {
    // Colores principales de la paleta
    secondary: '#428f9e',
    accent: '#204879',
    
    primaryVariant: '#8a4517', //Una variante más oscura del primario (usada en el fondo de login)

    // Fondo principal de la app
    background: '#0a1223', 

    // Colores de texto
    primaryText: '#ffffff',
    secondaryText: '#9ca3af', 

    // Colores de la barra del layout
    tabBarInactiveTintColor: '#9ca3af',
    tabBarBackgroundColor: '#1e293b',
    tabBarBorderTopColor: 'rgba(252, 103, 3, 0.5)',

    // Colores para los elementos
    borderButton: '#428f9e',  // Color del borde del botón
    surfaceButton: '#1e293b', // Color de fondo de la barra de búsqueda y tarjetas

    markerText: '#9ca3af', 			// Color para el texto dentro de los marcadores

    statsLabelColor: '156, 163, 175', //Color para las etiquetas de la barra de la gráfica (en la implementación se añade opacidad)

    ...COMMON_COLORS
  };

  export const LIGHT_MODE_COLORS = {
    // Colores principales de la paleta
    secondary: '#61adbd',
    accent: '#5781b3',
    
    primaryVariant: '#d67f45', // Una variante más clara del color primario (utilizada en la página de login)

    // Fondo principal de la app
    background: '#dbe3f5', 

    // Colores de texto
    primaryText: '#000000',
    secondaryText: '#4f5763', 

    // Colores específicos para el TabBar
    tabBarInactiveTintColor: '#4f5763',
    tabBarBackgroundColor: '#c5d0e2',
    tabBarBorderTopColor: 'rgba(252, 103, 3, 0.5)',

    // Colores para los elementos
    borderButton: '#61adbd',  // Color del borde del botón
    surfaceButton: '#c5d0e2', // Color de fondo de la barra de búsqueda y tarjetas

    markerText: '#4f5763', 			// Color para el texto dentro de los marcadores

    statsLabelColor: '79, 87, 99',  //Color para las etiquetas de la barra de la gráfica (en la implementación se añade opacidad)

    ...COMMON_COLORS
  };




  const COLORS = DARK_MODE_COLORS;
  module.exports = {
    DARK_MODE_COLORS,
    LIGHT_MODE_COLORS,
    COLORS
  };