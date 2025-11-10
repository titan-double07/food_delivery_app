// utils/toast.ts
import Toast, { ToastType } from "react-native-toast-message";

// For quick, non-blocking notifications (success messages, info updates)

export const showToast = (type: ToastType, text1: string, text2?: string) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
  });
};
