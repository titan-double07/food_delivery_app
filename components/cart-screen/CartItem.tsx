
import { useCartStore } from "@/store/cart.store";
import { styles } from "@/styles/cart-style";
import { colors } from "@/theme/colors";
import { CartItemType } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  Text,
  View
} from "react-native";

export default function CartItem({ item }: { item: CartItemType }) {
  console.log("🚀 ~ CartItem ~ item:", item);
  const [isChecked, setChecked] = useState(false);

  const { removeItem,increaseQty, decreaseQty } = useCartStore((s) => s);
  return (
    <View className="cart-item" style={[styles.shadow]}>
      {/* checkbox */}
      <Checkbox
        className="m-2 "
        value={isChecked}
        onValueChange={setChecked}
        color={colors.light.primary}
      />
      {/* image */}
      <Image source={{ uri: item.image_url }} className="cart-item__image" />

      {/* name, price, quantity */}
      <View className="flex-1">
        <Text className="paragraph-bold">{item.name}</Text>
        <Text className="paragraph-bold text-primary">${item.price}</Text>
        {/* ations */}
        <View className="flex-row items-center justify-between">
          <View className="paragraph-bold flex-row items-center gap-5">
            <Pressable className="cart-item__actions" onPress={()=>decreaseQty(item.id, item.customizations!)}>
              <Ionicons
                name="remove-outline"
                size={20}
                color={colors.light.primary}
                className=""
              />
            </Pressable>
            <Text className="base-bold text-dark-100">{item.quantity}</Text>
            <Pressable className="cart-item__actions" onPress={()=>increaseQty(item.id, item.customizations!) } >
              <Ionicons
                name="add-outline"
                size={20}
                color={colors.light.primary}
              />
            </Pressable>
          </View>
          {/* delete */}
          <Pressable onPress={() => removeItem(item.id, item.customizations!)}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={colors.light.error}
            />
          </Pressable>
        </View>
      </View>
      
    </View>
  );
}
