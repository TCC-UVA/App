import { ControlledInput } from "@/src/components/controlled-Input";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ActivityIndicator } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, H5, Paragraph, View, YStack, useTheme } from "tamagui";
import { useLoginViewModel } from "./viewModel";

const AnimatedButton = Animated.createAnimatedComponent(Button);

export const LoginView = ({
  control,
  onSubmit,
  isLoading,
  handleSubmit,
  handleGoToRegister,
  isError,
}: ReturnType<typeof useLoginViewModel>) => {
  const { bottom, top } = useSafeAreaInsets();
  const theme = useTheme();

  return (
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
          <H5 color="$color" textAlign="center" fontWeight="700" mb="$2">
            Faça seu login
          </H5>
          <Paragraph color="$gray11" textAlign="center">
            Gerencie suas finanças com facilidade
          </Paragraph>
        </YStack>
      </Animated.View>

      <YStack gap="$4" flex={1}>
        <Animated.View entering={FadeInUp.delay(200).duration(600).springify()}>
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

        <Animated.View entering={FadeInUp.delay(400).duration(600).springify()}>
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

        {isError && (
          <View>
            <Paragraph
              fontSize={14}
              color="$red10"
              fontWeight="600"
              textAlign="center"
            >
              Ocorreu um erro ao tentar fazer login. Verifique suas credenciais
              e tente novamente.
            </Paragraph>
          </View>
        )}

        <Animated.View entering={FadeInUp.delay(600).duration(600).springify()}>
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
              <ActivityIndicator testID="login-button-loading" color="white" />
            ) : (
              "Entrar"
            )}
          </AnimatedButton>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(800).duration(600).springify()}>
          <Link href="/(signed-off)/register" asChild>
            <Button
              bg={"transparent"}
              color="$gray11"
              size="$5"
              mt="$2"
              borderRadius="$4"
              fontWeight="600"
              fontSize={16}
              onPress={handleGoToRegister}
            >
              Não tem uma conta? Cadastre-se
            </Button>
          </Link>
        </Animated.View>
      </YStack>
    </YStack>
  );
};
