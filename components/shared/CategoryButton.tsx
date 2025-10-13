
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface CategoryProps {
  name: string;
  isActive: boolean;
  onPress: () => void;
}

export default function Category({ name, isActive, onPress }: CategoryProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className={`p-3 px-6 rounded-full ${isActive ? 'bg-primary' : 'bg-white'}`}>
        <Text className={isActive ? 'text-white' : 'text-gray-700'}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
}