import { useCartStore } from "@/store/cart.store";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function CartButton() {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const router = useRouter()

  return (
   
    <Pressable className="cart-btn relative "
    onPress={
      () => {
        router.push("/(tabs)/cart")
      }
    } >
      <View className="cart-badge">
        <Text className=" text-center text-sm text-white   ">{totalItems}</Text>
      </View>
      {/* cart icon */}
      <Ionicons
        name="bag-handle-outline"
        size={16}
        color={colors.light.white.DEFAULT}
      />
    </Pressable>
    
  );
}
