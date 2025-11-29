import { createWrapper } from "@/src/mock/provider";
import { Benchmark } from "@/src/models/benchmark";
import { WalletServiceInMemory } from "@/src/services/wallet/in-memory";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useAnalyticsViewModel } from "../viewModel";

const mockedService = new WalletServiceInMemory();

const sut = () =>
  renderHook(() => useAnalyticsViewModel({ walletService: mockedService }), {
    wrapper: createWrapper(),
  });

describe("Analytics - ViewModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load wallets on mount", async () => {
    const { result } = sut();

    await waitFor(() => {
      expect(result.current.isLoadingWallets).toBe(false);
      expect(result.current.walletData).toBeDefined();
    });
  });

  it("should start with isSelectingActive as false", () => {
    const { result } = sut();

    expect(result.current.isSelectingActive).toBe(false);
  });

  it("should toggle isSelectingActive when handleChangeIsSelectingActive is called", () => {
    const { result } = sut();

    expect(result.current.isSelectingActive).toBe(false);

    act(() => {
      result.current.handleChangeIsSelectingActive();
    });

    expect(result.current.isSelectingActive).toBe(true);

    act(() => {
      result.current.handleChangeIsSelectingActive();
    });

    expect(result.current.isSelectingActive).toBe(false);
  });

  it("should clear selections when exiting select mode", () => {
    const { result } = sut();

    act(() => {
      result.current.handleChangeIsSelectingActive();
    });

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleBenchmarkSelection(Benchmark.CDI);
    });

    expect(result.current.selectedWalletIds.size).toBe(1);
    expect(result.current.selectedBenchmark).toBe(Benchmark.CDI);

    act(() => {
      result.current.handleChangeIsSelectingActive();
    });

    expect(result.current.selectedWalletIds.size).toBe(0);
    expect(result.current.selectedBenchmark).toBeNull();
  });

  it("should toggle wallet selection", () => {
    const { result } = sut();

    act(() => {
      result.current.toggleWalletSelection(1);
    });

    expect(result.current.selectedWalletIds.has(1)).toBe(true);

    act(() => {
      result.current.toggleWalletSelection(1);
    });

    expect(result.current.selectedWalletIds.has(1)).toBe(false);
  });

  it("should allow selecting up to 2 wallets when no benchmark is selected", () => {
    const { result } = sut();

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleWalletSelection(2);
    });

    expect(result.current.selectedWalletIds.size).toBe(2);

    act(() => {
      result.current.toggleWalletSelection(3);
    });

    // Should still be 2, not allowing a 3rd
    expect(result.current.selectedWalletIds.size).toBe(2);
  });

  it("should only allow 1 wallet when a benchmark is selected", () => {
    const { result } = sut();

    act(() => {
      result.current.toggleBenchmarkSelection(Benchmark.IPCA);
      result.current.toggleWalletSelection(1);
    });

    expect(result.current.selectedWalletIds.size).toBe(1);

    act(() => {
      result.current.toggleWalletSelection(2);
    });

    // Should replace the first selection
    expect(result.current.selectedWalletIds.size).toBe(1);
    expect(result.current.selectedWalletIds.has(2)).toBe(true);
    expect(result.current.selectedWalletIds.has(1)).toBe(false);
  });

  it("should toggle benchmark selection", () => {
    const { result } = sut();

    act(() => {
      result.current.toggleBenchmarkSelection(Benchmark.CDI);
    });

    expect(result.current.selectedBenchmark).toBe(Benchmark.CDI);

    act(() => {
      result.current.toggleBenchmarkSelection(Benchmark.CDI);
    });

    expect(result.current.selectedBenchmark).toBeNull();
  });

  it("should clear excess wallets when selecting a benchmark with multiple wallets", () => {
    const { result } = sut();

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleWalletSelection(2);
    });

    expect(result.current.selectedWalletIds.size).toBe(2);

    act(() => {
      result.current.toggleBenchmarkSelection(Benchmark.SELIC);
    });

    // Should keep only the first wallet
    expect(result.current.selectedWalletIds.size).toBe(1);
    expect(result.current.selectedWalletIds.has(1)).toBe(true);
  });

  it("should set canCompare to true when 2 wallets are selected", () => {
    const { result } = sut();

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleWalletSelection(2);
    });

    expect(result.current.canCompare).toBe(true);
    expect(result.current.isWalletComparison).toBe(true);
  });

  it("should set canCompare to true when 1 wallet and 1 benchmark are selected", () => {
    const { result } = sut();

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleBenchmarkSelection(Benchmark.DOLLAR);
    });

    expect(result.current.canCompare).toBe(true);
    expect(result.current.isBenchmarkComparison).toBe(true);
  });

  it("should return correct compare button text for wallet comparison", () => {
    const { result } = sut();

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleWalletSelection(2);
    });

    expect(result.current.getCompareButtonText()).toBe("Comparar 2 Carteiras");
  });

  it("should return correct compare button text for benchmark comparison", () => {
    const { result } = sut();

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleBenchmarkSelection(Benchmark.IPCA);
    });

    expect(result.current.getCompareButtonText()).toBe("Comparar com IPCA");
  });

  it("should return default text when no valid comparison is selected", () => {
    const { result } = sut();

    expect(result.current.getCompareButtonText()).toBe(
      "Selecione itens para comparar"
    );
  });

  it("should set year values correctly", () => {
    const { result } = sut();

    const currentYear = new Date().getFullYear().toString();
    const lastYear = (new Date().getFullYear() - 1).toString();

    expect(result.current.currentYear).toBe(currentYear);
    expect(result.current.lastYear).toBe(lastYear);
    expect(result.current.initialYear).toBe(lastYear);
    expect(result.current.finalYear).toBe(currentYear);
  });

  it("should update initial and final year", () => {
    const { result } = sut();

    act(() => {
      result.current.setInitialYear("2020");
      result.current.setFinalYear("2023");
    });

    expect(result.current.initialYear).toBe("2020");
    expect(result.current.finalYear).toBe("2023");
  });

  it("should call onCompareTwoWallets when handleCompareTwoWallets is called with 2 wallets", async () => {
    const { result } = sut();
    const compareSpy = jest.spyOn(mockedService, "compareTwoWallets");

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleWalletSelection(2);
    });

    act(() => {
      result.current.handleCompare();
    });

    await waitFor(() => {
      expect(compareSpy).toHaveBeenCalled();
    });
  });

  it("should open comparison modal after successful wallet comparison", async () => {
    const { result } = sut();

    jest
      .spyOn(mockedService, "compareTwoWallets")
      .mockResolvedValue({} as any);

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleWalletSelection(2);
    });

    act(() => {
      result.current.handleCompare();
    });

    await waitFor(() => {
      expect(result.current.isComparisonModalOpen).toBe(true);
    });
  });

  it("should close comparison modal when closeComparisonModal is called", async () => {
    const { result } = sut();

    jest
      .spyOn(mockedService, "compareTwoWallets")
      .mockResolvedValue({} as any);

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleWalletSelection(2);
    });

    act(() => {
      result.current.handleCompare();
    });

    await waitFor(() => {
      expect(result.current.isComparisonModalOpen).toBe(true);
    });

    act(() => {
      result.current.closeComparisonModal();
    });

    expect(result.current.isComparisonModalOpen).toBe(false);
  });

  it("should call onCompareBenchmark when handleCompare is called with 1 wallet and benchmark", async () => {
    const { result } = sut();
    const compareSpy = jest.spyOn(mockedService, "comparePortfolioWithBenchmark");

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleBenchmarkSelection(Benchmark.CDI);
    });

    act(() => {
      result.current.handleCompare();
    });

    await waitFor(() => {
      expect(compareSpy).toHaveBeenCalled();
    });
  });

  it("should open benchmark modal after successful benchmark comparison", async () => {
    const { result } = sut();

    jest
      .spyOn(mockedService, "comparePortfolioWithBenchmark")
      .mockResolvedValue({} as any);

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleBenchmarkSelection(Benchmark.SELIC);
    });

    act(() => {
      result.current.handleCompare();
    });

    await waitFor(() => {
      expect(result.current.isBenchmarkModalOpen).toBe(true);
    });
  });

  it("should close benchmark modal when closeBenchmarkModal is called", async () => {
    const { result } = sut();

    jest
      .spyOn(mockedService, "comparePortfolioWithBenchmark")
      .mockResolvedValue({} as any);

    act(() => {
      result.current.toggleWalletSelection(1);
      result.current.toggleBenchmarkSelection(Benchmark.IPCA);
    });

    act(() => {
      result.current.handleCompare();
    });

    await waitFor(() => {
      expect(result.current.isBenchmarkModalOpen).toBe(true);
    });

    act(() => {
      result.current.closeBenchmarkModal();
    });

    expect(result.current.isBenchmarkModalOpen).toBe(false);
  });
});
