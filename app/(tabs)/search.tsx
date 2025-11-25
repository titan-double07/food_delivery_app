import Header from "@/components/search-screen/Header";
import MenuCard from "@/components/search-screen/MenuCard";
import { appWriteServices } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { cn } from "@/lib/utils";
import { colors } from "@/theme/colors";
import { MenuItemtype } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  // Get category and search query from URL params
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();

  // Get menu data with pagination support
  const {
    data: menuData, // Array of menu items
    loading, // Initial loading state (first load)
    error, // Error message if fetch fails
    refetch, // Function to refetch with new params
    refresh, // Function for pull-to-refresh
    refreshing, // Pull-to-refresh loading state
    loadMore, // Function to load more items (infinite scroll)
    loadingMore, // Loading state when fetching more items
    hasMore, // Boolean: are there more items to load?
  } = useAppwrite({
    fn: appWriteServices.getMenu,
    params: {
      category,
      query,
      limit: 10, // Load 10 items at a time
    },
  });

  // Refetch data whenever category or query changes
  useEffect(() => {
    // Always refetch when params change
    refetch({
      category: category || "",
      query: query || "",
      limit: 10,
    });
  }, [category, query]);
  /**
   * Show initial loading state
   * This displays when the app first loads or when doing a fresh search
   */
  if (loading && menuData?.length === 0) {
    return (
      <SafeAreaView className="page-padding my-[27px] flex-1 bg-white">
        <Header />
        <LoadingState />
      </SafeAreaView>
    );
  }

  /**
   * Show error state if something went wrong
   * Provides a retry button to try fetching again
   */
  if (error) {
    return (
      <SafeAreaView className="page-padding my-[27px] flex-1 bg-white">
        <Header />
        <ErrorState error={error} onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        // Header component at the top
        ListHeaderComponent={<Header />}
        // The data to display
        data={menuData}
        // Unique key for each item (required by FlatList)
        keyExtractor={(item) => item.$id}
        // Display items in 2 columns
        numColumns={2}
        // Styling
        columnWrapperClassName="gap-[30px]"
        ListHeaderComponentClassName="my-[27px]"
        contentContainerClassName="gap-5 page-padding"
        // Render each menu item
        renderItem={({ item, index }) => {
          // Alternate items between left (even) and right (odd) columns
          const isEven = index % 2 === 0;
          return (
            <View className={cn("max-w-[50%] flex-1", !isEven && "mt-16")}>
              <MenuCard item={item as unknown as MenuItemtype} />
            </View>
          );
        }}
        // Show when no items match the search
        ListEmptyComponent={<EmptyState />}
        // Footer component - shows loading indicator or "no more items" message
        ListFooterComponent={
          loadingMore ? (
            // Show loading spinner when fetching more items
            <View className="py-4">
              <ActivityIndicator size="small" color={colors.light.primary} />
              <Text className="mt-2 text-center text-sm text-gray-500">
                Loading more items...
              </Text>
            </View>
          ) : !hasMore && (menuData?.length ?? 0) > 0 ? (
            // Show "end of list" message when no more items to load
            <View className="py-4">
              <Text className="text-center text-sm text-gray-500">
                No more items to load
              </Text>
            </View>
          ) : null // Don't show anything if still has more items but not loading
        }
        ListFooterComponentClassName="mt-[27px]"
        /**
         * INFINITE SCROLL FEATURE
         * This triggers when user scrolls near the bottom
         */
        // onEndReached={loadMore} // Call loadMore function
        // onEndReachedThreshold={0.5} // Trigger when 50% from bottom (0.5 = half screen)
        /**
         * PULL TO REFRESH FEATURE
         * This allows users to pull down to refresh the list
         */
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Show/hide refresh indicator
            onRefresh={refresh} // Function to call when user pulls down
            tintColor="#FF6B6B" // Color of refresh indicator (iOS)
            colors={["#FF6B6B"]} // Color of refresh indicator (Android)
          />
        }
      />
    </SafeAreaView>
  );
}

/**
 * Loading State Component
 * Shows a spinner and message while initial data is loading
 */
const LoadingState = () => (
  <View className="flex-1 items-center justify-center">
    {/* Loading spinner */}
    <ActivityIndicator size="large" color={colors.light.primary} />

    {/* Loading message */}
    <Text className="mt-4 text-base text-gray-500">
      Loading delicious items...
    </Text>
  </View>
);

/**
 * Error State Component
 * Shows when something goes wrong with fetching data
 * @param error - Error message to display
 * @param onRetry - Function to call when user clicks retry button
 */
const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <View className="flex-1 items-center justify-center px-4">
    {/* Error icon */}
    <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />

    {/* Error title */}
    <Text className="mt-4 text-center text-lg font-semibold">
      Oops! Something went wrong
    </Text>

    {/* Error message */}
    <Text className="mt-2 text-center text-sm text-gray-500">{error}</Text>

    {/* Retry button */}
    <Pressable
      onPress={onRetry}
      className="mt-6 rounded-lg bg-primary px-6 py-3"
    >
      <Text className="font-semibold text-white">Try Again</Text>
    </Pressable>
  </View>
);

/**
 * Empty State Component
 * Shows when search returns no results
 */
const EmptyState = () => (
  <View className="flex-1 items-center justify-center">
    {/* Empty state illustration */}
    <Image
      source={require("@/assets/images/empty-state.png")}
      style={{ width: 200, height: 200, resizeMode: "contain" }}
    />

    {/* Empty state title */}
    <Text className="base-bold mt-4">Nothing matched your search</Text>

    {/* Empty state description */}
    <Text className="mt-4 text-center text-gray-500">
      Try a different search term or check for typos.
    </Text>
  </View>
);
