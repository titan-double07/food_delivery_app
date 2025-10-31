import CartItem from '@/components/cart-screen/CartItem';
import Header from '@/components/cart-screen/Header';
import { useCartStore } from '@/store/cart.store';
import React from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Cart() {
  const cartItems = useCartStore((state) => state.items);
  console.log("🚀 ~ Cart ~ cartItems:", cartItems)
  return (
    <SafeAreaView className="page-padding flex-1 bg-white">
      <FlatList
        ListHeaderComponent={<Header />}
        ListHeaderComponentClassName="my-[27px]"
        data={cartItems}
        renderItem={({ item }) => {
          return (
           <CartItem item={item}/>
          );
        }
        }
        ListEmptyComponent={() => (     
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-gray-500 text-lg">Your cart is empty</Text>
          </View>
        )}

      />
    </SafeAreaView>
  );
}