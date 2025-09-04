import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useSystemColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark'); // Default to dark theme

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('appTheme');
        if (storedTheme) {
          setColorScheme(storedTheme as ColorScheme);
        } else {
          // If no theme is stored, set dark as default
          setColorScheme('dark');
          await AsyncStorage.setItem('appTheme', 'dark');
        }
      } catch (e) {
        console.error('Failed to load theme from AsyncStorage', e);
        setColorScheme('dark'); // Fallback to dark on error
      }
    };
    loadTheme();
  }, []);

  const toggleColorScheme = async () => {
    const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newColorScheme);
    try {
      await AsyncStorage.setItem('appTheme', newColorScheme);
    } catch (e) {
      console.error('Failed to save theme to AsyncStorage', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
