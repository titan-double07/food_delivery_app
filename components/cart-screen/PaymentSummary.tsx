import { cn } from "@/lib/utils";
import { useAlertStore } from "@/store/alert-store";
import { useCartStore } from "@/store/cart.store";
import { styles } from "@/styles/cart-style";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function PaymentSummary() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore(
    (state) => state,
  );
  const { showAlert } = useAlertStore();
  // console.log(
  //   `\n-------------------------------------------------------\n` +
  //     `PaymentSummary ~ items:\n` +
  //     JSON.stringify(items, null, 2) +
  //     `\n-------------------------------------------------------\n`,
  // );

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  // Calculate totals
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 5.0 : 0; // Free delivery if cart is empty
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + deliveryFee + tax;
  const discount = 5 / 100;
  const discountedTotal = (totalPrice + deliveryFee - totalPrice * discount).toFixed(2);

  /**
   * Handle order placement
   * TODO: Implement actual order API call
   */
  const handlePlaceOrder = () => {
    if (items.length === 0) {
      showAlert({
        type: "info",
        title: "Empty Cart",
        message: "Please add items to your cart before placing an order",
      });
      return;
    }

    // Show confirmation dialog
    showAlert({
      type: "info",
      title: "Confirm Order",
      message: (
        <Text>
          Your order total is{" "}
          <Text className="font-quicksand-semibold">{`$${discountedTotal}`}</Text>
          . Do you want to proceed?
        </Text>
      ),
      onConfirm: () => {
        // Place Order action
        console.log("Order placed:", {
          items,
          subtotal,
          deliveryFee,
          tax,
          total,
        });
        clearCart();
        showAlert({
          type: "success",
          title: "Order Placed! 🎉",
          message:
            "Your order has been placed successfully. You will receive a confirmation shortly.",
          onConfirm: () => router.push("/(tabs)/search"), // Navigate to home
          hideCancel: true,
        });
      },
    });
  };

  if (totalItems <= 0) {
    return null;
  }

  return (
    <View className="gap-4 rounded-lg  bg-white p-5" style={[styles.shadow]}>
      <Text className="h3-bold pb-0.5 ">PaymentSummary</Text>

      <SummaryRow
        title={`Total Items (${totalItems})`}
        value={`${totalPrice.toFixed(2)}`}
      />
      <SummaryRow title="Delivery Fee" value={`$5.00`} />
      <SummaryRow title="Discount" value={`5%`} valueClassName="text-success" />
      {/* <SummaryRow title="Delivery Fee" value={`$${deliveryFee.toFixed(2)}`} />
      <SummaryRow title="Discount" value={`${(discount * 100).toFixed(0)}%`} /> */}
      <View className="w-full border border-[#d6d6d6dc]"></View>
      <SummaryRow title="Total" value={`$${discountedTotal}`} />

      {/* Place Order button */}
      <Pressable
        onPress={handlePlaceOrder}
        className="mt-2 flex-row items-center justify-center gap-2 rounded-xl bg-primary py-4"
      >
        <Ionicons name="bag-check-outline" size={20} color="white" />
        <Text className="text-base font-bold text-white">
          Place Order - ${discountedTotal}
        </Text>
      </Pressable>
    </View>
  );
}

const SummaryRow = ({
  title,
  value,
  valueClassName,
}: {
  title: string;
  value: string;
  valueClassName?: string;
}) => {
  return (
    <View className="flex-between w-full flex-row">
      {/*title*/}
      <Text className=" paragraph-medium text-gray-100 ">{title}</Text>
      {/*value*/}
      <Text className={cn(" paragraph-bold", valueClassName)}>{value}</Text>
    </View>
  );
};
