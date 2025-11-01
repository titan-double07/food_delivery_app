import { images } from "@/constants";
import { appWriteServices } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import CartButton from "../shared/CartButton";
import Category from "../shared/CategoryButton";
import SearchInput from "../shared/SearchInput";


export default function Header() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ category?: string }>();

  // get categories
  const { data: categoriesData } = useAppwrite({
    fn: appWriteServices.getCategories,
  });

  const [active, setActive] = useState<string | null>(
    searchParams.category || "",
  );

  // on category press
  const onCategoryChange = (categoryId: string) => {
    setActive(categoryId);
    router.setParams({
      category: categoryId,
    });
  };

  // on search
  const onSearch = (query: string) => {
    router.setParams({
      query: query,
    });
  };

  // Create a combined list with "All" at the beginning
  const categoriesWithAll = [
    { $id: "all", name: "All" },
    ...(categoriesData || []),
  ];

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
      <SearchInput onSearch={onSearch} />

      {/* categories */}
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
            isActive={
              active === item.$id || (active === "" && item.$id === "all")
            }
            onPress={() => onCategoryChange(item.$id === "all" ? "" : item.$id)}
          />
        )}
      />
    </View>
  );
}
