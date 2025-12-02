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

export const signUpSchema = z
  .object({
    fullname: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setIsAuthenticated } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const user = await appWriteServices.createUser({
        email: data.email,
        name: data.fullname,
        password: data.password,
      });
      console.log("🚀 ~ onSubmit ~ user:", user);

      if (!user) throw new Error("Failed to create user");

      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      }

      showToast("success", "Success", "Account created successfully!");
      // setTimeout(() => router.replace("/sign-in"), 1500);
    } catch (error: any) {
      showAlert({
        type: "error",
        title: "Sign Up Failed",
        message: error.message,
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
      }}
      className=" w-full flex-1  rounded-t-[30px] bg-white p-[30px] pt-[70px] shadow-lg shadow-black"
    >
      <View className=" gap-8">
        {/* fullname */}
        <Controller
          control={control}
          name="fullname"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Full Name"
              placeholder="Enter your full name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.fullname?.message}
            />
          )}
        />
        {/* email */}
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

        {/* password */}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomPasswordInput
              label="Password"
              placeholder="Enter your password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
          name="password"
        />
        {/* confirm password */}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomPasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.confirmPassword?.message}
            />
          )}
          name="confirmPassword"
        />
        <CustomButton
          title="Sign Up"
          onPress={handleSubmit(onSubmit)}
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
    </View>
  );
}
