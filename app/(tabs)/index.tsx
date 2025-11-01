import Header from "@/components/home-screen/Header";
import { images, offers } from "@/constants";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        ListHeaderComponent={<Header />}
        ListHeaderComponentClassName="my-[27px]"
        data={offers}
        // keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isEven = item.id % 2 === 0;
          return (
            <View className="">
              <Pressable
                className={cn(
                  "offer-card",
                  isEven ? "flex-row-reverse" : "flex-row",
                )}
                style={{
                  backgroundColor: item.color,
                }}
                android_ripple={{ color: "#fffff22" }}
              >
                {({ pressed }) => (
                  <Fragment>
                    <View
                      className={cn(
                        "offer-card__info",
                        isEven ? "pr-10" : "pl-10",
                      )}
                    >
                      {/* title */}
                      <View className="  offer-card__info  ">
                        <Text className="h1-bold leading-tight text-white ">
                          {item.title}
                        </Text>
                      </View>
                      {/* price */}
                      {/* <Text className=" text-white-100 text-2xl">$10.88</Text> */}
                      <Image
                        source={images.arrowRight}
                        resizeMode="contain"
                        className="size-10"
                        style={{ tintColor: "white" }}
                      />
                    </View>

                    {/* image */}
                    <View className=" h-full w-1/2">
                      <Image
                        source={item.image}
                        resizeMode="contain"
                        className="size-full"
                      />
                    </View>
                  </Fragment>
                )}
              </Pressable>
            </View>
          );
        }}
        contentContainerClassName="page-padding"
      />
    </SafeAreaView>
  );
}
