import Header from "@/components/search-screen/Header";
import MenuCard from "@/components/search-screen/MenuCard";
import { appWriteServices } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/type";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  // get category and search query from params
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();

  // get menu
  const {
    data: menuData,
    loading,
    error,
    refetch,
  } = useAppwrite({
    fn: appWriteServices.getMenu,
    params: {
      category,
      query,
      limit: 10,
    },
  });
  // get categories
  // const { data: categories } = useAppwrite({ fn: getCategories });

  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [category, query]);

  //TODO: Fix issue  where clearing th search query does not clear the menu and using the filter (All) does not reset the menu either

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        ListHeaderComponent={<Header />}
        data={menuData}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-[30px]"
        ListHeaderComponentClassName="my-[27px]"
        contentContainerClassName="gap-5 page-padding "
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          return (
            <View className={cn("max-w-[50%] flex-1", !isEven && "mt-16")}>
              <MenuCard item={item as unknown as MenuItem} />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
