import { useCartStore } from "@/store/cart.store";
import { MenuItemtype } from "@/type";
import { Link } from "expo-router";
import React from "react";
import { Image, Platform, Text, TouchableOpacity } from "react-native";

export default function MenuCard({
  item,
}: {
  item: MenuItemtype;
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
      <Link
        href={{
          pathname: "/menu-item/[id]",
          params: { id: item.$id },
        }}
      >
      <Image
        source={{
          uri: image_url,
        }}
        className="absolute -top-10 size-32"
        resizeMode="contain"
      />
      </Link>
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
