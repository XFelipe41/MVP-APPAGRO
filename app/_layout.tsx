import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Inicio' }} />
        <Stack.Screen name="new-diagnosis" options={{ title: 'Nuevo Diagnóstico' }} />
        <Stack.Screen name="diagnoses/index" options={{ title: 'Diagnósticos Guardados' }} />
        <Stack.Screen name="diagnoses/[id]" options={{ title: 'Resultados del Diagnóstico' }} />
      </Stack>
    </ThemeProvider>
  );
}