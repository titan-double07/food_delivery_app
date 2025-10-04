import { useFonts } from "expo-font";
import "react-native-reanimated";
import "./global.css";

import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

// Prevent auto-hiding the splash until fonts are ready
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  // this is used to load the fonts
  const [fontsLoaded, fontError] = useFonts({
    Quicksand: require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    Rubik: require("../assets/fonts/Rubik-VariableFont.ttf"),
  });

  // if there is an error loading the fonts, throw an error, if fonts are loaded, hide the splash screen
  useEffect(() => {
    if (fontError) {
      console.log(fontError);
      throw fontError;
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // .hideAsync() will hide the splash screen after fonts are loaded
    }
  });

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  if (!fontsLoaded || isLoading) {
    return null; // don't render UI until fonts are ready
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
