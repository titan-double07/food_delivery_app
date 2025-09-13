import { images } from "@/constants";
import { useRoute } from "@react-navigation/native";
import { Slot, usePathname } from "expo-router";
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
  console.log("🚀 ~ AuthLayout ~ pathname:", pathname)

  return (
    <KeyboardAvoidingView
      className=" flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"} // this was added due to a different behaviour in android vs ios , where we have to add a padding on ios devices to push the conent up, while we need to add height on android
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView>
        <View
          style={{ height: Dimensions.get("screen").height }}
          className={`relative w-full   `}
        >
          <ImageBackground
            source={
              pathname === "/sign-in"
                ? images.loginGraphic
                : images.signUpGraphic
            }
            resizeMode="cover"
            // style={styles.image}
            className="h-[430px]  w-full"
          ></ImageBackground>
          <Image
            source={images.logo}
            resizeMode="contain"
            className="absolute left-1/2 top-[270px] z-10 size-[150px] -translate-x-1/2"
          />
          <View className="absolute bottom-0 h-[59%] w-full rounded-t-[30px]  bg-white p-[30px] pt-[84px] shadow-lg shadow-black">
            <Slot />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
