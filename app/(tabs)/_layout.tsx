import { useAuthStore } from "@/store/auth.store";
import { FontAwesome } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";
export const navItems = [
  {
    name: "index",
    title: "Home",
    icon: ({ color, size }: { color: string; size: number }) => (
      <FontAwesome name="home" size={size} color={color} />
    ),
  },
  {
    name: "search",
    title: "Search",
    icon: ({ color, size }: { color: string; size: number }) => (
      <FontAwesome name="search" size={size} color={color} />
    ),
  },
  {
    name: "cart",
    title: "Cart",
    icon: ({ color, size }: { color: string; size: number }) => (
      <FontAwesome name="shopping-cart" size={size} color={color} />
    ),
  },
  {
    name: "profile",
    title: "Profile",
    icon: ({ color, size }: { color: string; size: number }) => (
      <FontAwesome name="user" size={size} color={color} />
    ),
  },
];

export default function TabsLayout() {
  const { isAuthenticated } = useAuthStore();
  // console.log("🚀 ~ HomeLayout ~ isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <>
      <StatusBar />
      <Tabs
        screenOptions={{
          headerShown: false, // Hide the header bar for all screens in the tab navigator
          tabBarActiveTintColor: "#fe8c00", // Color for the active (focused) tab icon and label
          tabBarInactiveTintColor: "#5d606d", // Color for the inactive tab icon and label
          tabBarStyle: {
            backgroundColor: "white", // Background color of the tab bar
            opacity: 0.9, // Opacity of the tab bar
            height: 60, // Height of the tab bar
            position: "absolute", // Position the tab bar absolutely
            bottom: 40, // Distance from the bottom of the screen
            elevation: 3, // Add a shadow (Android)
            shadowRadius: 4, // Shadow radius (iOS)
            shadowOffset: { width: 0, height: 2 }, // Shadow offset (iOS)
            marginHorizontal: 20, // Add horizontal margin to the tab bar
            borderTopLeftRadius: 50, // Round the top-left corner
            borderTopRightRadius: 50, // Round the top-right corner
            borderBottomLeftRadius: 50, // Round the bottom-left corner
            borderBottomRightRadius: 50, // Round the bottom-right corner
          },
          tabBarLabelStyle: { fontSize: 14 },
          tabBarItemStyle: { paddingVertical: 0 },
         
          
        }}
      >
        {navItems.map((item) => (
          <Tabs.Screen
            key={item.name}
            name={item.name}
            options={{
              title: item.title,
              tabBarIcon: ({ color, size }) => item.icon({ color, size }),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}
