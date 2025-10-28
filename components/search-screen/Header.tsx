import Cart from "@/app/(tabs)/cart";
import { images } from "@/constants";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CartButton from "../shared/CartButton";
import SearchInput from "../shared/SearchInput";
import Category from "../shared/CategoryButton";
import useAppwrite from "@/lib/useAppwrite";
import { appWriteServices } from "@/lib/appwrite";
import { cn } from "@/lib/utils";
type HeaderProps = {
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  selectedCategory: string;
};
export default function Header({
  onCategoryChange,
  onSearch,
  selectedCategory,
}: HeaderProps) {
  // get categories
  const { data: categoriesData } = useAppwrite({
    fn: appWriteServices.getCategories,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery]);

  return (
    <View className="gap-7">
      <View className=" flex-between w-full flex-row">
        <View className="flex-col gap-1.5">
          <Text className="small-bold text-primary">SEARCH</Text>
          {/* location dropdown */}
          <TouchableOpacity
            className="w-full flex-row items-center  gap-1 "
            onPress={() => {
              console.log("location");
            }}
          >
            <Text className=" paragraph-bold">Find your favourite food</Text>
            <Image
              source={images.arrowDown}
              resizeMode="contain"
              className=" h-3 w-3 "
            />
          </TouchableOpacity>
        </View>
        {/* cart */}
        <CartButton />
      </View>
      {/* search input */}
      <SearchInput onSearch={handleSearchInputChange} />

      {/* categories */}
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className=""
      >
        <View className=" flex-row gap-3  px-5">
          <Category
            name="All"
            isActive={selectedCategory === ""}
            onPress={() => onCategoryChange("")}
          />
          {categoriesData?.map((category) => (
            <Category
              key={category.$id}
              name={category.name}
              isActive={selectedCategory === category.$id}
              onPress={() => onCategoryChange(category.$id)}
            />
          ))}
        </View>
      </ScrollView> */}
      <FlatList
        data={categoriesData}
        keyExtractor={(item) => item.$id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-x-2 pb-3"
        renderItem={({ item }) => (
          <View key={item.$id} className=" flex-row gap-3  px-5">
            <Category
              name="All"
              isActive={selectedCategory === ""}
              onPress={() => onCategoryChange("")}
            />
            {categoriesData?.map((category) => (
              <Category
                key={category.$id}
                name={category.name}
                isActive={selectedCategory === category.$id}
                onPress={() => onCategoryChange(category.$id)}
              />
            ))}
          </View>
          // <TouchableOpacity
          //   key={item.$id}
          //   className={cn("filter")}
          //   style={
          //     Platform.OS === "android"
          //       ? { elevation: 5, shadowColor: "#878787" }
          //       : {}
          //   }
          //   // onPress={() => handlePress(item.$id)}
          // >
          //   <Text className={cn("body-medium")}>{item.name}</Text>
          // </TouchableOpacity>
        )}
      />
    </View>
  );
}
