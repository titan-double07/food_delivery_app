import CustomButton from "@/components/shared/CustomButton";
import CustomInput from "@/components/shared/CustomInput";
import { appWriteServices } from "@/lib/appwrite";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    console.log("🚀 ~ form:", form);
    if (!form.email || !form.password)
      return Alert.alert("Error", "Please fill all the fields");

    setIsLoading(true);
    try {
      // sign in user
      const user = await appWriteServices.signInUser(form.email, form.password);
      console.log("🚀 ~ user:", user);
      setIsLoading(false);
      Alert.alert("Success", "User signed in successfully");
      // navigate to home page
      router.replace("/");
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView>
      <View className="flex flex-col gap-10">
        {/* email */}
        <CustomInput
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => setForm(prev=> ({...prev, email:text}))}
        />
        {/* password */}
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => setForm(prev=> ({...prev, password:text}))}
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
