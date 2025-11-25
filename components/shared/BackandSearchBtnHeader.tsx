import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type BackandSearchBtnHeaderProps = {
  title?: string;
};
export default function BackandSearchBtnHeader({
  title,
}: BackandSearchBtnHeaderProps) {
  const router = useRouter();
  return (
    <View className="flex-row justify-between">
      {/* arrow back */}
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </Pressable>

      {/* title */}
      <View>
        <Text className="base-semibold">{title}</Text>
      </View>

      {/* search btn */}
      <Pressable
        onPress={() => {
          router.push("/(tabs)/search");
        }}
      >
        <Ionicons name="search" size={24} color="black" />
      </Pressable>
    </View>
  );
}
