import { Layout } from "@/src/components/layout";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  Button,
  H2,
  H5,
  Input,
  Paragraph,
  Text,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import { useAllocatePercentagesViewModel } from "./viewModel";

const AnimatedButton = Animated.createAnimatedComponent(Button);

export const AllocatePercentagesView = ({
  control,
  handleSubmit,
  onSubmit,
  handleGoBack,
  selectedStocks,
  totalPercentage,
  distributeEqually,
}: ReturnType<typeof useAllocatePercentagesViewModel>) => {
  const theme = useTheme();

  const isValid = Math.abs(totalPercentage - 100) < 0.01;
  const remaining = 100 - totalPercentage;

  console.log("View render - Total:", totalPercentage, "IsValid:", isValid, "Remaining:", remaining);

  return (
    <Layout>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <XStack alignItems="center" gap="$3" mb="$6">
              <TouchableOpacity onPress={handleGoBack}>
                <YStack
                  bg="$gray5"
                  w={40}
                  h={40}
                  borderRadius={20}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={String(theme.gray11?.val || "#888888")}
                  />
                </YStack>
              </TouchableOpacity>
              <YStack flex={1}>
                <H2 fontSize={14} color="$color" fontWeight="700">
                  Alocar Porcentagens
                </H2>
                <Paragraph color="$gray11" fontSize={14}>
                  Distribua 100% entre as ações
                </Paragraph>
              </YStack>
            </XStack>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(600).springify()}
          >
            <YStack
              bg={isValid ? "$green4" : "$orange4"}
              borderRadius="$4"
              p="$4"
              mb="$4"
              borderWidth={1}
              borderColor={isValid ? "$green8" : "$orange8"}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Paragraph fontSize={14} color="$gray11">
                  Total alocado:
                </Paragraph>
                <H5 color={isValid ? "$green11" : "$orange11"} fontWeight="700">
                  {totalPercentage.toFixed(2)}%
                </H5>
              </XStack>
              {!isValid && (
                <Paragraph fontSize={12} color="$orange11" mt="$2">
                  {remaining > 0
                    ? `Faltam ${remaining.toFixed(2)}%`
                    : `Excesso de ${Math.abs(remaining).toFixed(2)}%`}
                </Paragraph>
              )}
            </YStack>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300).duration(600).springify()}
          >
            <Button
              variant="outlined"
              borderColor="$gray8"
              color="$blue10"
              size="$4"
              borderRadius="$4"
              fontWeight="600"
              fontSize={14}
              onPress={distributeEqually}
              bg="transparent"
              mb="$4"
              icon={
                <Ionicons
                  name="git-compare-outline"
                  size={18}
                  color={String(theme.blue10?.val)}
                />
              }
            >
              Distribuir Igualmente
            </Button>
          </Animated.View>

          <YStack gap="$4">
            {selectedStocks.map((stock, index) => (
              <Animated.View
                key={stock.symbol}
                entering={FadeInUp.delay((index + 4) * 100)
                  .duration(600)
                  .springify()}
              >
                <YStack
                  bg="$gray3"
                  borderRadius="$4"
                  p="$4"
                  borderWidth={1}
                  borderColor="$gray6"
                  gap="$3"
                >
                  <XStack alignItems="center" gap="$3">
                    <YStack
                      bg="$blue10"
                      w={40}
                      h={40}
                      borderRadius={20}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Paragraph color="white" fontSize={14} fontWeight="700">
                        {stock.symbol.substring(0, 2)}
                      </Paragraph>
                    </YStack>
                    <YStack flex={1}>
                      <Paragraph fontSize={14} fontWeight="600" color="$color">
                        {stock.symbol}
                      </Paragraph>
                      <Paragraph
                        fontSize={12}
                        color="$gray11"
                        numberOfLines={1}
                      >
                        {stock.shortname}
                      </Paragraph>
                    </YStack>
                  </XStack>

                  <Controller
                    name={`allocations.${index}.percentage` as any}
                    control={control}
                    render={({ field, fieldState }) => {
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
                              <Feather
                                name="percent"
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
                                  console.log(`Input changed for ${stock.symbol}:`, text);
                                  const cleaned = text.replace(/[^0-9.]/g, "");
                                  const numValue =
                                    cleaned === "" ? 0 : parseFloat(cleaned);
                                  const finalValue = isNaN(numValue) ? 0 : numValue;
                                  console.log(`Parsed value for ${stock.symbol}:`, finalValue);
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
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                fontSize={16}
                                bg="transparent"
                              />
                            </XStack>
                          </Animated.View>
                          {fieldState.error && (
                            <Text color="$red10" fontSize={12} mt="$1">
                              {fieldState.error.message}
                            </Text>
                          )}
                        </YStack>
                      );
                    }}
                  />
                </YStack>
              </Animated.View>
            ))}
          </YStack>
        </ScrollView>

        <YStack gap="$3" mt="$4">
          <Animated.View
            entering={FadeInUp.delay(400).duration(600).springify()}
          >
            <AnimatedButton
              bg="$blue10"
              color="white"
              size="$5"
              borderRadius="$4"
              fontWeight="600"
              fontSize={16}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              opacity={!isValid ? 0.5 : 1}
            >
              Confirmar Alocação
            </AnimatedButton>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(500).duration(600).springify()}
          >
            <Button
              variant="outlined"
              borderColor="$gray8"
              color="$blue10"
              size="$5"
              borderRadius="$4"
              fontWeight="600"
              fontSize={16}
              onPress={handleGoBack}
              bg="transparent"
            >
              Voltar
            </Button>
          </Animated.View>
        </YStack>
      </KeyboardAvoidingView>
    </Layout>
  );
};
