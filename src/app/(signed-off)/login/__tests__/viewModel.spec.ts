import { createWrapper } from "@/src/mock/provider";
import { AuthService } from "@/src/services/auth";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { act } from "react";
import { useLoginViewModel } from "../viewModel";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

const fakeService: AuthService = {
  login: jest.fn(),
  register: jest.fn(),
};

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const sut = () =>
  renderHook(() => useLoginViewModel(fakeService), {
    wrapper: createWrapper(),
  });

describe("Login - ViewModel", () => {
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

  it("should call login mutation with correct credentials when submitted", async () => {
    const { result } = sut();
    const loginSpy = jest.spyOn(fakeService, "login").mockResolvedValue({
      access_token: "mock-token",
      email: "mocked@test.com",
      username: "mockedUser",
    });

    const mockedData = {
      email: "mocked@test.com",
      password: "mockedPassword123",
    };

    result.current.onSubmit(mockedData);

    await waitFor(async () => {
      expect(loginSpy).toHaveBeenCalledWith({
        email: "mocked@test.com",
        password: "mockedPassword123",
      });
      expect(loginSpy).toHaveBeenCalledTimes(1);

      const response = await loginSpy.mock.results[0].value;

      expect(response).toEqual({
        access_token: "mock-token",
        email: "mocked@test.com",
        username: "mockedUser",
      });
    });
  });
  it("should set isLoading to true while mutation is pending", async () => {
    const { result } = sut();

    jest
      .spyOn(fakeService, "login")
      .mockImplementation(() => new Promise(() => {}));

    expect(result.current.isLoading).toBe(false);

    result.current.onSubmit({
      email: "mocked@test.com",
      password: "mockedPassword123",
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });

  it("should navigate to register screen when handleGoToRegister is called", () => {
    const { result } = sut();

    act(() => {
      result.current.handleGoToRegister();
    });

    expect(navigateMock).toHaveBeenCalledWith("/(signed-off)/register");
    expect(navigateMock).toHaveBeenCalledTimes(1);
  });

  it("should set isLoading to false after successful login", async () => {
    const { result } = sut();

    jest.spyOn(fakeService, "login").mockResolvedValue({
      access_token: "mock-token",
      email: "mocked@test.com",
      username: "mockedUser",
    });

    expect(result.current.isLoading).toBe(false);

    result.current.onSubmit({
      email: "mocked@test.com",
      password: "mockedPassword123",
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should set isLoading to false after login failure", async () => {
    const { result } = sut();

    jest
      .spyOn(fakeService, "login")
      .mockRejectedValue(new Error("Login failed"));

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      result.current.onSubmit({
        email: "mocked@test.com",
        password: "wrongPassword",
      });
    });

    await waitFor(async () => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
    });
  });
  it("should focus password input when handleFocusPasswordInput is called", () => {
    const { result } = sut();
    const setFocusSpy = jest.spyOn(result.current, "handleFocusPasswordInput");

    act(() => {
      result.current.handleFocusPasswordInput();
    });

    expect(setFocusSpy).toHaveBeenCalledTimes(1);
  });
  it("should navigate to home screen after successful login", async () => {
    const { result } = sut();

    jest.spyOn(fakeService, "login").mockResolvedValue({
      access_token: "mock-token",
      email: "mocked@test.com",
      username: "mockedUser",
    });

    act(() => {
      result.current.onSubmit({
        email: "mocked@test.com",
        password: "mockedPassword123",
      });
    });

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/(signed-in)/(tabs)/home");
      expect(replaceMock).toHaveBeenCalledTimes(1);
    });
  });
});
