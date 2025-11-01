import React from "react";
import { View, Text, Pressable } from "react-native";
import { appWriteServices } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function Profile() {
  const {
    data: user,
    loading,
    error,
  } = useAppwrite({
    fn: appWriteServices.getCurrentUser,
  });
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await appWriteServices.signOutUser();
      logout();
      router.replace("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      <Text>Profile</Text>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Avatar: {user?.avatar}</Text>
      <Pressable onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}
