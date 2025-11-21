import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Input, Text, XStack, YStack, useTheme } from "tamagui";
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
              isFocused
                ? String(theme.blue8?.val)
                : String(theme.gray10?.val)
            }
            style={{ marginRight: 8 }}
          />
          <Input
            value={field.value?.toString() || ""}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, "");
              const numValue = cleaned === "" ? 0 : parseInt(cleaned);
              const finalValue = isNaN(numValue) ? 0 : numValue;

              field.onChange(finalValue);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            flex={1}
            borderWidth={0}
            placeholderTextColor={
              isFocused
                ? String(theme.blue8?.val)
                : String(theme.gray10?.val)
            }
            placeholder="0"
            keyboardType="number-pad"
            fontSize={16}
            bg="transparent"
          />
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
