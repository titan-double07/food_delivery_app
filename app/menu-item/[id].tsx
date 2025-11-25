import BackandSearchBtnHeader from "@/components/shared/BackandSearchBtnHeader";
import RatingStars from "@/components/shared/RatingStars";
import { sides, toppings } from "@/constants";
import { appWriteServices } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useCartStore } from "@/store/cart.store";
import { colors } from "@/theme/colors";
import { CartCustomization, CustomizationOption } from "@/type";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function MenuItem() {
  // Get menu item ID from URL params
  const { id } = useLocalSearchParams<{ id: string }>();

  console.log("🚀 ~ MenuItem ~ id:", id);

  const { data: menuItem, loading } = useAppwrite({
    fn: appWriteServices.getMenuItemById,
    params: {
      itemId: id,
    },
  });

  // Local state to track selected customizations
  const [selectedCustomizations, setSelectedCustomizations] = useState<
    CartCustomization[]
  >([]);

  // Local state to track quantity (for this specific configuration)
  const [quantity, setQuantity] = useState(1);

  // Get addItem function from cart store
  const addItem = useCartStore((state) => state.addItem);

  /**
   * Calculate total price
   * Base price + all customization prices × quantity
   */
  const totalPrice = useMemo(() => {
    if (!menuItem) return 0;

    // Start with base item price
    const basePrice = menuItem.price;

    // Add all customization prices
    const customizationsPrice = selectedCustomizations.reduce(
      (sum, custom) => sum + custom.price,
      0,
    );

    // Multiply by quantity
    return (basePrice + customizationsPrice) * quantity;
  }, [menuItem, selectedCustomizations, quantity]);

  /**
   * Handle selecting/deselecting a customization
   * @param option - The customization option clicked
   */
  const toggleCustomization = (option: CustomizationOption) => {
    setSelectedCustomizations((prev) => {
      // Check if this customization is already selected
      const isSelected = prev.some((c) => c.id === option.id);

      if (isSelected) {
        // Remove it (deselect)
        return prev.filter((c) => c.id !== option.id);
      } else {
        // Add it (select)
        return [
          ...prev,
          {
            id: option.id,
            name: option.name,
            price: option.price,
            type: option.type,
          },
        ];
      }
    });
  };

  /**
   * Check if a customization is currently selected
   * @param id - The customization ID to check
   */
  const isCustomizationSelected = (id: string): boolean => {
    return selectedCustomizations.some((c) => c.id === id);
  };

  /**
   * Increase quantity
   */
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  /**
   * Decrease quantity (minimum 1)
   */
  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  /**
   * Add item to cart with selected customizations
   */
  const handleAddToCart = () => {
    if (!menuItem) return;

    // Create cart item with customizations
    const cartItem = {
      id: menuItem.$id,
      name: menuItem.name,
      price: menuItem.price, // Base price only
      image_url: menuItem.image_url,
      customizations: selectedCustomizations,
    };

    // Add to cart (quantity times)
    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }

    // Navigate back to search/home
    router.back();
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.light.primary} />
        <Text className="mt-4 text-gray-500">Loading menu item...</Text>
      </SafeAreaView>
    );
  }

  // Show error state if no data
  if (!menuItem) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Item not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header with back button */}
        <View className="my-[27px]">
          <BackandSearchBtnHeader />
        </View>

        {/* Item details section */}
        <View className="gap-5">
          {/* Store name */}
          <Text className="h1-bold text-2xl">{`Sommy's Treats`}</Text>

          {/* Item name */}
          <Text className="paragraph-medium text-gray-500">
            {menuItem.name}
          </Text>

          {/* Rating */}
          <View className="flex-row items-center gap-1">
            <RatingStars rating={menuItem.rating || 0} />
            <Text className="paragraph-bold text-primary">
              {menuItem.rating}
            </Text>
          </View>

          {/* Base price (will update to total price later) */}
          <Text className="font-quicksand-bold text-2xl text-primary">
            ${menuItem.price.toFixed(2)}
          </Text>

          {/* Nutritional info */}
          <View className="flex-row items-center gap-5">
            <View className="items-center gap-0.5">
              <Text className="body-medium text-gray-500">Calories</Text>
              <Text className="base-semibold">{menuItem.calories} Cal</Text>
            </View>
            <View className="gap-0.5">
              <Text className="body-medium text-gray-500">Protein</Text>
              <Text className="base-bold">{menuItem.protein}g</Text>
            </View>
          </View>

          {/* Type */}
          <View>
            <Text className="body-medium text-gray-500">Bun Type</Text>
            <Text className="base-semibold">Whole Wheat</Text>
          </View>

          {/* Item image */}
          <Image
            source={{ uri: menuItem.image_url }}
            resizeMode="contain"
            style={{
              width: 300,
              height: 250,
              position: "absolute",
              right: "-28%",
            }}
          />
        </View>

        {/* Delivery info and description */}
        <View className="mb-5 gap-4" style={styles.descriptionContainer}>
          {/* Delivery info card */}
          <View className="mt-5 flex-row items-center justify-center gap-5 rounded bg-primary/10 p-3">
            <View className="flex-row items-center gap-2">
              <FontAwesome
                name="dollar"
                size={14}
                color={colors.light.primary}
              />
              <Text className="font-quicksand-medium text-sm">
                Free Delivery
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="time" size={14} color={colors.light.primary} />
              <Text className="font-quicksand-medium text-sm">
                20 - 30 mins
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="star" size={14} color={colors.light.primary} />
              <Text className="font-quicksand-medium text-sm">4.5</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="leading-loose text-gray-500">
            {menuItem.description || "A delicious item from our menu"}
          </Text>
        </View>

        {/* Customizations section */}
        <View className="gap-7">
          {/* Toppings */}
          <View className="gap-4">
            <Text className="paragraph-bold">
              Toppings
              {selectedCustomizations.filter((c) => c.type === "topping")
                .length > 0 && (
                <Text className="text-primary">
                  {" "}
                  (
                  {
                    selectedCustomizations.filter((c) => c.type === "topping")
                      .length
                  }{" "}
                  selected)
                </Text>
              )}
            </Text>
            <FlatList
              data={toppings}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-8"
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CustomizationCard
                  item={item}
                  isSelected={isCustomizationSelected(item.id)}
                  onPress={() => toggleCustomization(item)}
                />
              )}
            />
          </View>

          {/* Sides */}
          <View className="gap-4">
            <Text className="paragraph-bold">
              Side options
              {selectedCustomizations.filter((c) => c.type === "side").length >
                0 && (
                <Text className="text-primary">
                  {" "}
                  (
                  {
                    selectedCustomizations.filter((c) => c.type === "side")
                      .length
                  }{" "}
                  selected)
                </Text>
              )}
            </Text>
            <FlatList
              data={sides}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-8"
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CustomizationCard
                  item={item}
                  isSelected={isCustomizationSelected(item.id)}
                  onPress={() => toggleCustomization(item)}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom cart bar */}
      <AddToCartBar
        quantity={quantity}
        totalPrice={totalPrice}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onAddToCart={handleAddToCart}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    marginTop: 10,
  },
});

