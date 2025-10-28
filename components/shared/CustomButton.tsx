import { cn } from "@/lib/utils"; // assuming you're using a cn helper
import React from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { ClassNameValue } from "tailwind-merge";

// Define props
interface CustomButtonProps {
  onPress: () => void;
  title: string;
  className?: ClassNameValue;
  leftIcon?: React.ReactNode;
  textClassName?: ClassNameValue;
  isLoading?: boolean;
  variant?: "outline" | "filled";
}

export default function CustomButton({
  onPress,
  title,
  className,
  leftIcon,
  textClassName,
  variant = "filled",
  isLoading = false,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className={cn(
        "custom-btn",
        variant === "outline" && "bg-transparent border border-primary",
        className,
        isLoading && "opacity-50",
      )}
    >
      {/* Left Icon */}
      {leftIcon && <View className="mr-2">{leftIcon}</View>}

      {/* Button Content */}
      <View className="flex-1 items-center justify-center">
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text
              className={cn("paragraph-semibold text-white-100",
                variant === "outline" && "text-primary",
                textClassName)}
          >
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
