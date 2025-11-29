import { Benchmark } from "@/src/models/benchmark";
import { WrapperUi } from "@/src/mock/provider";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { AnalyticsView } from "../view";
import { useAnalyticsViewModel } from "../viewModel";

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

// Mock analytics components
jest.mock("../components/compact-wallet-card", () => ({
  CompactWalletCard: ({ item }: any) => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, item.name);
  },
}));

jest.mock("../components/compact-wallet-card/skeleton", () => ({
  CompactWalletCardSkeleton: () => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, { testID: "compact-wallet-skeleton" });
  },
}));

jest.mock("../components/empty", () => ({
  EmptyState: () => {
    const React = require("react");
    const { Text } = require("react-native");
    return React.createElement(Text, null, "Nenhuma carteira encontrada");
  },
}));

jest.mock("../components/benchmark-card", () => ({
  BenchmarkCard: ({ benchmark }: any) => {
    const React = require("react");
    const { Text } = require("react-native");
    const { benchmarkToLabel } = require("@/src/models/benchmark");
    return React.createElement(Text, null, benchmarkToLabel[benchmark]);
  },
}));

jest.mock("@/src/components/float-button", () => ({
  FloatButton: ({ text, handleConfirm, isLoading, disabled }: any) => {
    const React = require("react");
    const { View, Text, TouchableOpacity } = require("react-native");
    return React.createElement(
      View,
      null,
      React.createElement(
        TouchableOpacity,
        { onPress: handleConfirm, disabled, accessibilityState: { disabled } },
        React.createElement(Text, null, text)
      ),
      isLoading
        ? React.createElement(View, { testID: "float-button-spinner" })
        : null
    );
  },
}));

jest.mock("@/src/components/comparison-modal", () => ({
  ComparisonModal: ({ isOpen }: any) => {
    const React = require("react");
    const { View } = require("react-native");
    return isOpen
      ? React.createElement(View, { testID: "comparison-modal" })
      : null;
  },
}));

jest.mock("@/src/components/benchmark-comparison-modal", () => ({
  BenchmarkComparisonModal: ({ isOpen }: any) => {
    const React = require("react");
    const { View } = require("react-native");
    return isOpen
      ? React.createElement(View, { testID: "benchmark-comparison-modal" })
      : null;
  },
}));

const mockedHandleChangeIsSelectingActive = jest.fn();
const mockedToggleWalletSelection = jest.fn();
const mockedToggleBenchmarkSelection = jest.fn();
const mockedHandleCompare = jest.fn();
const mockedCloseComparisonModal = jest.fn();
const mockedCloseBenchmarkModal = jest.fn();
const mockedSetInitialYear = jest.fn();
const mockedSetFinalYear = jest.fn();
const mockedGetCompareButtonText = jest.fn();

const sut = (
  customProps?: Partial<ReturnType<typeof useAnalyticsViewModel>>
) => {
  const methods = {
    isLoadingWallets: false,
    walletData: [],
    isSelectingActive: false,
    handleChangeIsSelectingActive: mockedHandleChangeIsSelectingActive,
    selectedWalletIds: new Set<number>(),
    toggleWalletSelection: mockedToggleWalletSelection,
    handleCompare: mockedHandleCompare,
    isComparisonModalOpen: false,
    closeComparisonModal: mockedCloseComparisonModal,
    isPendingCompare: false,
    comparisonData: undefined,
    initialYear: "2023",
    finalYear: "2024",
    setInitialYear: mockedSetInitialYear,
    setFinalYear: mockedSetFinalYear,
    currentYear: "2024",
    lastYear: "2023",
    selectedBenchmark: null,
    toggleBenchmarkSelection: mockedToggleBenchmarkSelection,
    isPendingBenchmarkCompare: false,
    benchmarkComparisonData: undefined,
    isBenchmarkModalOpen: false,
    closeBenchmarkModal: mockedCloseBenchmarkModal,
    canCompare: false,
    isWalletComparison: false,
    isBenchmarkComparison: false,
    getCompareButtonText: mockedGetCompareButtonText,
    ...customProps,
  } as ReturnType<typeof useAnalyticsViewModel>;

  return render(
    <WrapperUi>
      <AnalyticsView {...methods} />
    </WrapperUi>
  );
};

