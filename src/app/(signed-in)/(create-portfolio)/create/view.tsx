import { ControlledInput } from "@/src/components/controlled-Input";
import { Layout } from "@/src/components/layout";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Button, H5, Paragraph, YStack, useTheme } from "tamagui";
import { useCreateWalletViewModel } from "./viewModel";

const AnimatedButton = Animated.createAnimatedComponent(Button);

export const CreateWalletView = ({
  control,
  onSubmit,
  isLoading,
  handleSubmit,
  handleGoBack,
}: ReturnType<typeof useCreateWalletViewModel>) => {
  const theme = useTheme();

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
            <YStack alignItems="center" mb="$8" mt="$4">
              <Animated.View>
                <YStack
                  bg="$blue10"
                  w={80}
                  h={80}
                  borderRadius={40}
                  alignItems="center"
                  justifyContent="center"
                  mb="$4"
                >
                  <Ionicons
                    name="briefcase-outline"
                    size={40}
                    color={String(theme.background?.val || "#ffffff")}
                  />
                </YStack>
              </Animated.View>
              <H5 color="$color" textAlign="center" fontWeight="700" mb="$2">
                Nova Carteira
              </H5>
              <Paragraph color="$gray11" textAlign="center">
                Crie uma carteira para organizar seus investimentos
              </Paragraph>
            </YStack>
          </Animated.View>

          <YStack gap="$4" px="$2">
            <Animated.View
              entering={FadeInUp.delay(200).duration(600).springify()}
            >
              <YStack gap="$2">
                <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                  Nome da Carteira
                </Paragraph>
                <ControlledInput
                  name="name"
                  control={control}
                  placeholder="Ex: Minhas Ações, Dividendos, etc."
                  autoCapitalize="words"
                  icon="briefcase-outline"
                  autoFocus
                />
              </YStack>
            </Animated.View>
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
              disabled={isLoading}
              opacity={isLoading ? 0.7 : 1}
            >
              {isLoading ? (
                <ActivityIndicator
                  testID="create-wallet-loading"
                  color="white"
                />
              ) : (
                "Continuar"
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
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </Animated.View>
        </YStack>
      </KeyboardAvoidingView>
    </Layout>
  );
};
