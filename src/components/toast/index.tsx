import { ToastType, useToastContext } from "./ToastContext";

export { ToastContainer } from "./ToastContainer";
export { ToastProvider } from "./ToastContext";
export type { ToastType };

export interface ToastOptions {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

export const useToast = () => {
  const { showToast } = useToastContext();

  const show = ({
    title,
    message,
    type = "info",
    duration = 3000,
  }: ToastOptions) => {
    showToast({
      title,
      message,
      type,
      duration,
    });
  };

  const success = (title: string, message?: string) => {
    show({ title, message, type: "success" });
  };

  const error = (title: string, message?: string) => {
    show({ title, message, type: "error" });
  };

  const warning = (title: string, message?: string) => {
    show({ title, message, type: "warning" });
  };

  const info = (title: string, message?: string) => {
    show({ title, message, type: "info" });
  };

  return {
    show,
    success,
    error,
    warning,
    info,
  };
};
