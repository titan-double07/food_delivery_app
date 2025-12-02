import { ReactNode } from "react";
import { create } from "zustand";

type ShowAlertProps = {
  type: "success" | "error" | "info";
  title: string;
  message: ReactNode;
  onConfirm?: () => void;
  hideCancel?: boolean;
};
// interface for alert state
interface AlertState {
  // whether the alert is visible or not
  visible: boolean;
  // type of alert: success, error, or info
  type: "success" | "error" | "info";
  // title of the alert
  title: string;
  // message of the alert
  message: ReactNode;
  // function to show the alert
  showAlert: ({ type, title, message, onConfirm }: ShowAlertProps) => void;
  // function to hide the alert
  hideAlert: () => void;
  onConfirm?: () => void;
  hideCancel?: boolean;
}

// create hook for alert state
export const useAlertStore = create<AlertState>((set) => ({
  // initial state
  visible: false,
  type: "info",
  title: "",
  message: "",
  hideCancel: false,
  // function to show the alert
  showAlert: ({ type, title, message, onConfirm, hideCancel }) =>
    set({
      visible: true,
      type,
      title,
      message,
      onConfirm: onConfirm,
      hideCancel: hideCancel,
    }),
  // function to hide the alert
  hideAlert: () => set({ visible: false, onConfirm: undefined }),
}));
