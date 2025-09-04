// Un verde azulado más moderno y profesional
const primaryColor = '#4Caf50'; 

export const Colors = {
  light: {
    // --- Colores Base ---
    text: '#264653', // Un azul oscuro para el texto, muy legible
    background: '#f9f8f8ff', // Fondo blanco puro
    primary: primaryColor,
    secondary: '#4Caf50', // Un acento de color arena/amarillo
    tint: primaryColor,
    icon: '#264653',

    // --- Componentes Específicos ---
    // Gráfico Radar
    chartLineColor: '#9347c3ff',

    // Botones de navegación (Anterior/Siguiente)
    navButtonBg: '#4Caf50',
    navButtonText: '#fff',

    // Cuadro de Resumen de Resultados
    summaryBoxBg: '#4caf4f1a', // Un tono anaranjado para destacar

    // Tabla de Resultados
    tableBg: '#FFFFFF',
    tableHeaderText: '#FFFFFF',
    tableHeaderBg: '#4Caf50',
    tableRowText: '#264653',
    tableBorder: '#DDDDDD',
    
    // --- Colores Genéricos de Botones ---
    buttonBorder: primaryColor,
    buttonSelectedBg: primaryColor,
    buttonSelectedText: '#FFFFFF',
    buttonDefaultBg: 'transparent',
    buttonDefaultText: '#264653',
  },
  dark: {
    // --- Colores Base ---
    text: '#FFFFFF', // Texto blanco puro
    background: '#0D1B2A', // El azul oscuro como fondo
    primary: primaryColor,
    secondary: '#d5d1d1ff', // El color primario funciona bien como secundario en modo oscuro
    tint: primaryColor,
    icon: '#FFFFFF',

    // --- Componentes Específicos ---
    // Gráfico Radar
    chartLineColor: '#9347c3ff',

    // Botones de navegación (Anterior/Siguiente)
    navButtonBg: '#4Caf50',
    navButtonText: '#FFFFFF',

    // Cuadro de Resumen de Resultados
    summaryBoxBg: '#2f2d2dff',

    // Tabla de Resultados
    tableBg: '#fff', // Un azul/gris más claro que el fondo
    tableHeaderText: '#fff',
    tableHeaderBg: '#4Caf50',
    tableRowText: '#000',
    tableBorder: '#264653',

    // --- Colores Genéricos de Botones ---
    buttonBorder: primaryColor,
    buttonSelectedBg: primaryColor,
    buttonSelectedText: '#FFFFFF',
    buttonDefaultBg: 'transparent',
    buttonDefaultText: '#FFFFFF',
  },
};