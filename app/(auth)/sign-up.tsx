import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function SignUp() {
  return (
    <View>
      <Text>SignUp</Text>
      <View className="bg-primary size-5  py-2 px-4 rounded">
        <TouchableOpacity
          onPress={() => {
            router.push("/sign-in");
          }}>
          <Text> go to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
