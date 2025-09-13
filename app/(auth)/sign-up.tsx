import CustomButton from "@/components/shared/CustomButton";
import CustomInput from "@/components/shared/CustomInput";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Mock sign up logic
    setTimeout(() => {
      setIsLoading(false);
      router.push("/sign-in");
    }, 2000);
  };

  return (
    <ScrollView>
      <View className="flex flex-col gap-10">
        {/* fullname */}
        <CustomInput label="Fullname" placeholder="Enter your fullname" />
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
        {/* confirm password */}
        <CustomInput
          label="Confirm Password"
          placeholder="Confirm your password"
          secureTextEntry
        />
        <CustomButton
          title="Sign Up"
          onPress={handleSubmit}
          isLoading={isLoading}
        />
      </View>
      <Text className="pt-8 text-center text-gray-400">
        Already have an account?{" "}
        <Text
          onPress={() => {
            router.push("/sign-in");
          }}
          className="text-primary"
        >
          Sign In
        </Text>
      </Text>
    </ScrollView>
  );
}
