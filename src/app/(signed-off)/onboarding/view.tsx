import { images } from "@/src/assets";
import React, { useEffect } from "react";
import Animated, {
  Easing,
  FadeIn,
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Button, H6, Image, Paragraph, View, XStack, YStack } from "tamagui";
import { onboardingTexts } from "./constants/texts";
import { OnboardingSteps } from "./model";
import { useOnboardingViewModel } from "./viewModel";

const DURATION = 240;

export const OnboardingView = ({
  step,
  handleNextStep,
  handleGoToSignIn,
  handleGoToSignUp,
}: ReturnType<typeof useOnboardingViewModel>) => {
  const { title, description } = onboardingTexts[step];
  const float = useSharedValue(0);
  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const usePressScale = () => {
    const scale = useSharedValue(1);
    const style = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));
    const onPressIn = () => (scale.value = withTiming(0.98, { duration: 90 }));
    const onPressOut = () =>
      (scale.value = withTiming(1, {
        duration: 160,
        easing: Easing.out(Easing.quad),
      }));
    return { style, onPressIn, onPressOut };
  };

  const primaryPress = usePressScale();
  const secondaryPress = usePressScale();

  return (
    <YStack flex={1} bg={"$background"}>
      <Animated.View style={[{ width: "100%", height: 550 }]}>
        <Image
          src={images.onboarding.first}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Animated.View>

      <View
        position="absolute"
        bottom={0}
        w={"100%"}
        minHeight={350}
        bg={"white"}
        borderTopLeftRadius={"$10"}
        borderTopRightRadius={"$10"}
        shadowColor={"#000"}
        shadowOpacity={0.08}
        shadowRadius={12}
      >
        <YStack p={"$4"} gap={"$3"} justifyContent="space-between" flex={1}>
          <Animated.View
            key={`content-${step}`}
            entering={FadeInRight.duration(DURATION)}
            exiting={FadeOutLeft.duration(200)}
          >
            <YStack gap={"$2"} py={"$6"}>
              <H6 fontWeight={700} textAlign="center">
                {title}
              </H6>
              <Paragraph size={14} textAlign="center" opacity={0.85}>
                {description}
              </Paragraph>
            </YStack>
          </Animated.View>

          <XStack alignSelf="center" gap={"$2"}>
            {[0, 1, 2].map((i) => {
              const dotStyle = useAnimatedStyle(() => ({
                width: withTiming(step === i + 1 ? 20 : 8),
                height: 8,
                borderRadius: 999,
                backgroundColor: withTiming(
                  step === i + 1 ? "#2D6CF6" : "#C9D5FF",
                  { duration: 300 }
                ),
              }));

              return (
                <Animated.View
                  key={i}
                  entering={FadeIn.duration(160)}
                  exiting={FadeOut.duration(120)}
                  style={dotStyle}
                />
              );
            })}
          </XStack>

          {step === OnboardingSteps.THIRD ? (
            <XStack gap={"$2"}>
              <Animated.View style={[{ flex: 1 }, primaryPress.style]}>
                <Button
                  flex={1}
                  size={"$4"}
                  bg={"$blue10"}
                  color={"white"}
                  onPressIn={primaryPress.onPressIn}
                  onPressOut={primaryPress.onPressOut}
                  onPress={handleGoToSignIn}
                >
                  Entrar
                </Button>
              </Animated.View>

              <Animated.View style={[{ flex: 1 }, secondaryPress.style]}>
                <Button
                  flex={1}
                  size={"$4"}
                  color={"$blue10Dark"}
                  bg={"$backgroundTransparent"}
                  borderColor={"$blue10"}
                  onPressIn={secondaryPress.onPressIn}
                  onPressOut={secondaryPress.onPressOut}
                  onPress={handleGoToSignUp}
                >
                  Cadastrar
                </Button>
              </Animated.View>
            </XStack>
          ) : (
            <Animated.View style={primaryPress.style}>
              <Button
                size={"$4"}
                bg={"$blue10"}
                color={"white"}
                onPressIn={primaryPress.onPressIn}
                onPressOut={primaryPress.onPressOut}
                onPress={handleNextStep}
              >
                Começar
              </Button>
            </Animated.View>
          )}
        </YStack>
      </View>
    </YStack>
  );
};
