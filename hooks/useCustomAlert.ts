import { useState } from "react";

interface AlertState {
  visible: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

export const useCustomAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const showAlert = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => {
    setAlert({ visible: true, type, title, message });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return { alert, showAlert, hideAlert };
};
