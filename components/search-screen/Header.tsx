import { images } from "@/constants";
import { appWriteServices } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import CartButton from "../shared/CartButton";
import Category from "../shared/CategoryButton";
import SearchInput from "../shared/SearchInput";

export default function Header() {
  const router = useRouter();

  // Get current params from URL
  const searchParams = useLocalSearchParams<{
    category?: string;
    query?: string;
  }>();

  // Get categories from database
  const { data: categoriesData } = useAppwrite({
    fn: appWriteServices.getCategories,
  });

  // Track active category (local state)
  const [active, setActive] = useState<string | null>(
    searchParams.category || "",
  );

  /**
   * Sync local state with URL params
   * This ensures the active category updates when URL changes
   */
  useEffect(() => {
    setActive(searchParams.category || "");
  }, [searchParams.category]);

  /**
   * Handle category change
   * When user clicks a category filter
   *
   * @param categoryId - The ID of the selected category ("" for All)
   */
  const onCategoryChange = (categoryId: string) => {
    setActive(categoryId);

    if (categoryId === "") {
      // User clicked "All" - reset BOTH category and search query
      router.setParams({
        category: "", // Clear category filter
        query: "", // Clear search query
      });
    } else {
      // User clicked a specific category
      // CLEAR the search query to show all items in this category
      router.setParams({
        category: categoryId,
        query: "", // Clear search when filtering by category
      });
    }
  };

  /**
   * Handle search input
   * When user types in the search box
   *
   * @param query - The search text entered by user
   */
  const onSearch = (query: string) => {
    if (query.trim() === "") {
      // If search is cleared, remove the query param
      router.setParams({
        query: "", // This removes the query from URL
      });
    } else {
      // When user searches, CLEAR the category filter
      // This ensures search works across ALL categories
      router.setParams({
        query: query,
        category: "", // Reset to "All" when searching
      });

      // Update local state to show "All" is selected
      setActive("");
    }
  };

  // Create a combined list with "All" at the beginning
  const categoriesWithAll = [
    { $id: "all", name: "All" },
    
    ...(categoriesData || []),
  ];

  return (
    <View className="gap-7">
      {/* Header section with title and cart */}
      <View className="flex-between w-full flex-row">
        <View className="flex-col gap-1.5">
          <Text className="small-bold text-primary">SEARCH</Text>

          {/* Location dropdown */}
          <TouchableOpacity
            className="w-full flex-row items-center gap-1"
            onPress={() => {
              console.log("location");
            }}
          >
            <Text className="paragraph-bold">Find your favourite food</Text>
            <Image
              source={images.arrowDown}
              resizeMode="contain"
              className="h-3 w-3"
            />
          </TouchableOpacity>
        </View>

        {/* Cart button */}
        <CartButton />
      </View>

      {/* Search input */}
      <SearchInput
        onSearch={onSearch}
        // Pass current query as initial value so it shows in the input
        initialValue={searchParams.query || ""}
      />

      {/* Category filters */}
      <FlatList
        data={categoriesWithAll}
        keyExtractor={(item) => item.$id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-x-2 pb-3"
        renderItem={({ item }) => (
          <Category
            key={item.$id}
            name={item.name}
            // Highlight "All" when no category is selected
            isActive={
              active === item.$id || (active === "" && item.$id === "all")
            }
            // Pass empty string for "All", actual ID for categories
            onPress={() => onCategoryChange(item.$id === "all" ? "" : item.$id)}
          />
        )}
      />
    </View>
  );
}