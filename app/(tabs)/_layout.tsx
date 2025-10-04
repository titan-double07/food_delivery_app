import { useAuthStore } from "@/store/auth.store";
import { Redirect, Slot } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function HomeLayout() {
  const { isAuthenticated } = useAuthStore();
  console.log("🚀 ~ HomeLayout ~ isAuthenticated:", isAuthenticated)

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <View>
      <Text>HomeLayout</Text>
      <Slot />
    </View>
  );
}
