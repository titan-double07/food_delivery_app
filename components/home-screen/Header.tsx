import { images } from "@/constants";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CartButton from "../shared/CartButton";

export default function Header() {
  return (
    <View className=" flex-between w-full flex-row">
      <View className="flex flex-col gap-1.5">
        <Text className="small-bold text-primary">SEARCH</Text>
        {/* location dropdown */}
        <TouchableOpacity
          className="w-full flex-row items-center  gap-1 "
          onPress={() => {
            console.log("location");
          }}
        >
          <Text className=" paragraph-bold">Lagos</Text>
          <Image
            source={images.arrowDown}
            resizeMode="contain"
            className=" h-3 w-3 "
          />
        </TouchableOpacity>
      </View>
      {/* cart */}
      <CartButton />
    </View>
  );
}
