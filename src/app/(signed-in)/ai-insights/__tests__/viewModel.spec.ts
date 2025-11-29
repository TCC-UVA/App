import { createWrapper } from "@/src/mock/provider";
import { WalletServiceInMemory } from "@/src/services/wallet/in-memory";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { act } from "react";
import { useAIInsightsViewModel } from "../viewModel";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

const mockedService = new WalletServiceInMemory();

const mockNonBenchmarkParams = {
  params: JSON.stringify({
    type: "normal",
    Assets: {
      "ABCD3.SA": "10.25%",
      "EFGH4.SA": "20.15%",
    },
    ConsolidatedProfitability: "15.20%",
    FinalDate: 2024,
    InitialDate: 2023,
    walletName: "Test Wallet",
  }),
};

const mockBenchmarkParams = {
  params: JSON.stringify({
    type: "benchmark",
    Benchmark: "IBOV",
    BenchmarkValue: "12.50%",
    PortfolioId: 1,
    Assets: {
      "ABCD3.SA": "10.25%",
      "EFGH4.SA": "20.15%",
    },
    ConsolidatedProfitability: "15.20%",
    FinalDate: 2024,
    InitialDate: 2023,
    walletName: "Benchmark Wallet",
  }),
};

const sut = () =>
  renderHook(() => useAIInsightsViewModel(mockedService), {
    wrapper: createWrapper(),
  });

describe("AIInsights - ViewModel", () => {
  const backMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      back: backMock,
    });
  });

  it("should parse non-benchmark params correctly", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockNonBenchmarkParams);

    const { result } = sut();

    expect(result.current.walletName).toBe("Test Wallet");
  });

  it("should parse benchmark params correctly", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockBenchmarkParams);

    const { result } = sut();

    expect(result.current.walletName).toBe("Benchmark Wallet");
  });

  it("should call getAIInsights for non-benchmark type", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockNonBenchmarkParams);

    const getAIInsightsSpy = jest.spyOn(mockedService, "getAIInsights");

    sut();

    await waitFor(() => {
      expect(getAIInsightsSpy).toHaveBeenCalledWith({
        Assets: {
          "ABCD3.SA": "10.25%",
          "EFGH4.SA": "20.15%",
        },
        ConsolidatedProfitability: "15.20%",
        FinalDate: 2024,
        InitialDate: 2023,
      });
    });
  });

  it("should call getAIInsightsBenchmark for benchmark type", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockBenchmarkParams);

    const getAIInsightsBenchmarkSpy = jest.spyOn(
      mockedService,
      "getAIInsightsBenchmark"
    );

    sut();

    await waitFor(() => {
      expect(getAIInsightsBenchmarkSpy).toHaveBeenCalledWith({
        Benchmark: "IBOV",
        BenchmarkValue: "12.50%",
        PortfolioId: 1,
        Assets: {
          "ABCD3.SA": "10.25%",
          "EFGH4.SA": "20.15%",
        },
        ConsolidatedProfitability: "15.20%",
        FinalDate: 2024,
        InitialDate: 2023,
      });
    });
  });

  it("should set isLoading to true while fetching insights", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockNonBenchmarkParams);

    jest
      .spyOn(mockedService, "getAIInsights")
      .mockImplementation(() => new Promise(() => {}));

    const { result } = sut();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });

  it("should set isLoading to false after fetching insights", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockNonBenchmarkParams);

    jest
      .spyOn(mockedService, "getAIInsights")
      .mockResolvedValue("These are the AI-generated insights for your wallet.");

    const { result } = sut();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.insights).toBe(
        "These are the AI-generated insights for your wallet."
      );
    });
  });

  it("should have error as false when insights fetch is successful", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockNonBenchmarkParams);

    jest
      .spyOn(mockedService, "getAIInsights")
      .mockResolvedValue("AI insights response");

    const { result } = sut();

    await waitFor(() => {
      expect(result.current.error).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("should navigate back when handleGoBack is called", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockNonBenchmarkParams);

    const { result } = sut();

    act(() => {
      result.current.handleGoBack();
    });

    expect(backMock).toHaveBeenCalledTimes(1);
  });

  it("should return insights data when successfully fetched", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockNonBenchmarkParams);

    jest
      .spyOn(mockedService, "getAIInsights")
      .mockResolvedValue("These are the AI-generated insights for your wallet.");

    const { result } = sut();

    await waitFor(() => {
      expect(result.current.insights).toBe(
        "These are the AI-generated insights for your wallet."
      );
      expect(result.current.error).toBe(false);
    });
  });

  it("should handle benchmark insights successfully", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockBenchmarkParams);

    jest
      .spyOn(mockedService, "getAIInsightsBenchmark")
      .mockResolvedValue(
        "These are the AI-generated benchmark insights for your wallet."
      );

    const { result } = sut();

    await waitFor(() => {
      expect(result.current.insights).toBe(
        "These are the AI-generated benchmark insights for your wallet."
      );
      expect(result.current.error).toBe(false);
    });
  });
});
