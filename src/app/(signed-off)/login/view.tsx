import { ControlledInput } from "@/src/components/controlled-Input";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, H2, Paragraph, YStack, useTheme } from "tamagui";
import { useLoginViewModel } from "./viewModel";

const AnimatedButton = Animated.createAnimatedComponent(Button);

export const LoginView = ({
  control,
  onSubmit,
  isLoading,
  handleSubmit,
  handleGoToRegister,
}: ReturnType<typeof useLoginViewModel>) => {
  const { bottom, top } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <YStack flex={1} pt={top + 20} pb={bottom + 20} px="$4">
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
                  name="wallet-outline"
                  size={40}
                  color={String(theme.background?.val || "#ffffff")}
                />
              </YStack>
            </Animated.View>
            <H2 color="$color" fontWeight="700" mb="$2">
              Welcome Back
            </H2>
            <Paragraph color="$gray11" textAlign="center">
              Manage your finances with ease
            </Paragraph>
          </YStack>
        </Animated.View>

        {/* Form Card */}
        <YStack gap="$4" flex={1}>
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
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
            entering={FadeInUp.delay(600).duration(600).springify()}
          >
            <AnimatedButton
              bg="$blue10"
              color="white"
              size="$5"
              mt="$4"
              borderRadius="$4"
              fontWeight="600"
              fontSize={16}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              opacity={isLoading ? 0.7 : 1}
            >
              {isLoading ? (
                <ActivityIndicator
                  testID="login-button-loading"
                  color="white"
                />
              ) : (
                "Login"
              )}
            </AnimatedButton>
          </Animated.View>

          {/* Register Link */}
          <Animated.View
            entering={FadeInUp.delay(800).duration(600).springify()}
          >
            <Button
              variant="outlined"
              borderColor="$gray8"
              color="$blue10"
              size="$5"
              borderRadius="$4"
              fontWeight="600"
              fontSize={16}
              onPress={handleGoToRegister}
              bg="transparent"
            >
              Ir para Registro
            </Button>
          </Animated.View>
        </YStack>
      </YStack>
    </TouchableWithoutFeedback>
  );
};
