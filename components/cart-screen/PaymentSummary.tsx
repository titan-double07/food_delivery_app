import { View, Text } from "react-native";
import React from "react";
import { CartItemType } from "@/type";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils";
import { styles } from "@/app/(tabs)/cart";

export default function PaymentSummary() {
    
    const { items, getTotalItems, getTotalPrice}= useCartStore((state) => state)
    console.log("🚀 ~ PaymentSummary ~ items:", items)
    
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    if(totalItems <= 0){
        return null
    }

  return (
    <View className="gap-4 rounded-lg  p-5 bg-white" style={[styles.shadow]}>
      <Text className="h3-bold pb-0.5 ">PaymentSummary</Text>

      <SummaryRow title={`Total Items (${totalItems})`} value={`${totalPrice.toFixed(2)}`} />
      <SummaryRow title="Delivery Fee" value={`$5.00`} />
      <SummaryRow title="Discount" value={`5%`} valueClassName="text-success" />
      {/* <SummaryRow title="Delivery Fee" value={`$${deliveryFee.toFixed(2)}`} />
      <SummaryRow title="Discount" value={`${(discount * 100).toFixed(0)}%`} /> */}
      <View className="w-full border border-[#d6d6d6dc]"></View>
      <SummaryRow title="Total" value={`$${(totalPrice+5-(totalPrice*0.05)).toFixed(2)}`} />
    </View>
  );
}

const SummaryRow = ({ title, value, valueClassName }: { title: string; value: string; valueClassName?: string }) => {
  return (
    <View className="flex-between w-full flex-row">
      {/*title*/}
      <Text className=" paragraph-medium text-gray-100 ">{title}</Text>
      {/*value*/}
      <Text className={cn(" paragraph-bold", valueClassName)}>{value}</Text>
    </View>
  );
};
