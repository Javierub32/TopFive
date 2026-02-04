const COMMON_COLORS = {
    // Colores comunes a ambos modos

    //Colores principales de la paleta
    primary: '#47b553', //marron                                                                                                        //cambiado

    //Colores especiales
    error: '#EF4444', //rojo utilizado para errores
    success: '#10B981', //verde utilizado para acciones exitosas
    warning: '#F59E0B', //naranja utilizado para advertencias
    favorite: '#EF4444', //rojo usado para la cualidad de favorito

    //Colores de texto
    placeholderText: '#64748b', // gris utilizado en los textos de placeholder
    title: '#42909f',  //azul utilizado en los títulos de las secciones dentro del contenido

    //Colores de la barra del layout
    tabBarActiveTintColor: '#47b553', // marron utilizado en los iconos de la barra de navegación cuando están activos                  //cambiado

    //Colores para elementos
    marker: 'rgb(48 101 165 / 0.4)', 	// azul utilizado para el fondo de los marcadores en los contenidos
    statsColor: '71, 181, 83', // marron utilizado para las barras de la gráfica (en la implementación se le añade una opacidad)       //cambiado
  };

  export const DARK_MODE_COLORS = {
    // Colores principales de la paleta                                                                                                 
    secondary: '#428f9e', //azul grisáceo
    accent: '#5781b3', //azul fuerte
    
    primaryVariant: '#1D350E', // Una variante más oscura del primario (usada en el fondo de login)                                    //cambiado

    // Fondo principal de la app
    background: '#0a1223', // azul muy oscuro

    // Colores de texto
    primaryText: '#ffffff', // blanco
    secondaryText: '#9ca3af', // gris claro

    // Colores de la barra del layout
    tabBarInactiveTintColor: '#9ca3af', // gris para la iconos de la barra de navegación cuando están inactivos
    tabBarBackgroundColor: '#1e293b', // azul oscuro para el fondo de la barra de navegación    
    tabBarBorderTopColor: 'rgba(71, 181, 83, 0.5)', // marron translúcido para el borde superior de la barra de navegación               //cambiado

    // Colores para los elementos
    borderButton: '#428f9e',  // azul utilizado para el borde del botón
    surfaceButton: '#1e293b', // azul oscuro utilizado para el fondo de la barra de búsqueda y tarjetas
    rating: '#fbbf24', 				// amarillo utilizado para las estrellas de calificación

    markerText: '#9ca3af', 			// gris claro utilizado para el texto dentro de los marcadores

    statsLabelColor: '156, 163, 175', // gris utilizado para las etiquetas de la barra de la gráfica (en la implementación se añade opacidad)

    ...COMMON_COLORS
  };

  export const LIGHT_MODE_COLORS = {
    // Colores principales de la paleta                                                                                           
    secondary: '#61adbd', //azul claro
    accent: '#5781b3', //azul fuerte

    primaryVariant: '#82EE87', // Una variante más clara del color primario (utilizada en la página de login)                           //cambiado             

    // Fondo principal de la app
    background: '#dbe3f5', // azul muy claro                                                                                            

    // Colores de texto
    primaryText: '#000000', // negro
    secondaryText: '#4f5763', // gris oscuro

    // Colores específicos para el TabBar
    tabBarInactiveTintColor: '#4f5763', // gris para la iconos de la barra de navegación cuando están inactivos
    tabBarBackgroundColor: '#c5d0e2', // azul claro para el fondo de la barra de navegación
    tabBarBorderTopColor: 'rgba(71, 181, 83, 0.5)', // azul claro translúcido para el borde superior de la barra de navegación               //cambiado

    // Colores para los elementos
    borderButton: '#61adbd',  // azul claro utilizado para el borde del botón
    surfaceButton: '#c5d0e2', // azul claro utilizado para el fondo de la barra de búsqueda y tarjetas
    rating: '#dc9f04', 				// amarillo utilizado para las estrellas de calificación

    markerText: '#4f5763', 			// gris oscuro utilizado para el texto dentro de los marcadores

    statsLabelColor: '79, 87, 99',  // gris oscuro utilizado para las etiquetas de la barra de la gráfica (en la implementación se añade opacidad)

    ...COMMON_COLORS
  };




  const COLORS = DARK_MODE_COLORS;
  module.exports = {
    DARK_MODE_COLORS,
    LIGHT_MODE_COLORS,
    COLORS
  };