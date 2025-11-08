import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  shadow:
    Platform.OS === "android"
      ? { elevation: 5, shadowColor: "#878787" }
      : {
          shadowColor: "#878787",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
});