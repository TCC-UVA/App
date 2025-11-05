import { ControlledInput } from "@/src/components/controlled-Input";
import { Mask } from "@/src/utils/mask";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, H5, Paragraph, XStack, YStack, useTheme } from "tamagui";
import { useRegisterViewModel } from "./viewModel";

const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export const RegisterView = ({
  control,
  onSubmit,
  isLoading,
  handleSubmit,
  handleGoToLogin,
  currentStep,
  handleNextStep,
  handlePreviousStep,
}: ReturnType<typeof useRegisterViewModel>) => {
  const { bottom, top } = useSafeAreaInsets();
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(currentStep === 1 ? 0.5 : 1, {
      damping: 20,
      stiffness: 90,
    });
  }, [currentStep]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <YStack flex={1} pt={top + 20} pb={bottom + 20} px="$4">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <YStack alignItems="center" mb="$6" mt="$4">
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
                    name="person-add-outline"
                    size={40}
                    color={String(theme.background?.val || "#ffffff")}
                  />
                </YStack>
              </Animated.View>
              <H5 color="$color" textAlign="center" fontWeight="700" mb="$2">
                Criar Conta
              </H5>
              <Paragraph color="$gray11" textAlign="center" mb="$4">
                {currentStep === 1
                  ? "Informações pessoais"
                  : "Defina sua senha"}
              </Paragraph>

              {/* Progress Bar */}
              <YStack w="100%" px="$2">
                <XStack justifyContent="space-between" mb="$2">
                  <Paragraph fontSize={12} color="$gray11" fontWeight="600">
                    Progresso
                  </Paragraph>
                  <Paragraph fontSize={12} color="$blue10" fontWeight="600">
                    Passo {currentStep}/2
                  </Paragraph>
                </XStack>
                <YStack
                  testID="register-progress-bar"
                  w="100%"
                  h={6}
                  bg="$gray5"
                  borderRadius="$10"
                  overflow="hidden"
                >
                  <AnimatedYStack
                    testID="register-step-indicator"
                    h="100%"
                    bg="$blue10"
                    borderRadius="$10"
                    style={progressStyle}
                  />
                </YStack>
              </YStack>
            </YStack>
          </Animated.View>

          {currentStep === 1 ? (
            <YStack gap="$4" key="step-1">
              <Animated.View
                entering={FadeInUp.delay(200).duration(600).springify()}
              >
                <YStack gap="$2">
                  <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                    Nome
                  </Paragraph>
                  <ControlledInput
                    name="name"
                    control={control}
                    placeholder="Digite seu nome completo"
                    autoCapitalize="words"
                    icon="person-outline"
                  />
                </YStack>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(300).duration(600).springify()}
              >
                <YStack gap="$2">
                  <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                    E-mail
                  </Paragraph>
                  <ControlledInput
                    name="email"
                    control={control}
                    placeholder="Digite seu e-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon="mail-outline"
                  />
                </YStack>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(400).duration(600).springify()}
              >
                <YStack gap="$2">
                  <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                    Data de Nascimento
                  </Paragraph>
                  <ControlledInput
                    name="birthDate"
                    control={control}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                    icon="calendar-outline"
                    onMask={Mask.date}
                    maxLength={10}
                  />
                </YStack>
              </Animated.View>
            </YStack>
          ) : (
            <YStack gap="$4" key="step-2">
              <Animated.View
                entering={FadeInUp.delay(200).duration(600).springify()}
              >
                <YStack gap="$2">
                  <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                    Senha
                  </Paragraph>
                  <ControlledInput
                    name="password"
                    control={control}
                    secureTextEntry
                    placeholder="Digite sua senha"
                    icon="lock-closed-outline"
                  />
                </YStack>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(300).duration(600).springify()}
              >
                <YStack gap="$2">
                  <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                    Confirmar Senha
                  </Paragraph>
                  <ControlledInput
                    name="confirmPassword"
                    control={control}
                    secureTextEntry
                    placeholder="Confirme sua senha"
                    icon="lock-closed-outline"
                  />
                </YStack>
              </Animated.View>
            </YStack>
          )}
        </ScrollView>

        <YStack gap="$3" mt="$4">
          {currentStep === 1 ? (
            <>
              <Animated.View
                entering={FadeInUp.delay(500).duration(600).springify()}
              >
                <AnimatedButton
                  testID="register-next-step-button"
                  bg="$blue10"
                  color="white"
                  size="$5"
                  borderRadius="$4"
                  fontWeight="600"
                  fontSize={16}
                  onPress={handleNextStep}
                >
                  Próximo
                </AnimatedButton>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(600).duration(600).springify()}
              >
                <Button
                  variant="outlined"
                  borderColor="$gray8"
                  color="$blue10"
                  size="$5"
                  borderRadius="$4"
                  fontWeight="600"
                  fontSize={16}
                  onPress={handleGoToLogin}
                  bg="transparent"
                >
                  Já tem conta? Faça Login
                </Button>
              </Animated.View>
            </>
          ) : (
            <>
              <Animated.View
                entering={FadeInUp.delay(500).duration(600).springify()}
              >
                <AnimatedButton
                  testID="register-create-account-button"
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
                      testID="register-button-loading"
                      color="white"
                    />
                  ) : (
                    "Criar Conta"
                  )}
                </AnimatedButton>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(600).duration(600).springify()}
              >
                <Button
                  testID="register-go-back-button"
                  variant="outlined"
                  borderColor="$gray8"
                  color="$blue10"
                  size="$5"
                  borderRadius="$4"
                  fontWeight="600"
                  fontSize={16}
                  onPress={handlePreviousStep}
                  bg="transparent"
                  disabled={isLoading}
                >
                  Voltar
                </Button>
              </Animated.View>
            </>
          )}
        </YStack>
      </KeyboardAvoidingView>
    </YStack>
  );
};
