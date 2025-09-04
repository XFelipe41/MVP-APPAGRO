import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Inicio', headerRight: () => (
          <View style={{ marginRight: 10 }}>
            <ThemeToggleButton />
          </View>
        ) }} />
        <Stack.Screen name="new-diagnosis" options={{ title: 'Nuevo Diagnóstico' }} />
        <Stack.Screen name="diagnoses/index" options={{ title: 'Diagnósticos Guardados' }} />
        <Stack.Screen name="diagnoses/[id]" options={{ title: 'Resultados del Diagnóstico', headerRight: () => (
          <View style={{ marginRight: 10 }}>
            <ThemeToggleButton />
          </View>
        ) }} />
      </Stack>
    </ThemeProvider>
  );
}