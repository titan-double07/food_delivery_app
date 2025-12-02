// For important messages that require user acknowledgment
import { useAlertStore } from "@/store/alert-store";

export const showAlert = ({
  type,
  title,
  message,
  onConfirm,
}: {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  onConfirm?: () => void;
}) => {
  useAlertStore.getState().showAlert({ type, title, message, onConfirm });
};
