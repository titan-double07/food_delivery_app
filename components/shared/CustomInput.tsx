import { View, Text, TextInput, TextInputProps } from "react-native";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export type CustomInputProps = TextInputProps & {
  label: string;
  error?: string;
};

export default function CustomInput({
  label,
  className,
  error,
  ...props // capture all other TextInput props
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full">
      <Text className="mb-2 text-gray-400">{label}</Text>
      <TextInput
        {...props}
        autoCorrect={props.autoCorrect || false}
        placeholderTextColor={"#888"}
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
          isFocused ? "border-primary" : "border-gray-300",
          className,
        )}
      />
      {error ? <Text className="text-red-500">{error}</Text> : null}
    </View>
  );
}