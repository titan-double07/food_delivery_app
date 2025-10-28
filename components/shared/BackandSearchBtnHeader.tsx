import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Touchable, TouchableOpacity, View } from "react-native";

export default function BackandSearchBtnHeader() {
  return (
    <View className="flex-row justify-between">
      {/* arrow back */}
      <TouchableOpacity>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          
      {/* search btn */}
      <TouchableOpacity>
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
