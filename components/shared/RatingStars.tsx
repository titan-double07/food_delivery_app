import { cn } from "@/lib/utils";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { View } from "react-native";

export default function RatingStars({ rating, className }: { rating: number; className?: string }) {
  // Round to nearest 0.5
  const rounded = Math.round(rating * 2) / 2;

  return (
    <View className="flex-row items-center gap-0">
      {Array.from({ length: 5 }).map((_, index) => {
        if (index + 1 <= Math.floor(rounded)) {
          return (
            <Ionicons // Use Ionicons
              key={index}
              name="star" // Use appropriate Ionicons name
              size={18} // Adjust size as needed
              color={colors.light.primary} // Adjust color as needed
              className={cn("", className)}
            />
          );
        } else if (index + 0.5 === rounded) {
          return (
            <Ionicons // Use Ionicons
              key={index}
              name="star-half" // Use appropriate Ionicons name
              size={18} // Adjust size as needed
              color={colors.light.primary} // Adjust color as needed
              className={cn("", className)}
            />
          );
        } else {
          return (
            <Ionicons // Use Ionicons
              key={index}
              name="star-outline" // Use appropriate Ionicons name
              size={18} // Adjust size as needed
              color={colors.light.primary} // Adjust color as needed
              className={cn("", className)}
            />
          );
        }
      })}
    </View>
  );
}