import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Paragraph, XStack, YStack, useTheme } from "tamagui";
import { ToastConfig, ToastType } from "./ToastContext";

interface ToastItemProps {
  toast: ToastConfig;
  onDismiss: (id: string) => void;
}

const getToastColors = (type: ToastType, theme: any) => {
  switch (type) {
    case "success":
      return {
        bg: String(theme.green4?.val || "#d1fae5"),
        border: String(theme.green8?.val || "#22c55e"),
        icon: String(theme.green11?.val || "#16a34a"),
        iconName: "checkmark-circle" as const,
      };
    case "error":
      return {
        bg: String(theme.red4?.val || "#fee2e2"),
        border: String(theme.red8?.val || "#ef4444"),
        icon: String(theme.red11?.val || "#dc2626"),
        iconName: "close-circle" as const,
      };
    case "warning":
      return {
        bg: String(theme.orange4?.val || "#fed7aa"),
        border: String(theme.orange8?.val || "#f97316"),
        icon: String(theme.orange11?.val || "#ea580c"),
        iconName: "warning" as const,
      };
    case "info":
    default:
      return {
        bg: String(theme.blue4?.val || "#dbeafe"),
        border: String(theme.blue8?.val || "#3b82f6"),
        icon: String(theme.blue11?.val || "#2563eb"),
        iconName: "information-circle" as const,
      };
  }
};

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const theme = useTheme();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const colors = getToastColors(toast.type, theme);

  useEffect(() => {
    // Smooth entrance animation
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
      mass: 0.8,
    });
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });

    // Auto-dismiss animation
    const dismissTimeout = setTimeout(() => {
      translateY.value = withSpring(-120, {
        damping: 20,
        stiffness: 100,
      });
      opacity.value = withTiming(
        0,
        {
          duration: 350,
          easing: Easing.in(Easing.ease),
        },
        (finished) => {
          if (finished) {
            runOnJS(onDismiss)(toast.id);
          }
        }
      );
    }, toast.duration - 350);

    return () => clearTimeout(dismissTimeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: opacity.value * 0.05 + 0.95 }, // Subtle scale effect
    ],
    opacity: opacity.value,
  }));

  const handleDismiss = () => {
    translateY.value = withSpring(-120, {
      damping: 20,
      stiffness: 100,
    });
    opacity.value = withTiming(
      0,
      {
        duration: 350,
        easing: Easing.in(Easing.ease),
      },
      (finished) => {
        if (finished) {
          runOnJS(onDismiss)(toast.id);
        }
      }
    );
  };

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          marginBottom: 8,
          paddingHorizontal: 16,
        },
      ]}
    >
      <TouchableOpacity onPress={handleDismiss} activeOpacity={0.9}>
        <XStack
          bg={colors.bg}
          borderRadius="$4"
          p="$3"
          borderWidth={1}
          borderColor={colors.border}
          alignItems="center"
          gap="$3"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          elevation={3}
        >
          <Ionicons name={colors.iconName} size={24} color={colors.icon} />
          <YStack flex={1} gap="$1">
            <Paragraph fontSize={14} fontWeight="600" color="$color">
              {toast.title}
            </Paragraph>
            {toast.message && (
              <Paragraph fontSize={12} color="$gray11">
                {toast.message}
              </Paragraph>
            )}
          </YStack>
          <TouchableOpacity onPress={handleDismiss}>
            <Ionicons
              name="close"
              size={20}
              color={String(theme.gray10?.val || "#888")}
            />
          </TouchableOpacity>
        </XStack>
      </TouchableOpacity>
    </Animated.View>
  );
};
