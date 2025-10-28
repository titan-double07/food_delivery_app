import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [searchText, setSearchText] = React.useState("");

  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    <View className="w-full flex-row items-center rounded-full border border-gray-300 bg-white px-5 py-2 shadow-[0_0_20px_0px_rgba(0,0,0,0.1)] shadow-black/50 ">
      <TextInput
        className="flex-1 p-2"
        placeholder="Search for any food"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch} // Trigger search on pressing Enter
      />
      <TouchableOpacity className="p-2" onPress={handleSearch}>
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
// box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
