import { useFonts } from "expo-font";
import "react-native-reanimated";
import "./global.css";
import { useAuthStore } from "@/store/auth.store";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import CustomAlert from "@/components/shared/CustomAlert";
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

  // to Resume the Last Visited Page
  // const router = useRouter();
  // const segments = useSegments();

  // useEffect(() => {
  //   // Save the current route whenever it changes
  //   if (segments.length > 0) {
  //     AsyncStorage.setItem("lastRoute", "/" + segments.join("/"));
  //   }
  // }, [segments]);

  // useEffect(() => {
  //   // On first load, restore last route
  //   (async () => {
  //     const lastRoute = await AsyncStorage.getItem("lastRoute");
  //     if (lastRoute) {
  //       router.replace(lastRoute);
  //     }
  //   })();
  // }, []);

  // 👇 Decide where to start
  // if (isAuthenticated) {
  //   return <Redirect href="/(tabs)/search" />;
  // }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Toast />
      <CustomAlert />
    </>
  );
}