/**
 * Customization Card Component
 * Shows a single customization option (topping or side)
 * Displays selected state and handles toggle
 */
type CustomizationCardProps = {
  item: CustomizationOption;
  isSelected: boolean;
  onPress: () => void;
};

const CustomizationCard = ({
  item,
  isSelected,
  onPress,
}: CustomizationCardProps) => {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`w-[80px] items-center rounded-lg p-0 ${
          isSelected ? "bg-primary" : "bg-[#3c2f2f]"
        }`}
      >
        {/* Image container */}
        <View className="h-[51px] w-full items-center justify-center rounded-lg bg-white">
          <Image
            source={item.image as ImageSourcePropType}
            style={{ width: 55, height: 45 }}
            resizeMode="contain"
          />
        </View>

        {/* Name and action icon */}
        <View className="items-center gap-1.5 px-1.5 py-2">
          <Text
            className="text-center text-xs text-white"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <Text className="text-xs font-bold text-white">
            +${item.price.toFixed(2)}
          </Text>
          <Ionicons
            name={isSelected ? "checkmark-circle" : "add-circle"}
            size={16}
            color={isSelected ? "white" : "red"}
          />
        </View>
      </View>
    </Pressable>
  );
};

/**
 * Add to Cart Bar Component
 * Fixed bottom bar with quantity controls and add to cart button
 */
type AddToCartBarProps = {
  quantity: number;
  totalPrice: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onAddToCart: () => void;
};

const AddToCartBar = ({
  quantity,
  totalPrice,
  onIncrease,
  onDecrease,
  onAddToCart,
}: AddToCartBarProps) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 mx-5 mb-4 flex-row justify-between rounded-xl bg-white px-4 py-4 shadow-lg">
      {/* Quantity controls */}
      <View className="flex-row items-center gap-4">
        <Pressable onPress={onDecrease} className="cart-item__actions ">
          <Ionicons
            name="remove-outline"
            size={20}
            color={colors.light.primary}
          />
        </Pressable>

        <Text className="base-bold min-w-[20px] text-center text-dark-100">
          {quantity}
        </Text>

        <Pressable onPress={onIncrease} className=" cart-item__actions">
          <Ionicons name="add-outline" size={20} color={colors.light.primary} />
        </Pressable>
      </View>

      {/* Add to cart button */}
      <Pressable
        onPress={onAddToCart}
        className="flex-row items-center gap-2 rounded-full bg-primary px-5 py-3"
      >
        <Ionicons name="bag-handle-outline" size={16} color="white" />
        <Text className="font-quicksand-bold text-base text-white">
          Add (${totalPrice.toFixed(2)})
        </Text>
      </Pressable>
    </View>
  );
};