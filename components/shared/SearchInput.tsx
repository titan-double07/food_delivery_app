import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchInputProps {
  onSearch: (query: string) => void;
  initialValue?: string; // Add this prop
}

export default function SearchInput({
  onSearch,
  initialValue = "",
}: SearchInputProps) {
  // Local state for the input value
  const [searchQuery, setSearchQuery] = useState(initialValue);

  /**
   * Update local state when initialValue changes
   * This happens when URL params change (e.g., clicking "All")
   */
  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  /**
   * Handle search submission
   * Called when user presses the search button or Enter key
   */
  const handleSearch = () => {
    onSearch(searchQuery.trim());
  };

  /**
   * Handle clearing the search
   * Called when user clicks the X button
   */
  const handleClear = () => {
    setSearchQuery(""); // Clear local state
    onSearch(""); // Clear search in parent component
  };

  return (
    <View className="w-full flex-row items-center rounded-full border border-gray-300 bg-white px-5 py-2 shadow-[0_0_20px_0px_rgba(0,0,0,0.1)] shadow-black/50 ">
      {/* Search icon on the left */}
      {/* <Ionicons name="search" size={20} color="#999" className="p-2" /> */}

      {/* Search text input */}
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for food..."
        className="flex-1 p-2"
        onSubmitEditing={handleSearch} // Search when user presses Enter
        returnKeyType="search"
      />

      {/* Clear button (only show when there's text) */}
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={handleClear} className="p-2">
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}

      {/* Search button (only show when there's text and it's different from initial) */}
      {searchQuery.length > 0 && searchQuery !== initialValue && (
        <TouchableOpacity className="p-2" onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#999"  />
        </TouchableOpacity>
      )}
    </View>
  );
}
// box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
