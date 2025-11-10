import CustomButton from "@/components/shared/CustomButton";
import CustomInput from "@/components/shared/CustomInput";
import { appWriteServices } from "@/lib/appwrite";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async () => {
    //  if no data throw error
    if (
      !form.fullname ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      return Alert.alert("Error", "Please fill all the fields");
    }
    setIsLoading(true);
    // if passwords dont match throw error
    if (form.password !== form.confirmPassword) {
      setIsLoading(false);
      return Alert.alert("Error", "Passwords do not match");
    }

    console.log("🚀 ~ form:", form);
    try {
      // sign up user
      const user = await appWriteServices.createUser({
        email: form.email,
        name: form.fullname,
        password: form.password,
      });
      console.log("🚀 ~ user:", user);
      setIsLoading(false);
      Alert.alert("Success", "User created successfully");
      // navigate to sign in page
      router.replace("/");
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className=" gap-8">
        {/* fullname */}
        <CustomInput
          label="Fullname"
          placeholder="Enter your fullname"
          value={form.fullname}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, fullname: text }))
          }
        />
        {/* email */}
        <CustomInput
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        />
        {/* password */}
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={form.password}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, password: text }))
          }
        />
        {/* confirm password */}
        <CustomInput
          label="Confirm Password"
          placeholder="Confirm your password"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, confirmPassword: text }))
          }
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
