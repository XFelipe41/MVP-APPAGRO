const primaryGreen = '#4CAF50';
const darkBlueBackground = '#0D1B2A'; // Un azul oscuro y profesional
const lightText = '#F5F5F5';
const subtleGray = '#415A77'; // Un gris azulado para elementos secundarios

const theme = {
  text: lightText,
  background: darkBlueBackground,
  tint: primaryGreen,
  icon: lightText,
  tabIconDefault: subtleGray,
  tabIconSelected: primaryGreen,

  // Custom colors
  primary: primaryGreen,
  secondary: subtleGray,
  buttonBorder: primaryGreen,
  buttonSelectedBg: primaryGreen,
  buttonSelectedText: '#FFFFFF',
  buttonDefaultBg: 'transparent',
  buttonDefaultText: lightText,
};

export const Colors = {
  light: theme,
  dark: theme,
};
