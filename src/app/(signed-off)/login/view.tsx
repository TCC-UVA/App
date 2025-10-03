import { ControlledInput } from "@/src/components/controlled-Input";
import { Layout } from "@/src/components/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Label, YStack } from "tamagui";
import { useLoginViewModel } from "./viewModel";

export const LoginView = ({
  control,
  onSubmit,
  isLoading,
  handleSubmit,
  handleGoToRegister,
}: ReturnType<typeof useLoginViewModel>) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <Layout>
      <Label fontSize={20} mb={"$4"}>
        Login to your account
      </Label>
      <YStack gap={"$6"} flex={1}>
        <YStack>
          <Label fontSize={16} mb={"$2"}>
            E-mail
          </Label>
          <ControlledInput
            fontSize={16}
            name="email"
            control={control}
            placeholder="Digite seu e-mail"
          />
        </YStack>

        <YStack>
          <Label fontSize={16} mb={"$2"}>
            Senha
          </Label>
          <ControlledInput
            fontSize={16}
            name="password"
            control={control}
            secureTextEntry
            placeholder="Digite sua senha"
          />
        </YStack>
      </YStack>

      <Button mb={bottom} onPress={handleSubmit(onSubmit)}>
        {isLoading ? "Loading..." : "Login"}
      </Button>
      <Button mb={bottom} onPress={handleGoToRegister}>
        Ir para Registro
      </Button>
    </Layout>
  );
};
