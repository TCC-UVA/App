import { fireEvent, render } from "@testing-library/react-native";
import { WrapperUi } from "../../../../mock/provider";
import { onboardingTexts } from "../constants/texts";
import { OnboardingView } from "../view";
import { useOnboardingViewModel } from "../viewModel";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  Link: ({ children }: any) => children,
}));

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    Ionicons: View,
  };
});

const sut = (
  customProps?: Partial<ReturnType<typeof useOnboardingViewModel>>
) => {
  const defaultStep = customProps?.step || 1;
  const methods = {
    step: defaultStep,
    handleNextStep: jest.fn(),
    handleGoToSignIn: jest.fn(),
    handleGoToSignUp: jest.fn(),
    ...customProps,
  } as ReturnType<typeof useOnboardingViewModel>;

  return render(
    <WrapperUi>
      <OnboardingView {...methods} />
    </WrapperUi>
  );
};

describe("Onboarding - View", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should render first step with correct texts from onboardingTexts constant", () => {
    const { getByText } = sut();

    expect(getByText(onboardingTexts[1].title)).toBeOnTheScreen();
    expect(getByText(onboardingTexts[1].description)).toBeOnTheScreen();
    expect(getByText("Começar")).toBeOnTheScreen();
  });

  it("Should render second step with correct texts from onboardingTexts constant", () => {
    const { getByText } = sut({ step: 2 });

    expect(getByText(onboardingTexts[2].title)).toBeOnTheScreen();
    expect(getByText(onboardingTexts[2].description)).toBeOnTheScreen();
    expect(getByText("Começar")).toBeOnTheScreen();
  });

  it("Should render third step with correct texts from onboardingTexts constant", () => {
    const { getByText } = sut({ step: 3 });

    expect(getByText(onboardingTexts[3].title)).toBeOnTheScreen();
    expect(getByText(onboardingTexts[3].description)).toBeOnTheScreen();
    expect(getByText("Entrar")).toBeOnTheScreen();
    expect(getByText("Cadastrar")).toBeOnTheScreen();
  });

  it("Should call handleNextStep when Começar button is pressed on first step", () => {
    const handleNextStep = jest.fn();
    const { getByText } = sut({ handleNextStep });

    fireEvent.press(getByText("Começar"));

    expect(handleNextStep).toHaveBeenCalledTimes(1);
  });

  it("Should call handleGoToSignIn when Entrar button is pressed on third step", () => {
    const handleGoToSignIn = jest.fn();
    const { getByText } = sut({ step: 3, handleGoToSignIn });

    fireEvent.press(getByText("Entrar"));

    expect(handleGoToSignIn).toHaveBeenCalledTimes(1);
  });

  it("Should call handleGoToSignUp when Cadastrar button is pressed on third step", () => {
    const handleGoToSignUp = jest.fn();
    const { getByText } = sut({ step: 3, handleGoToSignUp });

    fireEvent.press(getByText("Cadastrar"));

    expect(handleGoToSignUp).toHaveBeenCalledTimes(1);
  });
});
