import { images } from "@/src/assets";
import { Button, H6, Image, Paragraph, View, XStack, YStack } from "tamagui";
import { onboardingTexts } from "./constants/texts";
import { OnboardingSteps } from "./model";
import { useOnboardingViewModel } from "./viewModel";
export const OnboardingView = ({
  step,
  handleNextStep,
  handleGoToSignIn,
  handleGoToSignUp,
}: ReturnType<typeof useOnboardingViewModel>) => {
  const { title, description } = onboardingTexts[step];
  return (
    <YStack flex={1} background={"red"}>
      <Image
        src={images.onboarding.first}
        width="100%"
        height="550"
        objectFit="cover"
      />
      <View
        position="absolute"
        bottom={0}
        w={"100%"}
        h={350}
        bg={"white"}
        borderTopLeftRadius={"$10"}
        borderTopRightRadius={"$10"}
      >
        <YStack p={"$4"} gap={"$3"} justifyContent="space-between" flex={1}>
          <YStack gap={"$2"} py={"$6"}>
            <H6 fontWeight={600} textAlign="center">
              {title}
            </H6>
            <Paragraph size={14} textAlign="center">
              {description}
            </Paragraph>
          </YStack>

          {step === OnboardingSteps.THIRD ? (
            <XStack gap={"$2"}>
              <Button
                flex={1}
                size={"$4"}
                bg={"$blue10"}
                color={"white"}
                onPress={handleGoToSignIn}
              >
                Entrar
              </Button>
              <Button
                flex={1}
                size={"$4"}
                color={"$blue10Dark"}
                bg={"$backgroundTransparent"}
                borderColor={"$blue10"}
                onPress={handleGoToSignUp}
              >
                Cadastrar
              </Button>
            </XStack>
          ) : (
            <Button
              size={"$4"}
              bg={"$blue10"}
              color={"white"}
              onPress={handleNextStep}
            >
              Começar
            </Button>
          )}
        </YStack>
      </View>
    </YStack>
  );
};
