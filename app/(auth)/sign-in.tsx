import CustomButton from "@/components/shared/CustomButton";
import CustomInput from "@/components/shared/CustomInput";
import CustomPasswordInput from "@/components/shared/CustomPasswordInput";
import { appWriteServices } from "@/lib/appwrite";
import { useAuthStore } from "@/store/auth.store";
import { showAlert } from "@/utils/alert";
import { showToast } from "@/utils/toast";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    // Use Toast for quick validation feedback
    if (!form.email || !form.password) {
      showToast("error", "Missing Fields", "Please fill in all the fields.");
      return;
    }

    setIsLoading(true);
    try {
      const user = await appWriteServices.signInUser(form.email, form.password);

      if (user) {
        const currentUser = await appWriteServices.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }

        // Use Toast for success - quick, non-blocking
        showToast("success", "Success", "Signed in successfully! 🎉");

        setTimeout(() => router.replace("/(tabs)"), 1000);
      } else {
        // Use Alert for critical errors - requires acknowledgment
        showAlert(
          "error",
          "Sign In Failed",
          "Failed to sign in. Please try again.",
        );
      }
    } catch (error: any) {
      // Use Alert for detailed error messages - user needs to read full message
      showAlert(
        "error",
        "Sign In Failed",
        error.message || "Failed to sign in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <View>
        <View className="gap-8">
          <CustomInput
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, email: text }))
            }
          />
          <CustomPasswordInput
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, password: text }))
            }
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
      </View>
    </>
  );
}
