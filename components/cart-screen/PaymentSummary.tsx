import { cn } from "@/lib/utils";
import { useAlertStore } from "@/store/alert-store";
import { useCartStore } from "@/store/cart.store";
import useDeliveryStore from "@/store/delivery.store";
import { styles } from "@/styles/cart-style";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function PaymentSummary() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore(
    (state) => state,
  );
  const { address } = useDeliveryStore();
  const { showAlert } = useAlertStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 5.0 : 0;
  const discount = 5 / 100;
  const discountedTotal = (
    totalPrice +
    deliveryFee -
    totalPrice * discount
  ).toFixed(2);

  /**
   * Handle order placement
   */
  const handlePlaceOrder = () => {
    // Check if cart is empty
    if (items.length === 0) {
      showAlert({
        type: "info",
        title: "Empty Cart",
        message: "Please add items to your cart before placing an order",
      });
      return;
    }

    // Check if address is set
    if (!address) {
      showAlert({
        type: "info",
        title: "Delivery Address Required",
        message: "Please set your delivery address to continue",
        onConfirm: () => router.push("/(checkout)/delivery-address"),
      });
      return;
    }

    // Show final confirmation with full details
    showAlert({
      type: "info",
      title: "Confirm Order",
      message: `Deliver to:\n${address.fullAddress || `${address.street}, ${address.city}`}\n\nTotal: $${discountedTotal}`,
     
      onConfirm: () => {
        // Place the order
        console.log("Order placed:", {
          items,
          address,
          subtotal,
          deliveryFee,
          discount,
          total: discountedTotal,
          orderTime: new Date().toISOString(),
        });

        clearCart();

        showAlert({
          type: "success",
          title: "Order Placed! 🎉",
          message:
            "Your order has been confirmed and will be delivered in 30-45 minutes",
          hideCancel: true,
          onConfirm: () => router.push("/(tabs)/search"),
        });
      },
    });
  };

  if (totalItems <= 0) {
    return null;
  }

  return (
    <View className="gap-4 rounded-lg bg-white p-5" style={[styles.shadow]}>
      <Text className="h3-bold pb-0.5">Payment Summary</Text>

      {/* Delivery Address Section */}
      {address ? (
        <View className="mb-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-2">
              <View className="mb-1 flex-row items-center gap-1">
                <Ionicons name="location" size={14} color="#22C55E" />
                <Text className="text-xs font-medium text-gray-600">
                  Delivering to:
                </Text>
              </View>
              <Text
                className="paragraph-medium text-gray-900"
                numberOfLines={2}
              >
                {address.fullAddress || `${address.street}, ${address.city}`}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/(checkout)/delivery-address")}
              className="rounded-lg bg-primary/10 p-2"
            >
              <Ionicons name="pencil" size={16} color="#FF6B35" />
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => router.push("/(checkout)/delivery-address")}
          className="mb-2 flex-row items-center justify-between rounded-lg border border-dashed border-primary bg-primary/5 p-3"
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="location-outline" size={20} color="#FF6B35" />
            <Text className="paragraph-medium text-primary">
              Add delivery address
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FF6B35" />
        </Pressable>
      )}

      <SummaryRow
        title={`Total Items (${totalItems})`}
        value={`$${totalPrice.toFixed(2)}`}
      />
      <SummaryRow title="Delivery Fee" value="$5.00" />
      <SummaryRow title="Discount" value="5%" valueClassName="text-success" />
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
      <Text className="paragraph-medium text-gray-100">{title}</Text>
      <Text className={cn("paragraph-bold", valueClassName)}>{value}</Text>
    </View>
  );
};
