import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastConfig {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration: number;
}

interface ToastContextValue {
  toasts: ToastConfig[];
  showToast: (config: Omit<ToastConfig, "id">) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = useCallback((config: Omit<ToastConfig, "id">) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: ToastConfig = { ...config, id };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      hideToast(id);
    }, config.duration);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }
  return context;
};
