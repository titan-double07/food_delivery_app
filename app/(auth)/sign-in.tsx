import CustomButton from "@/components/shared/CustomButton";
import CustomInput from "@/components/shared/CustomInput";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Mock sign up logic
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 2000);
  };

  return (
    <ScrollView>
      <View className="flex flex-col gap-10">
        {/* email */}
        <CustomInput
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        {/* password */}
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
        />

        <CustomButton
          title="Sign In"
          onPress={handleSubmit}
          isLoading={isLoading}
        />
      </View>

      <Text className="pt-8 text-center text-gray-400">
        Don&apos;t have an account?{" "}
        <Text
          onPress={() => {
            router.push("/sign-up");
          }}
          className="text-primary"
        >
          Sign Up
        </Text>
      </Text>
    </ScrollView>
  );
}
