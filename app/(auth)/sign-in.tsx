import CustomButton from "@/components/shared/CustomButton";
import CustomInput from "@/components/shared/CustomInput";
import CustomPasswordInput from "@/components/shared/CustomPasswordInput";
import { appWriteServices } from "@/lib/appwrite";
import { useAuthStore } from "@/store/auth.store";
import { showAlert } from "@/utils/alert";
import { showToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setIsAuthenticated } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const user = await appWriteServices.signInUser(data.email, data.password);

      if (user) {
        const currentUser = await appWriteServices.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }

        showToast("success", "Success", "Signed in successfully! 🎉");

        setTimeout(() => router.replace("/(tabs)"), 1000);
      } else {
        showAlert({
          type: "error",
          title: "Sign In Failed",
          message: "Failed to sign in. Please try again.",
        });
      }
    } catch (error: any) {
      showAlert({
        type: "error",
        title: "Sign In Failed",
        message: error.message || "Failed to sign in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        // zIndex: 10,
      }}
      className=" h-[58%] w-full flex-1  rounded-t-[30px] bg-white p-[30px] pt-[82px] shadow-lg shadow-black"
    >
      <View>
        <View className="gap-8">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomPasswordInput
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <CustomButton
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
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
    </View>
  );
}
