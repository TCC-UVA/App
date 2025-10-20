import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Input, InputProps, Text, XStack, YStack, useTheme } from "tamagui";

type Props<T extends FieldValues> = InputProps & {
  name: Path<T>;
  control: Control<T>;
  icon?: keyof typeof Ionicons.glyphMap;
};

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  icon,
  ...rest
}: Props<T>) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value
      ? String(theme.blue10?.val || "#3b82f6")
      : String(theme.gray8?.val || "#e5e5e5"),
    borderWidth: borderColor.value ? 2 : 1,
    transform: [{ scale: scale.value }],
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withSpring(1);
    scale.value = withSpring(1.01);
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withSpring(0);
    scale.value = withSpring(1);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <YStack gap="$2">
            <Animated.View style={[animatedBorderStyle]}>
              <XStack
                alignItems="center"
                bg="$background"
                borderRadius="$4"
                px="$3"
                py="$2"
              >
                {icon && (
                  <Ionicons
                    name={icon}
                    size={20}
                    color={
                      isFocused
                        ? String(theme.blue10?.val || "#3b82f6")
                        : String(theme.gray10?.val || "#6b7280")
                    }
                    style={{ marginRight: 8 }}
                  />
                )}
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  flex={1}
                  borderWidth={0}
                  fontSize={16}
                  bg="transparent"
                  {...rest}
                />
              </XStack>
            </Animated.View>
            {fieldState.error && (
              <Animated.View>
                <Text color="$red10" fontSize={12} mt="$1">
                  {fieldState.error.message}
                </Text>
              </Animated.View>
            )}
          </YStack>
        );
      }}
    />
  );
};
