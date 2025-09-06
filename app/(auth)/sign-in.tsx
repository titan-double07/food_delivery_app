import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

export default function Signin() {
  return (
    <View>
      <Text>Signin</Text>
      <TouchableOpacity className='bg-primary py-2 px-4 rounded'
      onPress={() => { router.push('/sign-up')}}>
        <Text> go to Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
}