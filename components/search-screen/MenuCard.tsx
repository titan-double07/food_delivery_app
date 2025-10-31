import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import React from "react";
import { Image, Platform, Text, TouchableOpacity } from "react-native";

export default function MenuCard({
  item,
}: {
  item: MenuItem;
  }) {
  const { name, image_url, price } = item;
  const addToCart = useCartStore(s=>s.addItem)
  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
    >
      <Image
        source={{
          uri: image_url,
        }}
        className="absolute -top-10 size-32"
        resizeMode="contain"
      />
      <Text
        className="base-bold mb-2 text-center text-dark-100"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="body-regular mb-4 text-gray-200">From ${price}</Text>
      <TouchableOpacity onPress={() => addToCart({id: item.$id, name, image_url, price, customizations: []})}>
        <Text className="paragraph-bold text-primary">Add to Cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
