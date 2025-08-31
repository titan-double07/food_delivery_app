import { images } from '@/constants'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function Header() {
    return (
        <View className=' flex-between'>
            {/* location dropdown */}
            <View className='flex-col flex'>

            </View>
            {/* cart */}
            <Cart />
        </View>
    )
}

const Cart = () => {
    const numOfOrders = 0
    return (
        <TouchableOpacity className='cart-btn'>
            {/*  */}
            {/* <Text>Cart</Text> */}
            {/* cart icon */}
            <Image source={images.bag} resizeMode='contain' className='object-contain size-[20px]' />

        </TouchableOpacity>
    )
}