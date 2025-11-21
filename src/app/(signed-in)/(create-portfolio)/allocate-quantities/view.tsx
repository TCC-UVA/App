import { Layout } from "@/src/components/layout";
import { Ionicons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import {
  Button,
  H6,
  Paragraph,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import { QuantityInput } from "./components/QuantityInput";
import { useAllocateQuantitiesViewModel } from "./viewModel";

const AnimatedButton = Animated.createAnimatedComponent(Button);

export const AllocateQuantitiesView = ({
  control,
  handleSubmit,
  onSubmit,
  handleGoBack,
  selectedStocks,
  totalQuantity,
  clearAll,
  isLoading,
  isEditingMode,
}: ReturnType<typeof useAllocateQuantitiesViewModel>) => {
  const theme = useTheme();

  const isValid = totalQuantity > 0;

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
                <H6 color="$color" fontWeight="700" fontSize={18}>
                  Alocar Quantidades
                </H6>
                <Paragraph fontSize={13} color="$gray11" mt="$1">
                  {selectedStocks.length}{" "}
                  {selectedStocks.length === 1 ? "ativo" : "ativos"}
                </Paragraph>
              </YStack>
            </XStack>
          </Animated.View>

          {totalQuantity > 0 && (
            <Animated.View
              entering={FadeInDown.delay(200).duration(600).springify()}
            >
              <YStack
                bg="$blue2"
                borderRadius="$4"
                p="$3"
                mb="$4"
                borderWidth={1}
                borderColor="$blue6"
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Paragraph fontSize={13} color="$gray11">
                    Total alocado
                  </Paragraph>
                  <Paragraph color="$blue11" fontWeight="700" fontSize={16}>
                    {totalQuantity} {totalQuantity === 1 ? "ação" : "ações"}
                  </Paragraph>
                </XStack>
              </YStack>
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInDown.delay(300).duration(600).springify()}
          >
            <Button
              variant="outlined"
              borderColor="$gray8"
              color="$red10"
              size="$4"
              borderRadius="$4"
              fontWeight="600"
              fontSize={14}
              onPress={clearAll}
              bg="transparent"
              mb="$4"
              disabled={totalQuantity === 0}
              opacity={totalQuantity === 0 ? 0.5 : 1}
              icon={
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={String(
                    totalQuantity === 0 ? theme.gray10?.val : theme.red10?.val
                  )}
                />
              }
            >
              Limpar Tudo
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
                    name={`allocations.${index}.quantity`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <QuantityInput field={field} error={fieldState.error} />
                    )}
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
              disabled={!isValid || isLoading}
              opacity={!isValid ? 0.5 : 1}
            >
              {isLoading ? (
                <ActivityIndicator
                  testID="creating-wallet-button-loading"
                  color="white"
                />
              ) : isEditingMode ? (
                "Editar carteira"
              ) : (
                "Criar carteira"
              )}
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
