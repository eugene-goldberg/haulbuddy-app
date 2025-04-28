import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="choice" options={{ headerShown: false }} />
        <Stack.Screen name="choice1/screen1" options={{ headerShown: false }} />
        <Stack.Screen name="choice1/screen2" options={{ headerShown: false }} />
        <Stack.Screen name="choice1/screen3" options={{ headerShown: false }} />
        <Stack.Screen name="choice1/screen4" options={{ headerShown: false }} />
        <Stack.Screen name="choice1/screen5" options={{ headerShown: false }} />
        <Stack.Screen name="choice1/tracking" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/login" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/signup" options={{ headerShown: false }} />
        <Stack.Screen name="owner-onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="owner-onboarding/vehicle-info" options={{ headerShown: false }} />
        <Stack.Screen name="owner-onboarding/vehicle-photos" options={{ headerShown: false }} />
        <Stack.Screen name="owner-onboarding/pricing" options={{ headerShown: false }} />
        <Stack.Screen name="owner-onboarding/confirmation" options={{ headerShown: false }} />
        <Stack.Screen name="owner-dashboard/jobs" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}