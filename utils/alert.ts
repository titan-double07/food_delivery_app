// For important messages that require user acknowledgment 
import { useAlertStore } from "@/store/alert.store";

export const showAlert = (
  type: "success" | "error" | "info",
  title: string,
  message: string,
) => {
  useAlertStore.getState().showAlert(type, title, message);
};
