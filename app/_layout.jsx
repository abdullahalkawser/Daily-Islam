import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


export default function RootLayout() {


  // Load custom font
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Show nothing while font is loading (could add splash/loader here)
  if (!fontsLoaded) return null;

  return (
    <>
      <Stack>
        <Stack.Screen name="home"options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="hadis/index" options={{ headerShown: false }} />
        <Stack.Screen name="duas/index" options={{ headerShown: false }} />
        <Stack.Screen name="gosol/index" options={{ headerShown: false }} />
        <Stack.Screen name="arbi/index" options={{ headerShown: false }} />
        <Stack.Screen name="sunnah/index" options={{ headerShown: false }} />
        <Stack.Screen name="ramadan/index" options={{ headerShown: false }} />
        <Stack.Screen name="amol/index" options={{ headerShown: false }} />
        <Stack.Screen name="tasbih/index" options={{ headerShown: false }} />
        <Stack.Screen name="zakat/index" options={{ headerShown: false }} />
        <Stack.Screen name="kitab/index" options={{ headerShown: false }} />
        <Stack.Screen name="sadaqah/index" options={{ headerShown: false }} />

        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>

    <StatusBar  />
    </>
  );
}
