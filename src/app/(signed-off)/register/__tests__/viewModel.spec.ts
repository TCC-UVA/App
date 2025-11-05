import { createWrapper } from "@/src/mock/provider";
import { AuthService } from "@/src/services/auth";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useRegisterViewModel } from "../viewModel";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));

const fakeService: AuthService = {
  login: jest.fn(),
  register: jest.fn(),
};

const sut = () =>
  renderHook(() => useRegisterViewModel(fakeService), {
    wrapper: createWrapper(),
  });

describe("Register - ViewModel", () => {
  const navigateMock = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    (useRouter as jest.Mock).mockReturnValue({
      navigate: navigateMock,
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    });

    (useForm as jest.Mock).mockReturnValue({
      handleSubmit: jest.fn((fn) => fn),
      control: {},
      trigger: jest.fn().mockResolvedValue(true),
      setValue: jest.fn(),
    });
  });

  it("should call register mutation with correct credentials when submitted", async () => {
    const { result } = sut();
    const registerSpy = jest.spyOn(fakeService, "register");

    const mockedData = {
      email: "mocked@test.com",
      password: "mockedPassword123",
      name: "Mocked User",
      birthDate: "01/01/1990",
      confirmPassword: "mockedPassword123",
    };

    result.current.onSubmit(mockedData);

    const { confirmPassword, ...expectedData } = mockedData;
    await waitFor(async () => {
      expect(registerSpy).toHaveBeenCalledWith({
        ...expectedData,
        birthDate: "1990-01-01",
      });
      expect(registerSpy).toHaveBeenCalledTimes(1);
    });
  });
  it("should set isLoading to true while mutation is pending", async () => {
    const { result } = sut();

    jest
      .spyOn(fakeService, "register")
      .mockImplementation(() => new Promise(() => {}));

    expect(result.current.isLoading).toBe(false);

    const mockedData = {
      email: "mocked@test.com",
      password: "mockedPassword123",
      name: "Mocked User",
      confirmPassword: "mockedPassword123",
      birthDate: "01/01/1990",
    };

    result.current.onSubmit(mockedData);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });

  it("should navigate to register screen when handleGoToLogin is called", () => {
    const { result } = sut();

    act(() => {
      result.current.handleGoToLogin();
    });

    expect(navigateMock).toHaveBeenCalledWith("/(signed-off)/login");
    expect(navigateMock).toHaveBeenCalledTimes(1);
  });

  it("should navigate between steps correctly", async () => {
    const { result } = sut();

    expect(result.current.currentStep).toBe(1);

    await act(async () => {
      await result.current.handleNextStep();
    });

    await waitFor(async () => {
      expect(result.current.currentStep).toBe(2);
    });

    act(() => {
      result.current.handlePreviousStep();
    });

    expect(result.current.currentStep).toBe(1);
  });
});
