import Header from "@/components/search-screen/Header";
import MenuCard from "@/components/search-screen/MenuCard";
import { appWriteServices } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/type";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
     const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // get menu
  const {
    data: menuData,
    loading,
    error,
    refetch,
  } = useAppwrite({
    fn: appWriteServices.getMenu,
    params: {
      category: selectedCategory,
      query: searchQuery,
      limit: 10,
    },
  });
  console.log("Search ~ menuData:", JSON.stringify(menuData, null, 2));

 
    const handleCategoryChange = (category: string) => {
      setSelectedCategory(category);
    };

    const handleSearch = (query: string) => {
      setSearchQuery(query);
    };

  return (
    <SafeAreaView className="bg-whiteflex-1">
      <FlatList
        ListHeaderComponent={
          <Header
            onCategoryChange={handleCategoryChange}
            onSearch={handleSearch}
            selectedCategory={selectedCategory}
          />
        }
        ListHeaderComponentClassName="my-[27px]"
        data={menuData}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          return (
            <View className={cn("", isEven && "mt-5")}>
              <MenuCard item={item as unknown as MenuItem} />
            </View>
          );
        }}
        contentContainerClassName="px-5 pb-28"
      />
    </SafeAreaView>
  );
}
