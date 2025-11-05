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
  onMask?: (value: string, previousValue?: string) => string;
};

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  icon,
  onMask,
  ...rest
}: Props<T>) => {
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
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <YStack gap="$2">
            <Animated.View style={[animatedBorderStyle]}>
              <XStack alignItems="center" px="$3" py="$2">
                {icon && (
                  <Ionicons
                    name={icon}
                    size={20}
                    color={
                      isFocused
                        ? String(theme.blue8?.val)
                        : String(theme.gray10?.val)
                    }
                    style={{ marginRight: 8 }}
                  />
                )}
                <Input
                  {...field}
                  onChangeText={(text) => {
                    const value = onMask ? onMask(text, field.value) : text;
                    field.onChange(value);
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
