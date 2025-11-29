import { createWrapper } from "@/src/mock/provider";
import { Quote } from "@/src/models/quote";
import { StockService } from "@/src/services/stocks";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { CreatePortfolioProvider } from "../../context";
import { useSelectStocksViewModel } from "../viewModel";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

const mockStocks: Quote[] = [
  {
    symbol: "PETR4.SA",
    shortname: "Petrobras PN",
    longname: "Petróleo Brasileiro S.A.",
    exchange: "SAO",
    quoteType: "EQUITY",
    index: "IBOV",
    score: 100,
    typeDisp: "Equity",
    exchDisp: "São Paulo",
    sector: "Energy",
    sectorDisp: "Energia",
    industry: "Oil & Gas",
    industryDisp: "Petróleo e Gás",
    dispSecIndFlag: true,
    isYahooFinance: true,
  },
  {
    symbol: "VALE3.SA",
    shortname: "Vale ON",
    longname: "Vale S.A.",
    exchange: "SAO",
    quoteType: "EQUITY",
    index: "IBOV",
    score: 95,
    typeDisp: "Equity",
    exchDisp: "São Paulo",
    sector: "Basic Materials",
    sectorDisp: "Materiais Básicos",
    industry: "Metals & Mining",
    industryDisp: "Metais e Mineração",
    dispSecIndFlag: true,
    isYahooFinance: true,
  },
];

const mockStockService: StockService = {
  get: jest.fn().mockResolvedValue([]),
  searchAssets: jest.fn().mockResolvedValue({ quotes: mockStocks }),
};

const sut = (params = {}) =>
  renderHook(() => useSelectStocksViewModel(mockStockService), {
    wrapper: ({ children }) =>
      createWrapper()({
        children: React.createElement(
          CreatePortfolioProvider,
          null,
          children
        ),
      }),
  });

describe("SelectStocks - ViewModel", () => {
  const pushMock = jest.fn();
  const backMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      back: backMock,
    });
    (useLocalSearchParams as jest.Mock).mockReturnValue({});
  });

  it("should initialize with empty selected stocks", () => {
    const { result } = sut();

    expect(result.current.selectedStocks).toEqual([]);
  });

  it("should initialize with search query empty", () => {
    const { result } = sut();

    expect(result.current.searchQuery).toBe("");
  });

  it("should initialize with dropdown open", () => {
    const { result } = sut();

    expect(result.current.isDropdownOpen).toBe(true);
  });

  it("should go back when handleGoBack is called", () => {
    const { result } = sut();

    act(() => {
      result.current.handleGoBack();
    });

    expect(backMock).toHaveBeenCalledTimes(1);
  });

  it("should update search query when handleSearchChange is called", () => {
    const { result } = sut();

    act(() => {
      result.current.handleSearchChange("PETR");
    });

    expect(result.current.searchQuery).toBe("PETR");
  });

  it("should toggle dropdown when toggleDropdown is called", () => {
    const { result } = sut();

    expect(result.current.isDropdownOpen).toBe(true);

    act(() => {
      result.current.toggleDropdown();
    });

    expect(result.current.isDropdownOpen).toBe(false);

    act(() => {
      result.current.toggleDropdown();
    });

    expect(result.current.isDropdownOpen).toBe(true);
  });

  it("should add stock to selectedStocks when handleSelectStock is called", () => {
    const { result } = sut();

    act(() => {
      result.current.handleSelectStock(mockStocks[0]);
    });

    expect(result.current.selectedStocks).toHaveLength(1);
    expect(result.current.selectedStocks[0].symbol).toBe("PETR4.SA");
  });

  it("should remove stock from selectedStocks when already selected", () => {
    const { result } = sut();

    act(() => {
      result.current.handleSelectStock(mockStocks[0]);
    });

    expect(result.current.selectedStocks).toHaveLength(1);

    act(() => {
      result.current.handleSelectStock(mockStocks[0]);
    });

    expect(result.current.selectedStocks).toHaveLength(0);
  });

  it("should close dropdown when selecting 3rd stock", () => {
    const { result } = sut();

    const mockStock3 = { ...mockStocks[0], symbol: "ITUB4.SA" };

    act(() => {
      result.current.handleSelectStock(mockStocks[0]);
      result.current.handleSelectStock(mockStocks[1]);
    });

    expect(result.current.isDropdownOpen).toBe(true);

    act(() => {
      result.current.handleSelectStock(mockStock3);
    });

    expect(result.current.isDropdownOpen).toBe(false);
  });

  it("should not navigate when handleConfirm is called with no stocks selected", () => {
    const { result } = sut();

    act(() => {
      result.current.handleConfirm();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should navigate to allocate-quantities when handleConfirm is called with stocks selected", () => {
    const { result } = sut();

    act(() => {
      result.current.handleSelectStock(mockStocks[0]);
    });

    act(() => {
      result.current.handleConfirm();
    });

    expect(pushMock).toHaveBeenCalledWith({
      pathname: "/(signed-in)/(create-portfolio)/allocate-quantities",
    });
  });

  it("should search stocks when query has 3+ characters", async () => {
    const { result } = sut();
    const searchSpy = jest.spyOn(mockStockService, "searchAssets");

    act(() => {
      result.current.handleSearchChange("PET");
    });

    await waitFor(() => {
      expect(searchSpy).toHaveBeenCalled();
    }, { timeout: 500 });
  });

  it("should handle edit mode correctly", () => {
    const mockWallet = {
      PortfolioId: 1,
      name: "Test Wallet",
      Assets: [
        { name: "PETR4.SA", allocation: 50 },
        { name: "VALE3.SA", allocation: 50 },
      ],
    };

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      wallet: JSON.stringify(mockWallet),
      mode: "edit",
    });

    const { result } = sut();

    expect(result.current).toBeDefined();
  });

  it("should filter out existing assets in edit mode", async () => {
    const mockWallet = {
      PortfolioId: 1,
      name: "Test Wallet",
      Assets: [{ name: "PETR4.SA", allocation: 50 }],
    };

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      wallet: JSON.stringify(mockWallet),
      mode: "edit",
    });

    const { result } = sut();

    act(() => {
      result.current.handleSearchChange("PETR");
    });

    await waitFor(() => {
      expect(result.current.stocks).toBeDefined();
      if (result.current.stocks) {
        expect(
          result.current.stocks.some((s) => s.symbol === "PETR4.SA")
        ).toBe(false);
      }
    });
  });

  it("should navigate with portfolio id in edit mode", () => {
    const mockWallet = {
      PortfolioId: 123,
      name: "Test Wallet",
      Assets: [],
    };

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      wallet: JSON.stringify(mockWallet),
      mode: "edit",
    });

    const { result } = sut();

    const newStock = { ...mockStocks[0], symbol: "ITUB4.SA" };

    act(() => {
      result.current.handleSelectStock(newStock);
    });

    act(() => {
      result.current.handleConfirm();
    });

    expect(pushMock).toHaveBeenCalledWith({
      pathname: "/(signed-in)/(create-portfolio)/allocate-quantities",
      params: {
        id: 123,
      },
    });
  });
});
