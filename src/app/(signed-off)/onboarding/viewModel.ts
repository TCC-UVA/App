import { useRouter } from "expo-router";
import { useState } from "react";
import { OnboardingSteps } from "./model";

export const useOnboardingViewModel = () => {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingSteps>(OnboardingSteps.FIRST);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleGoToSignIn = () => {
    router.replace("/(signed-off)/login");
  };

  const handleGoToSignUp = () => {
    router.replace("/(signed-off)/register");
  };

  return { step, handleNextStep, handleGoToSignIn, handleGoToSignUp };
};
