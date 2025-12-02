
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
  const [isChecked, setChecked] = useState(false);

  const { removeItem, increaseQty, decreaseQty, toggleItemSelection, isItemSelected } = useCartStore((s) => s);

  // Calculate item total price (base + customizations) × quantity
  const customizationsPrice =
    item.customizations?.reduce((sum, c) => sum + c.price, 0) || 0;
  const itemTotal = (item.price + customizationsPrice) * item.quantity;

  return (
    <View className="cart-item" style={[styles.shadow]}>
      {/* checkbox */}
      <Checkbox
        className="m-2 "
        value={isItemSelected(item.cartKey!)}
        onValueChange={()=>toggleItemSelection(item.cartKey!)}
        color={colors.light.primary}
      />
      {/* image */}
      <Image source={{ uri: item.image_url }} className="cart-item__image" />

      {/* name, price, quantity */}
      <View className="flex-1">
        <Text className="paragraph-bold">{item.name}</Text>

        <Text className="paragraph-bold text-gray-600">${item.price}</Text>
        {/* Customizations list */}
        {item.customizations && item.customizations.length > 0 && (
          <View className="mt-2 gap-1">
            {item.customizations.map((custom) => (
              <View key={custom.id} className="flex-row items-center gap-1">
                <Ionicons
                  name="add-circle-outline"
                  size={12}
                  color={colors.light.primary}
                />
                <Text className="text-xs text-gray-600">
                  {custom.name} (+${custom.price.toFixed(2)})
                </Text>
              </View>
            ))}
          </View>
        )}
        {/* ations */}
        <View className="flex-row items-center justify-between">
          {/* quantity */}
          <View className="paragraph-bold flex-row items-center gap-5">
            <Pressable
              className="cart-item__actions"
              onPress={() => decreaseQty(item.id, item.customizations!)}
            >
              <Ionicons
                name="remove-outline"
                size={20}
                color={colors.light.primary}
                className=""
              />
            </Pressable>
            <Text className="base-bold text-dark-100">{item.quantity}</Text>
            <Pressable
              className="cart-item__actions"
              onPress={() => increaseQty(item.id, item.customizations!)}
            >
              <Ionicons
                name="add-outline"
                size={20}
                color={colors.light.primary}
              />
            </Pressable>
          </View>
          {/* Item total */}
          <Text className="font-bold text-primary">
            ${itemTotal.toFixed(2)}
          </Text>
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
