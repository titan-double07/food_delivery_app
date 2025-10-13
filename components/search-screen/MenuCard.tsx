import { View, Text } from "react-native";
import React from "react";
import { MenuItem } from "@/type";

export default function MenuCard({
  item: { image_url, name, price },
}: {
  item: MenuItem;
}) {
  return (
    <View className="menu-card">
      <Text>{name}</Text>
      <Text>{price}</Text>
    </View>
  );
}
