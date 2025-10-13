import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { images } from "@/constants";

export default function CartButton() {
  const numOfOrders = 2;
  return (
    <TouchableOpacity className="cart-btn relative ">
      {/*  */}
      <View className="cart-badge">
        <Text className=" text-center text-sm text-white   ">
          {numOfOrders}
        </Text>
      </View>
      {/* cart icon */}
      <Image source={images.bag} resizeMode="contain" className=" size-4" />
    </TouchableOpacity>
  );
}
