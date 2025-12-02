import { useAlertStore } from "@/store/alert-store";
import React, { useEffect, useRef } from "react";
import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";

export default function CustomAlert() {
  const { visible, type, title, message, hideAlert, onConfirm, hideCancel } =
    useAlertStore();
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-500",
          text: "text-green-700",
          button: "bg-green-500",
          icon: "✓",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-500",
          text: "text-red-700",
          button: "bg-red-500",
          icon: "✕",
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-500",
          text: "text-blue-700",
          button: "bg-blue-500",
          icon: "ℹ",
        };
    }
  };

  const colors = getColors();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      //   onRequestClose={hideAlert}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={hideAlert}
        className="flex-1 items-center justify-center bg-black/50 p-4"
      >
        <Animated.View
          style={{ transform: [{ scale: scaleValue }] }}
          className="w-full max-w-sm"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              className={`${colors.bg}  rounded-2xl border-t-4 ${colors.border} p-6 shadow-2xl`}
            >
              {/* Header */}
              <View className="flex-row items-center gap-5">
                {/* Icon */}
                <View
                  className={`h-8 w-8 rounded-full ${colors.button} mb-4 items-center justify-center`}
                >
                  <Text className="text-xl font-bold text-white">
                    {colors.icon}
                  </Text>
                </View>

                {/* Title */}
                <Text className={`text-xl font-bold ${colors.text} mb-2`}>
                  {title}
                </Text>
              </View>

              {/* Message - Full text displayed */}
              <Text className="mb-6 text-base leading-6 text-gray-700">
                {message}
              </Text>

              {/* Button */}
              <View className="flex flex-row items-center justify-between gap-5">
                {!hideCancel && (
                  <TouchableOpacity
                    onPress={hideAlert}
                    className={`${colors.border} flex-1 rounded-xl border px-6 py-3`}
                  >
                    <Text
                      className={`text-center text-base font-semibold ${colors.text}`}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    hideAlert();
                    onConfirm && onConfirm();
                  }}
                  className={`${colors.button} flex-1 rounded-xl px-6 py-3`}
                >
                  <Text className="text-center text-base font-semibold text-white">
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
