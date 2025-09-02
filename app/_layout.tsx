import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Inicio' }} />
      <Stack.Screen name="new-diagnosis" options={{ title: 'Nuevo Diagnóstico' }} />
      <Stack.Screen name="diagnoses/index" options={{ title: 'Diagnósticos Guardados' }} />
      <Stack.Screen name="diagnoses/[id]" options={{ title: 'Resultados del Diagnóstico' }} />
    </Stack>
  );
}