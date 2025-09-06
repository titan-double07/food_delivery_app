import { View, Text } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <SafeAreaView className="page-padding">
      <Text>AuthLayout</Text>
      <Slot />
    </SafeAreaView>
  );
}
