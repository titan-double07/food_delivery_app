import React from "react";
import { View, Text, Pressable, FlatList, Image } from "react-native";
import { appWriteServices } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { SafeAreaView } from "react-native-safe-area-context";
import BackandSearchBtnHeader from "@/components/shared/BackandSearchBtnHeader";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import CustomButton from "@/components/shared/CustomButton";

export default function Profile() {
  const {
    data: user,
    loading,
    error,
  } = useAppwrite({
    fn: appWriteServices.getCurrentUser,
  });
  const { logout } = useAuthStore();

  console.log("Profile ~ user:", JSON.stringify(user, null, 2));
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
    <SafeAreaView className="page-padding flex-1 ">
      <View className="my-[27px]">
        <BackandSearchBtnHeader title="Profile" />
      </View>
      <View className="gap-7">
        {/* Profile pic */}
        <View className=" mx-auto w-[100px] items-center">
          <Image
            source={{ uri: user?.avatar }}
            className="mx-auto h-24 w-24 rounded-full"
          />
          {/* edit icon button */}
          <Pressable
            onPress={() => {}}
            className="absolute bottom-0 right-5 mx-auto h-7 w-7 items-center justify-center rounded-full border  border-white bg-primary "
          >
            <Ionicons
              name="pencil-outline"
              size={13}
              color={colors.light.white.DEFAULT}
              // className="absolute bottom-0 right-0 "
            />
          </Pressable>
        </View>

        {/* user info */}
        <View className=" gap-7 rounded-[16px] bg-white-100 px-4 py-5">
          <InfoRow title="Full Name" value={user?.name} />
          <InfoRow title="Email" value={user?.email} />
          {/* <InfoRow title="Phone" value={user?.phone} />
        <InfoRow title="Address" value={user?.address} /> */}
        </View>

        {/* button group */}
        <View className="gap-5">
          <CustomButton
            variant="outline"
            title="Edit Profile"
            onPress={() => {}}
            className=" bg-primary/10 "
            textClassName=" text-primary paragraph-semibold"
          />
          <CustomButton
            variant="outline"
            title="Log out"
            leftIcon={
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.light.error}
              />
            }
            onPress={() => {}}
            className=" border-error bg-error/10"
            textClassName=" text-error paragraph-semibold"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const InfoRow = ({ title, value }: { title: string; value: string }) => (
  <View className="profile-field flex-row">
    <View className="profile-field__icon">
      {/* icon  */}
      <Ionicons
        name="person-outline"
        size={20}
        color={colors.light.primary}
        className=""
      />
    </View>
    <View className="">
      <Text className="body-medium">{title}</Text>
      <Text className="paragraph-semibold">{value}</Text>
    </View>
  </View>
);
