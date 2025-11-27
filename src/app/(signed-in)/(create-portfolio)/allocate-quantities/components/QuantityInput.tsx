import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Input, Paragraph, Text, XStack, YStack, useTheme } from "tamagui";
import { AllocateQuantitiesFormData } from "../model";

interface QuantityInputProps {
  field: ControllerRenderProps<
    AllocateQuantitiesFormData,
    `allocations.${number}.quantity`
  >;
  error?: FieldError;
}

export const QuantityInput = ({ field, error }: QuantityInputProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const scale = useSharedValue(1);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderRadius: 8,
    borderColor: isFocused
      ? String(theme.blue8?.val)
      : String(theme.gray6?.val),
    borderWidth: 1,
    transform: [{ scale: scale.value }],
  }));

  const handleFocus = () => {
    setIsFocused(true);
    scale.value = withSpring(1.01);
  };

  const handleBlur = () => {
    setIsFocused(false);
    scale.value = withSpring(1);
  };

  return (
    <YStack gap="$2">
      <Animated.View style={[animatedBorderStyle]}>
        <XStack alignItems="center" px="$3" py="$2">
          <Ionicons
            name="layers-outline"
            size={20}
            color={
              isFocused ? String(theme.blue8?.val) : String(theme.gray10?.val)
            }
            style={{ marginRight: 8 }}
          />
          <Input
            value={field.value?.toString() || ""}
            onChangeText={(text) => {
              // Allow numbers and one decimal point
              const cleaned = text.replace(/[^0-9.]/g, "");
              // Ensure only one decimal point
              const parts = cleaned.split(".");
              const formatted =
                parts.length > 2
                  ? `${parts[0]}.${parts.slice(1).join("")}`
                  : cleaned;

              const numValue = formatted === "" ? 0 : parseFloat(formatted);
              const finalValue = isNaN(numValue) ? 0 : numValue;

              // Limit to 100 and 2 decimal places
              const limitedValue = Math.min(finalValue, 100);
              const roundedValue = Math.round(limitedValue * 100) / 100;

              field.onChange(roundedValue);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            flex={1}
            borderWidth={0}
            placeholderTextColor={
              isFocused ? String(theme.blue8?.val) : String(theme.gray10?.val)
            }
            placeholder="0.0%"
            keyboardType="decimal-pad"
            fontSize={16}
            bg="transparent"
          />
          <Paragraph fontSize={14} color="$gray11" fontWeight="600">
            %
          </Paragraph>
        </XStack>
      </Animated.View>
      {error && (
        <Text color="$red10" fontSize={12} mt="$1">
          {error.message}
        </Text>
      )}
    </YStack>
  );
};