describe("Analytics - View", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should render selection button with 'Selecionar' text when not selecting", () => {
    const { getByText } = sut();

    expect(getByText("Selecionar")).toBeTruthy();
  });

  it("should render 'Cancelar' button when isSelectingActive is true", () => {
    const { getByText } = sut({ isSelectingActive: true });

    expect(getByText("Cancelar")).toBeTruthy();
  });

  it("should call handleChangeIsSelectingActive when selection button is pressed", () => {
    const { getByText } = sut();

    const button = getByText("Selecionar");
    fireEvent.press(button);

    expect(mockedHandleChangeIsSelectingActive).toHaveBeenCalledTimes(1);
  });

  it("should render year selection inputs when isSelectingActive is true", () => {
    const { getByPlaceholderText } = sut({ isSelectingActive: true });

    expect(getByPlaceholderText("2023")).toBeTruthy();
    expect(getByPlaceholderText("2024")).toBeTruthy();
  });

  it("should not render year selection inputs when isSelectingActive is false", () => {
    const { queryByPlaceholderText } = sut({ isSelectingActive: false });

    expect(queryByPlaceholderText("2023")).not.toBeTruthy();
    expect(queryByPlaceholderText("2024")).not.toBeTruthy();
  });

  it("should call setInitialYear when typing in initial year input", () => {
    const { getByPlaceholderText } = sut({ isSelectingActive: true });

    const initialYearInput = getByPlaceholderText("2023");
    fireEvent.changeText(initialYearInput, "2020");

    expect(mockedSetInitialYear).toHaveBeenCalledWith("2020");
  });

  it("should call setFinalYear when typing in final year input", () => {
    const { getByPlaceholderText } = sut({ isSelectingActive: true });

    const finalYearInput = getByPlaceholderText("2024");
    fireEvent.changeText(finalYearInput, "2025");

    expect(mockedSetFinalYear).toHaveBeenCalledWith("2025");
  });

  it("should render loading skeletons when isLoadingWallets is true", () => {
    const { queryAllByTestId } = sut({ isLoadingWallets: true });

    const skeletons = queryAllByTestId("compact-wallet-skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render empty state when no wallets are available", () => {
    const { getByText } = sut({ walletData: [] });

    expect(getByText("Nenhuma carteira encontrada")).toBeTruthy();
  });

  it("should render wallet cards when wallets are available", () => {
    const walletData = [
      {
        name: "Carteira 1",
        PortfolioId: 1,
        Assets: [{ name: "PETR4", allocation: 100 }],
      },
      {
        name: "Carteira 2",
        PortfolioId: 2,
        Assets: [{ name: "VALE3", allocation: 100 }],
      },
    ];

    const { getByText } = sut({ walletData });

    expect(getByText("Carteira 1")).toBeTruthy();
    expect(getByText("Carteira 2")).toBeTruthy();
  });

  it("should render benchmarks section", () => {
    const { getByText } = sut();

    expect(getByText("Comparar com Benchmarks")).toBeTruthy();
  });

  it("should render 4 benchmark cards", () => {
    const { getByText } = sut();

    expect(getByText("IPCA")).toBeTruthy();
    expect(getByText("CDI")).toBeTruthy();
    expect(getByText("SELIC")).toBeTruthy();
    expect(getByText("Dólar")).toBeTruthy();
  });

  it("should not render FloatButton when canCompare is false", () => {
    const { queryByText } = sut({ canCompare: false });

    mockedGetCompareButtonText.mockReturnValue("Comparar 2 Carteiras");
    expect(queryByText("Comparar 2 Carteiras")).not.toBeTruthy();
  });

  it("should render FloatButton when canCompare is true", () => {
    mockedGetCompareButtonText.mockReturnValue("Comparar 2 Carteiras");

    const { getByText } = sut({ canCompare: true });

    expect(getByText("Comparar 2 Carteiras")).toBeTruthy();
  });

  it("should call handleCompare when FloatButton is pressed", () => {
    mockedGetCompareButtonText.mockReturnValue("Comparar 2 Carteiras");

    const { getByText } = sut({ canCompare: true });

    const compareButton = getByText("Comparar 2 Carteiras");
    fireEvent.press(compareButton);

    expect(mockedHandleCompare).toHaveBeenCalledTimes(1);
  });

  it("should render FloatButton even when years are not set", () => {
    mockedGetCompareButtonText.mockReturnValue("Comparar");

    const { getByText } = sut({
      canCompare: true,
      initialYear: "",
      finalYear: "",
    });

    const compareButton = getByText("Comparar");
    expect(compareButton).toBeTruthy();
  });

  it("should show loading state on FloatButton when isPendingCompare is true", () => {
    mockedGetCompareButtonText.mockReturnValue("Comparar");

    const { queryByTestId } = sut({
      canCompare: true,
      isPendingCompare: true,
    });

    expect(queryByTestId("float-button-spinner")).toBeTruthy();
  });

  it("should show loading state on FloatButton when isPendingBenchmarkCompare is true", () => {
    mockedGetCompareButtonText.mockReturnValue("Comparar");

    const { queryByTestId } = sut({
      canCompare: true,
      isPendingBenchmarkCompare: true,
    });

    expect(queryByTestId("float-button-spinner")).toBeTruthy();
  });

  it("should render selection info text when isSelectingActive is true", () => {
    const { getByText } = sut({ isSelectingActive: true });

    expect(getByText("Selecione 2 carteiras OU 1 carteira + 1 benchmark")).toBeTruthy();
  });

  it("should show correct selection info when 1 wallet is selected", () => {
    const selectedIds = new Set([1]);
    const { getByText } = sut({
      isSelectingActive: true,
      selectedWalletIds: selectedIds,
    });

    expect(
      getByText("Selecione 1 benchmark ou mais 1 carteira (1/2)")
    ).toBeTruthy();
  });

  it("should show correct selection info when 2 wallets are selected", () => {
    const selectedIds = new Set([1, 2]);
    const { getByText } = sut({
      isSelectingActive: true,
      selectedWalletIds: selectedIds,
    });

    expect(getByText("Pronto! Clique em comparar 2 carteiras (2/2)")).toBeTruthy();
  });

  it("should show correct selection info when benchmark is selected", () => {
    const { getByText } = sut({
      isSelectingActive: true,
      selectedBenchmark: Benchmark.IPCA,
    });

    expect(
      getByText("Selecione 1 carteira para comparar com benchmark (0/1)")
    ).toBeTruthy();
  });

  it("should show correct selection info when 1 wallet and benchmark are selected", () => {
    const selectedIds = new Set([1]);
    const { getByText } = sut({
      isSelectingActive: true,
      selectedWalletIds: selectedIds,
      selectedBenchmark: Benchmark.CDI,
    });

    expect(getByText("Pronto! Clique em comparar (1/1)")).toBeTruthy();
  });

  it("should render ComparisonModal when isComparisonModalOpen is true", () => {
    const { getByTestId } = sut({ isComparisonModalOpen: true });

    expect(getByTestId("comparison-modal")).toBeTruthy();
  });

  it("should render BenchmarkComparisonModal when isBenchmarkModalOpen is true", () => {
    const { getByTestId } = sut({ isBenchmarkModalOpen: true });

    expect(getByTestId("benchmark-comparison-modal")).toBeTruthy();
  });

  it("should render wallet count in header", () => {
    const { getByText } = sut();

    expect(getByText("Carteiras")).toBeTruthy();
  });
});
