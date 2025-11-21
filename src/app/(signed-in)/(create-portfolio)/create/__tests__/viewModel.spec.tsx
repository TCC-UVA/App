import { createWrapper } from "@/src/mock/provider";
import { act, renderHook } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import {
  CreatePortfolioProvider,
  useCreatePortfolioContext,
} from "../../context";
import { useCreateWalletViewModel } from "../viewModel";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("Create Portfolio - ViewModel", () => {
  const navigateMock = jest.fn();
  const backMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      navigate: navigateMock,
      push: jest.fn(),
      back: backMock,
    });
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(
      () => ({
        viewModel: useCreateWalletViewModel(),
        context: useCreatePortfolioContext(),
      }),
      {
        wrapper: ({ children }) =>
          createWrapper()({
            children: (
              <CreatePortfolioProvider>{children}</CreatePortfolioProvider>
            ),
          }),
      }
    );

    expect(result.current.context.name).toBe("");
  });

  it("should go back when handleGoBack is called", () => {
    const { result } = renderHook(() => useCreateWalletViewModel(), {
      wrapper: ({ children }) =>
        createWrapper()({
          children: (
            <CreatePortfolioProvider>{children}</CreatePortfolioProvider>
          ),
        }),
    });

    act(() => {
      result.current.handleGoBack();
    });

    expect(backMock).toHaveBeenCalled();
  });

  it("should set name and navigate to select-stocks on valid submission", () => {
    const { result } = renderHook(
      () => ({
        viewModel: useCreateWalletViewModel(),
        context: useCreatePortfolioContext(),
      }),
      {
        wrapper: ({ children }) =>
          createWrapper()({
            children: (
              <CreatePortfolioProvider>{children}</CreatePortfolioProvider>
            ),
          }),
      }
    );

    const testName = "My Wallet";

    act(() => {
      result.current.viewModel.onSubmit({ name: testName });
    });

    expect(result.current.context.name).toBe(testName);
    expect(navigateMock).toHaveBeenCalledWith(
      "/(signed-in)/(create-portfolio)/select-stocks"
    );
  });

  it("should not navigate on invalid submission", async () => {
    const { result } = renderHook(
      () => ({
        viewModel: useCreateWalletViewModel(),
        context: useCreatePortfolioContext(),
      }),
      {
        wrapper: ({ children }) =>
          createWrapper()({
            children: (
              <CreatePortfolioProvider>{children}</CreatePortfolioProvider>
            ),
          }),
      }
    );

    await act(async () => {
      await result.current.viewModel.handleSubmit(
        result.current.viewModel.onSubmit
      )();
    });

    expect(result.current.context.name).toBe("");
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
