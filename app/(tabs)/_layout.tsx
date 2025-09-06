import { View, Text } from "react-native";
import React from "react";
import { Redirect, Slot } from "expo-router";

export default function HomeLayout() {
  const isAuthenticated = false;

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
