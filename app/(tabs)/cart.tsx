import Header from '@/components/cart-screen/Header';
import React from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Cart() {
  return (
    <SafeAreaView className="page-padding flex-1 bg-white">
      <FlatList
        ListHeaderComponent={<Header />}
        ListHeaderComponentClassName="my-[27px]"
        data={[]}
        renderItem={({ item }) => {
          return (
            <View className="cart-item">
              <Text className="text-lg text-gray-500">cart items</Text>
            </View>
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