export const cleanHtmlDescription = (html: string | null | undefined): string => {
    if (!html) return '';
    
    return html
      // 1. Reemplazar tags <br> y <p> por saltos de línea reales
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      
      // 2. Eliminar cualquier otro tag HTML (<b>, <i>, etc.)
      .replace(/<[^>]+>/g, '')
      
      // 3. Decodificar entidades comunes
      .replace(/&nbsp;|&#xa0;/g, ' ')  // Espacios de no separación
      .replace(/&amp;/g, '&')          // Ampersand
      .replace(/&quot;/g, '"')         // Comillas dobles
      .replace(/&lt;/g, '<')           // Menor que
      .replace(/&gt;/g, '>')           // Mayor que
      
      // 4. Limpiar espacios extra resultantes
      .trim();
};