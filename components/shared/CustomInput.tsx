import { View, Text, TextInput, TextInputProps } from "react-native";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

export type CustomInputProps = TextInputProps & {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function CustomInput({
  label,
  className,
  error,
  icon,
  ...props // capture all other TextInput props
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full">
      <Text className="mb-2 text-gray-400">{label}</Text>
      <View
        className={cn(
          "input flex-row items-center gap-3 border-gray-300 ",
          isFocused ? "border-primary" : "border-gray-300",
        )}
      >
        <Ionicons name={icon} size={20} color={isFocused ? colors.light.primary : "#9CA3AF"}/>

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
            "w-full", // your base input styles
            className,
          )}
        />
      </View>
      {error ? <Text className="text-red-500">{error}</Text> : null}
    </View>
  );
}
