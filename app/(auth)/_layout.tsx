import { images } from "@/constants";
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
        keyboardShouldPersistTaps="handled"
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
            className="absolute left-1/2 top-[270px] z-10 size-[150px] -translate-x-1/2"
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              // zIndex: 10,
            }}
            className=" h-[58%] w-full  rounded-t-[30px] bg-white p-[30px] pt-[82px] shadow-lg shadow-black"
          >
            <Slot />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    // {/* </View> */}
  );
}
