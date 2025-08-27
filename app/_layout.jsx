import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load custom font
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Show nothing while font is loading (could add splash/loader here)
  if (!fontsLoaded) return null;

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
<Stack.Screen name="hadis/index" options={{ headerShown: false }} />

        <Stack.Screen name="duas/index" options={{ headerShown: false }} />
        <Stack.Screen name="tasbih/index" options={{ headerShown: false }} />
        <Stack.Screen name="zakat/index" options={{ headerShown: false }} />
        <Stack.Screen name="kitab/index" options={{ headerShown: false }} />
        <Stack.Screen name="sadaqah/index" options={{ headerShown: false }} />

        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
