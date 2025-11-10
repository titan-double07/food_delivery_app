import { create } from "zustand";

// interface for alert state
interface AlertState {
  // whether the alert is visible or not
  visible: boolean;
  // type of alert: success, error, or info
  type: "success" | "error" | "info";
  // title of the alert
  title: string;
  // message of the alert
  message: string;
  // function to show the alert
  showAlert: (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => void;
  // function to hide the alert
  hideAlert: () => void;
}

// create hook for alert state
export const useAlertStore = create<AlertState>((set) => ({
  // initial state
  visible: false,
  type: "info",
  title: "",
  message: "",
  // function to show the alert
  showAlert: (type, title, message) =>
    set({ visible: true, type, title, message }),
  // function to hide the alert
  hideAlert: () => set({ visible: false }),
}));
