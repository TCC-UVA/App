import React from "react";
import { YStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToastContext } from "./ToastContext";
import { ToastItem } from "./ToastItem";

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToastContext();
  const { top } = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <YStack
      position="absolute"
      top={top + 8}
      left={0}
      right={0}
      zIndex={9999}
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={hideToast} />
      ))}
    </YStack>
  );
};