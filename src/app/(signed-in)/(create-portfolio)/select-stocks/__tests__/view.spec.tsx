import { WrapperUi } from "@/src/mock/provider";
import { Quote } from "@/src/models/quote";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { SelectStocksView } from "../view";
import { useSelectStocksViewModel } from "../viewModel";

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  Link: ({ children }: any) => children,
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: (props: any) => React.createElement(Text, props, props.name),
  };
});

jest.mock("../components/empty", () => ({
  Empty: () => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, "Nenhum resultado encontrado");
  },
}));

jest.mock("../components/stock-card", () => ({
  StockCard: ({ item }: any) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, item.shortname);
  },
}));

jest.mock("@/src/components/float-button", () => ({
  FloatButton: ({ text, handleConfirm }: any) => {
    const React = require("react");
    const { TouchableOpacity, Text } = require("react-native");
    return React.createElement(
      TouchableOpacity,
      { onPress: handleConfirm },
      React.createElement(Text, null, text)
    );
  },
}));

const mockedHandleSelectStock = jest.fn();
const mockedHandleConfirm = jest.fn();
const mockedHandleGoBack = jest.fn();
const mockedHandleSearchChange = jest.fn();
const mockedToggleDropdown = jest.fn();

const mockStock: Quote = {
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
};

const sut = (
  customProps?: Partial<ReturnType<typeof useSelectStocksViewModel>>
) => {
  const methods = {
    stocks: [],
    selectedStocks: [],
    isLoading: false,
    handleSelectStock: mockedHandleSelectStock,
    handleConfirm: mockedHandleConfirm,
    handleGoBack: mockedHandleGoBack,
    searchQuery: "",
    handleSearchChange: mockedHandleSearchChange,
    isDropdownOpen: true,
    toggleDropdown: mockedToggleDropdown,
    ...customProps,
  } as ReturnType<typeof useSelectStocksViewModel>;

  return render(
    <WrapperUi>
      <SelectStocksView {...methods} />
    </WrapperUi>
  );
};

describe("SelectStocks - View", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should render screen title", () => {
    const { getByText } = sut();

    expect(getByText("Selecionar Ações")).toBeTruthy();
  });

  it("should show selected stocks count", () => {
    const { getByText } = sut({ selectedStocks: [mockStock] });

    expect(getByText("1 ações selecionadas")).toBeTruthy();
  });

  it("should show zero selected stocks initially", () => {
    const { getByText } = sut();

    expect(getByText("0 ações selecionadas")).toBeTruthy();
  });

  it("should call handleGoBack when back button is pressed", () => {
    const { getByText } = sut();

    const backButton = getByText("arrow-back").parent;
    if (backButton) {
      fireEvent.press(backButton);
      expect(mockedHandleGoBack).toHaveBeenCalledTimes(1);
    }
  });

  it("should render search input with correct placeholder", () => {
    const { getByPlaceholderText } = sut();

    expect(getByPlaceholderText("Digite 3 letras para buscar")).toBeTruthy();
  });

  it("should call handleSearchChange when typing in search input", () => {
    const { getByPlaceholderText } = sut();

    const searchInput = getByPlaceholderText("Digite 3 letras para buscar");
    fireEvent.changeText(searchInput, "PETR");

    expect(mockedHandleSearchChange).toHaveBeenCalledWith("PETR");
  });

  it("should show clear button when search query is not empty", () => {
    const { getByText } = sut({ searchQuery: "PETR" });

    expect(getByText("close-circle")).toBeTruthy();
  });

  it("should call handleSearchChange with empty string when clear button is pressed", () => {
    const { getByText } = sut({ searchQuery: "PETR" });

    const clearButton = getByText("close-circle").parent;
    if (clearButton) {
      fireEvent.press(clearButton);
      expect(mockedHandleSearchChange).toHaveBeenCalledWith("");
    }
  });

  it("should render empty state when no stocks are available", () => {
    const { getByText } = sut({ stocks: [] });

    expect(getByText("Nenhum resultado encontrado")).toBeTruthy();
  });

  it("should render loading state when isLoading is true", () => {
    const { getByText } = sut({ isLoading: true, stocks: [] });

    expect(getByText("Buscando ações disponíveis...")).toBeTruthy();
  });

  it("should render stock cards when stocks are available", () => {
    const mockStocks = [
      { ...mockStock, symbol: "PETR4.SA", shortname: "Petrobras PN" },
      { ...mockStock, symbol: "VALE3.SA", shortname: "Vale ON" },
    ];

    const { getByText } = sut({ stocks: mockStocks });

    expect(getByText("Petrobras PN")).toBeTruthy();
    expect(getByText("Vale ON")).toBeTruthy();
  });

  it("should show float button when stocks are selected", () => {
    const { getByText } = sut({ selectedStocks: [mockStock] });

    expect(getByText("Confirmar (1)")).toBeTruthy();
  });

  it("should not show float button when no stocks are selected", () => {
    const { queryByText } = sut({ selectedStocks: [] });

    expect(queryByText(/Confirmar/)).not.toBeTruthy();
  });

  it("should call handleConfirm when float button is pressed", () => {
    const { getByText } = sut({ selectedStocks: [mockStock] });

    const confirmButton = getByText("Confirmar (1)").parent;
    if (confirmButton) {
      fireEvent.press(confirmButton);
      expect(mockedHandleConfirm).toHaveBeenCalledTimes(1);
    }
  });

  it("should display correct count for multiple selected stocks", () => {
    const mockStocks = [
      { ...mockStock, symbol: "PETR4.SA" },
      { ...mockStock, symbol: "VALE3.SA" },
      { ...mockStock, symbol: "ITUB4.SA" },
    ];

    const { getByText } = sut({ selectedStocks: mockStocks });

    expect(getByText("3 ações selecionadas")).toBeTruthy();
    expect(getByText("Confirmar (3)")).toBeTruthy();
  });
});
