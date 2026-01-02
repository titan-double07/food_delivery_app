import CustomAlert from "@/components/shared/CustomAlert";
import { useAuthStore } from "@/store/auth.store";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "./global.css";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent auto-hiding the splash until fonts are ready
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser, isAuthenticated } = useAuthStore();

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

  // 👇 Decide where to start
//  if (isAuthenticated) {
//    return router.push("/(checkout)/delivery-address");
//  }

  // 68ea6c51002b6a437056

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen
          name="menu-item/[id]"        
          initialParams={{ id: "68ea6c51002b6a437056" }}
        /> */}
        {/* <Stack.Screen name="/(checkout)/delivery-address" /> */}
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Toast />
      <CustomAlert />
    </>
  );
}
