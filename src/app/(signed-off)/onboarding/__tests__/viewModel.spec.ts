import { createWrapper } from "@/src/mock/provider";
import { act, renderHook } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { OnboardingSteps } from "../model";
import { useOnboardingViewModel } from "../viewModel";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

const sut = () =>
  renderHook(() => useOnboardingViewModel(), {
    wrapper: createWrapper(),
  });

describe("Onboarding - ViewModel", () => {
  const navigateMock = jest.fn();
  const replaceMock = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    (useRouter as jest.Mock).mockReturnValue({
      navigate: navigateMock,
      push: jest.fn(),
      replace: replaceMock,
      back: jest.fn(),
    });
  });

  it("Should start in first step", () => {
    const { result } = sut();

    expect(result.current.step).toBe(OnboardingSteps.FIRST);
  });

  it('Should go to next step when "handleNextStep" is called', () => {
    const { result } = sut();

    act(() => {
      result.current.handleNextStep();
    });

    expect(result.current.step).toBe(OnboardingSteps.SECOND);

    act(() => {
      result.current.handleNextStep();
    });

    expect(result.current.step).toBe(OnboardingSteps.THIRD);
  });

  it('Should navigate to sign in when "handleGoToSignIn" is called', () => {
    const { result } = sut();

    act(() => {
      result.current.handleGoToSignIn();
    });

    expect(replaceMock).toHaveBeenCalledWith("/(signed-off)/login");
  });

  it('Should navigate to sign up when "handleGoToSignUp" is called', () => {
    const { result } = sut();

    act(() => {
      result.current.handleGoToSignUp();
    });

    expect(replaceMock).toHaveBeenCalledWith("/(signed-off)/register");
  });
});
