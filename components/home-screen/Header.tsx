import { images } from "@/constants";
import { Image } from "@/utils/nativewind";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  return (
    <View className=" w-full flex-between flex-row">
      <View className="flex-col flex gap-1.5">
        <Text className="small-bold text-primary">DELIVER TO</Text>
        {/* location dropdown */}
        <TouchableOpacity
          className="flex-row gap-1 items-center  w-full "
          onPress={() => {
            console.log("location");
          }}>
          <Text className=" paragraph-bold">Lagos</Text>
          <Image
            source={images.arrowDown}
            resizeMode="contain"
            className=" w-3 h-3 "
          />
        </TouchableOpacity>
      </View>
      {/* cart */}
      <Cart />
    </View>
  );
}

const Cart = () => {
  const numOfOrders = 2;
  return (
    <TouchableOpacity className="cart-btn relative ">
      {/*  */}
      <View className="cart-badge">
        <Text className=" text-white text-center text-sm   ">
          {numOfOrders}
        </Text>
      </View>
      {/* cart icon */}
      <Image source={images.bag} resizeMode="contain" className=" size-4" />
    </TouchableOpacity>
  );
};
