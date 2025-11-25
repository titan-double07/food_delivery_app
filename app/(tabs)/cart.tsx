import CartItem from '@/components/cart-screen/CartItem';
import Header from '@/components/cart-screen/Header';
import PaymentSummary from '@/components/cart-screen/PaymentSummary';
import { useCartStore } from '@/store/cart.store';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Cart() {
  const cartItems = useCartStore((state) => state.items);
  return (
    <SafeAreaView className=" flex-1 ">
      <FlatList
        ListHeaderComponentClassName="my-[27px]"
        ListHeaderComponent={<Header />}
        data={cartItems}
        keyExtractor={(item, index) => item.cartKey || `${item.id}_${index}`}
        renderItem={({ item }) => {
          return <CartItem item={item} />;
        }}
        contentContainerClassName="page-padding"
        ListEmptyComponent={<EmptyState />}
        ListFooterComponentClassName="mt-[27px]"
        ListFooterComponent={() => {
          return <PaymentSummary />;
        }}
      />
    </SafeAreaView>
  );

}


const EmptyState = () => (
  <View className="mt-20 flex-1 items-center justify-center">
    <Image
      source={require("@/assets/images/empty-state.png")}
      style={{ width: 200, height: 200, resizeMode: "contain" }}
    />
    <Text className="base-bold mt-4">Cart is empty</Text>

  </View>
);