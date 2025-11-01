import CartItem from '@/components/cart-screen/CartItem';
import Header from '@/components/cart-screen/Header';
import PaymentSummary from '@/components/cart-screen/PaymentSummary';
import { useCartStore } from '@/store/cart.store';
import React from 'react'
import { FlatList, Image, Platform, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Cart() {
  const cartItems = useCartStore((state) => state.items);
  return (
    <SafeAreaView className=" flex-1 ">
      <FlatList
        ListHeaderComponentClassName="my-[27px]"
        ListHeaderComponent={<Header />}
        data={cartItems}
        renderItem={({ item }) => {
          return <CartItem item={item} />;
        }}
        contentContainerClassName="page-padding"
        ListEmptyComponent={() => (
          <View className="mt-20 flex-1 items-center justify-center">
            <Text className="text-lg text-gray-500">Your cart is empty</Text>
          </View>
        )}
        ListFooterComponentClassName="mt-[27px]"
        ListFooterComponent={() => {
          return <PaymentSummary />;
        }}
      />
    </SafeAreaView>
  );

}

export const styles = StyleSheet.create({
  shadow:
    Platform.OS === "android"
      ? { elevation: 5, shadowColor: "#878787" }
      : {
          shadowColor: "#878787",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
});