import React from "react";
import { TextInput, View, TouchableOpacity, Image } from "react-native";
import { images } from "@/constants"; // Assuming you have an images constant

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
        <Image
          source={images.search} // Replace with your search icon
          resizeMode="contain"
          className="h-5 w-5"
        />
      </TouchableOpacity>
    </View>
  );
}
// box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
