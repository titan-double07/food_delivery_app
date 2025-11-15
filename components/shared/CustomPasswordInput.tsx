import { View, Text, TextInput, TextInputProps, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { CustomInputProps } from "./CustomInput";

export type CustomPasswordInputProps = CustomInputProps & {
  // Any additional props specific to CustomPasswordInput can be added here
  error?: string;
};

export default function CustomPasswordInput({
  label,
  className,
  error,
 ...props
}: CustomPasswordInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    console.log("🚀 ~ CustomPasswordInput ~ isPasswordVisible:", isPasswordVisible)
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className="w-full">
      <Text className="mb-2 text-gray-400">{label}</Text>
      <View className="relative">
        <TextInput
          {...props}
          autoCorrect={false} // Disable autocorrect for password inputs
          placeholderTextColor={"#888"}
          secureTextEntry={!isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e); // call user’s onFocus if provided
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e); // call user’s onBlur if provided
          }}
          className={cn(
            "input", // your base input styles
            isFocused? "border-primary" : "border-gray-300",
            className,
            "pr-10", // Add padding to accommodate the eye icon
          )}
        />
        <TouchableOpacity
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onPress={togglePasswordVisibility}
        >
          <Ionicons
            name={isPasswordVisible? "eye-outline" : "eye-off-outline"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
       {error ? <Text className="text-red-500">{error}</Text> : null}
    </View>
  );
}