import { cn } from "@/lib/utils"; // assuming you're using a cn helper
import React from "react";
import {
    ActivityIndicator,
    Pressable,
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
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={cn(
        "custom-btn",
        variant === "outline" && "bg-transparent border border-primary gap-2",
        isLoading && "opacity-50",
        className,
      )}
      
    >
      {/* Left Icon */}
      {leftIcon && <View className="">{leftIcon}</View>}

      {/* Button Content */}
      <View className="items-center justify-center">
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
    </Pressable>
  );
}
