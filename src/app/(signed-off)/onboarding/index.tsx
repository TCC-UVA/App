import { OnboardingView } from "./view";
import { useOnboardingViewModel } from "./viewModel";

const Onboarding = () => {
  const methods = useOnboardingViewModel();
  return <OnboardingView {...methods} />;
};

export default Onboarding;
