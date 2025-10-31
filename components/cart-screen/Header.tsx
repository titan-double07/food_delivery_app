import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BackandSearchBtnHeader from "../shared/BackandSearchBtnHeader";
import CustomButton from "../shared/CustomButton";

export default function Header() {
  return (
    <View className="gap-[25px]">
      <BackandSearchBtnHeader />
      <View className=" flex-between w-full flex-row">
        <View className="flex-col gap-1.5">
          <Text className="small-bold text-primary">Delivery location</Text>
          {/* delivery location */}
          <TouchableOpacity
            className="w-full flex-row items-center  gap-1 "
            onPress={() => {
              console.log("location");
            }}
          >
            <Text className=" paragraph-bold">Home</Text>
          </TouchableOpacity>
        </View>
        {/* cart */}
        <CustomButton
          variant="outline"
          title="Change Location"
          onPress={() => {}}
          className="w-[130px] "
          textClassName="text-xs"
        />
      </View>
    </View>
  );
}
