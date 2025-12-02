import React from "react";
import { Text, Pressable, View } from "react-native";
import BackandSearchBtnHeader from "../shared/BackandSearchBtnHeader";
import CustomButton from "../shared/CustomButton";
import { useCartStore } from "@/store/cart.store";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

export default function Header() {
  return (
    <View>
      <View className="gap-[25px]">
        <BackandSearchBtnHeader />
        <View className=" flex-between w-full flex-row">
          <View className="flex-col gap-1.5">
            <Text className="small-bold text-primary">Delivery location</Text>
            {/* delivery location */}
            <Pressable
              className="w-full flex-row items-center  gap-1 "
              onPress={() => {
                console.log("location");
              }}
            >
              <Text className=" paragraph-bold">Home</Text>
            </Pressable>
          </View>
          {/* cart */}
          <CustomButton
            variant="outline"
            title="Change Location"
            onPress={() => {}}
            className="w-[130px] "
            textClassName="text-xs"
          />
        </View>
      </View>
      <CartActionHeader />
    </View>
  );
}

const CartActionHeader = () => {
  const {
    items,
    selectedItems,
    selectAllItems,
    deselectAllItems,
    removeSelectedItems,
    getSelectedItemsCount,
  } = useCartStore();

  // Check if all items are selected
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const selectedCount = getSelectedItemsCount();

  /**
   * Toggle select all / deselect all
   */
  const handleToggleAll = () => {
    if (allSelected) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  };

  return (
    <View className="flex-row items-center justify-between">
      {/* Title and selection info */}
      <View>
        {selectedCount > 0 ? (
          <Text className="text-sm text-gray-500">
            {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
          </Text>
        ) : (
          <Text className="text-sm text-gray-500">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View className="flex-row gap-3">
        {/* Select All / Deselect All */}
        {items.length > 0 && (
          <Pressable
            onPress={handleToggleAll}
            className="flex-row items-center gap-2 rounded-lg  px-3 py-2"
          >
            <Ionicons
              name={allSelected ? "checkbox" : "square-outline"}
              size={20}
              color={colors.light.primary}
            />
            <Text className="text-sm font-semibold">
              {allSelected ? "Deselect All" : "Select All"}
            </Text>
          </Pressable>
        )}

        {/* Delete Selected (only show if items are selected) */}
        {selectedCount > 0 && (
          <Pressable
            onPress={removeSelectedItems}
            className="flex-row items-center gap-2 rounded-lg bg-red-50 px-3 py-2"
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={colors.light.error}
            />
            <Text className="text-sm font-semibold text-red-600">
              Delete ({selectedCount})
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
