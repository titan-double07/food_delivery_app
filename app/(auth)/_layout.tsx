import { images } from "@/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { Redirect, Slot, usePathname } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

export default function AuthLayout() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  console.log("🚀 ~ AuthLayout ~ isAuthenticated:", isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    // <View className=" bg-white ">
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // this was added due to a different behaviour in android vs ios , where we have to add a padding on ios devices to push the conent up, while we need to add height on android
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        className=" relative h-full bg-white"
        showsVerticalScrollIndicator={false}
        // style={{ height: Dimensions.get("screen").height }}
        // keyboardShouldPersistTaps="handled"
      >
        <View
          style={{ height: Dimensions.get("screen").height }}
          className={`relative`}
        >
          <ImageBackground
            source={
              pathname === "/sign-in"
                ? images.loginGraphic
                : images.signUpGraphic
            }
            resizeMode="cover"
            // style={styles.image}
            className="h-[400px]  w-full"
          ></ImageBackground>
          <Image
            source={images.logo}
            resizeMode="contain"
            className={cn(
              "absolute left-1/2 top-[290px] z-10 size-[150px] -translate-x-1/2",
              pathname === "/sign-up" && "top-[210px]",
            )}
          />

          <Slot />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    // {/* </View> */}
  );
}
