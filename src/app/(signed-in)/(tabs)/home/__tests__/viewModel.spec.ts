import { createWrapper } from "@/src/mock/provider";
import { Wallet } from "@/src/models";
import { WalletServiceInMemory } from "@/src/services/wallet/in-memory";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { useHomeViewModel } from "../viewModel";

const mockedService = new WalletServiceInMemory();

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

const sut = () =>
  renderHook(() => useHomeViewModel(mockedService), {
    wrapper: createWrapper(),
  });

describe("Home - ViewModel", () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  (useRouter as jest.Mock).mockReturnValue({
    navigate: navigateMock,
    push: jest.fn(),
    back: jest.fn(),
  });

  it("Should handleGoToCreateWallet navigate to create wallet screen", async () => {
    const { result } = sut();

    result.current.handleGoToCreateWallet();

    expect(navigateMock).toHaveBeenCalledWith(
      "/(signed-in)/(create-portfolio)/create"
    );
  });

  it("Should handleEditWallet navigate to edit wallet screen", async () => {
    const { result } = sut();

    const wallet = {
      Assets: [],
      PortfolioId: 1,
      name: "Carteira Teste",
    } as Wallet;

    result.current.handleEditWallet(wallet);

    expect(useRouter().push).toHaveBeenCalledWith(
      `/(signed-in)/(create-portfolio)/edit-portfolio?wallet=${encodeURIComponent(
        JSON.stringify(wallet)
      )}`
    );
  });

  it("Should filter wallets by search term", async () => {
    const { result } = sut();

    act(() => {
      result.current.handleChangeDraftSearch("carteira");
    });

    act(() => {
      result.current.handleApplySearch();
    });

    await waitFor(() => {
      expect(result.current.wallets).toHaveLength(1);
      expect(result.current.wallets?.[0].name).toBe("carteira");
    });
  });

  it("Should update search term when handleChangeDraftSearch is called", () => {
    const { result } = sut();

    act(() => {
      result.current.handleChangeDraftSearch("test search");
    });

    expect(result.current.draftSearch).toBe("test search");
  });

  it("should return all wallets when search term is empty", async () => {
    const { result } = sut();

    result.current.handleChangeDraftSearch("");
    result.current.handleApplySearch();

    await waitFor(() => {
      expect(result.current.wallets).toHaveLength(3);
    });
  });

  it("should start screen with loading state", () => {
    jest
      .spyOn(mockedService, "findAll")
      .mockImplementationOnce(() => new Promise(() => {}));
    const { result } = sut();

    expect(result.current.isLoading).toBe(true);
  });
  it("should end loading state after fetching wallets", async () => {
    const { result } = sut();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.wallets).toHaveLength(3);
  });

  it("Should return empty wallets list if search didnt found one wallet", async () => {
    const { result } = sut();

    act(() => {
      result.current.handleChangeDraftSearch("fake wallet");
    });

    act(() => {
      result.current.handleApplySearch();
    });

    await waitFor(() => {
      expect(result.current.wallets).toHaveLength(0);
    });
  });

  it("should return all wallets when search term is cleared", async () => {
    const { result } = sut();

    act(() => {
      result.current.handleChangeDraftSearch("carteira");
    });

    act(() => {
      result.current.handleApplySearch();
    });

    await waitFor(() => {
      expect(result.current.wallets).toHaveLength(1);
    });

    act(() => {
      result.current.handleChangeDraftSearch("");
    });

    act(() => {
      result.current.handleApplySearch();
    });

    await waitFor(() => {
      expect(result.current.wallets).toHaveLength(3);
    });
  });

  it("should selected wallet when handleOpenDetails is called", async () => {
    const { result } = sut();

    const wallet = {
      Assets: [],
      PortfolioId: 1,
      name: "Carteira Teste",
    } as Wallet;

    act(() => {
      result.current.handleOpenDetails(wallet);
    });

    await waitFor(() => {
      expect(result.current.selectedWallet).toBe(wallet);
      expect(result.current.isDetailsModalOpen).toBe(true);
    });
  });

  it("should call handleGetMetrics when handleOpenDetails is called", async () => {
    const { result } = sut();
    const mockedServiceSpy = jest.spyOn(mockedService, "getProfitsByWalletId");

    const wallet = {
      Assets: [],
      PortfolioId: 1,
      name: "Carteira Teste",
    } as Wallet;

    act(() => {
      result.current.handleOpenDetails(wallet);
    });

    await waitFor(() => {
      expect(mockedServiceSpy).toHaveBeenCalledWith({
        walletId: wallet.PortfolioId,
        initial_year: (new Date().getFullYear() - 1).toString(),
        final_year: new Date().getFullYear().toString(),
      });
    });
  });

  it("should clear selected wallet when handleCloseDetails is called", async () => {
    const { result } = sut();

    const wallet = {
      Assets: [],
      PortfolioId: 1,
      name: "Carteira Teste",
    } as Wallet;

    act(() => {
      result.current.handleOpenDetails(wallet);
    });

    await waitFor(() => {
      expect(result.current.selectedWallet).toBe(wallet);
      expect(result.current.isDetailsModalOpen).toBe(true);
    });

    act(() => {
      result.current.handleCloseDetails();
    });

    await waitFor(() => {
      expect(result.current.selectedWallet).toBeNull();
      expect(result.current.isDetailsModalOpen).toBe(false);
    });
  });

  it("Should escape from get AI insights if walletProfitData or selectedWallet is null", async () => {
    const { result } = sut();

    act(() => {
      result.current.handleGetAIInsights();
    });

    expect(useRouter().push).not.toHaveBeenCalled();
  });

  it("Should navigate to AI insights screen with correct params", async () => {
    const { result } = sut();

    const wallet = {
      Assets: [],
      PortfolioId: 1,
      name: "Carteira Teste",
    } as Wallet;

    act(() => {
      result.current.handleOpenDetails(wallet);
    });

    await waitFor(() => {
      expect(result.current.selectedWallet).toBe(wallet);
      expect(result.current.walletProfitData).toBeDefined();
    });

    act(() => {
      result.current.handleGetAIInsights();
    });

    const expectedParams = JSON.stringify({
      InitialDate: Number((new Date().getFullYear() - 1).toString()),
      FinalDate: Number(new Date().getFullYear().toString()),
      ConsolidatedProfitability: "4.56%",
      Assets: {
        "ABCD3.SA": "10.25%",
        "EFGH4.SA": "20.15%",
        "IJKL4.SA": "5.50%",
      },
      walletName: wallet.name,
    });

    expect(useRouter().push).toHaveBeenCalledWith({
      pathname: "/(signed-in)/ai-insights",
      params: {
        params: expectedParams,
      },
    });
  });

  it("should close details modal when handleGetAIInsights is called", async () => {
    const { result } = sut();

    const wallet = {
      Assets: [],
      PortfolioId: 1,
      name: "Carteira Teste",
    } as Wallet;

    act(() => {
      result.current.handleOpenDetails(wallet);
    });

    await waitFor(() => {
      expect(result.current.selectedWallet).toBe(wallet);
      expect(result.current.walletProfitData).toBeDefined();
    });

    act(() => {
      result.current.handleGetAIInsights();
    });

    expect(result.current.isDetailsModalOpen).toBe(false);
  });
});
