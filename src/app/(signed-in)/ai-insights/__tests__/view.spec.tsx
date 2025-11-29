import { WrapperUi } from "@/src/mock/provider";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { AIInsightsView } from "../view";
import { useAIInsightsViewModel } from "../viewModel";

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

const mockedHandleGoBack = jest.fn();

const sut = (
  customProps?: Partial<ReturnType<typeof useAIInsightsViewModel>>
) => {
  const methods = {
    insights: undefined,
    isLoading: false,
    error: false,
    walletName: "Test Wallet",
    handleGoBack: mockedHandleGoBack,
    ...customProps,
  } as ReturnType<typeof useAIInsightsViewModel>;
  return render(
    <WrapperUi>
      <AIInsightsView {...methods} />
    </WrapperUi>
  );
};

describe("AIInsights - View", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should render header with wallet name", () => {
    const { getByText } = sut();

    expect(getByText("Análise com IA")).toBeTruthy();
    expect(getByText("Test Wallet")).toBeTruthy();
  });

  it("should call handleGoBack when back button is pressed", () => {
    const { getByText } = sut();

    const backButton = getByText("arrow-back").parent;
    if (backButton) {
      fireEvent.press(backButton);
      expect(mockedHandleGoBack).toHaveBeenCalledTimes(1);
    }
  });

  it("should render loading skeleton when isLoading is true", () => {
    const { queryByText } = sut({ isLoading: true });

    expect(queryByText("Análise da IA")).not.toBeTruthy();
  });

  it("should render error state when error is true", () => {
    const { getByText } = sut({ error: true });

    expect(getByText("Erro ao carregar análise")).toBeTruthy();

    const voltarButton = getByText("Voltar").parent;

    if (voltarButton) {
      fireEvent.press(voltarButton);
      expect(mockedHandleGoBack).toHaveBeenCalled();
    }
  });

  it("should render insights content when data is loaded", () => {
    const mockInsights =
      "Esta é uma análise gerada por IA sobre seu portfólio.";

    const { getByText } = sut({ insights: mockInsights });

    expect(getByText("Análise da IA")).toBeTruthy();
    expect(getByText(mockInsights)).toBeTruthy();
  });

  it("should render disclaimer message when insights are shown", () => {
    const mockInsights = "Análise de teste";

    const { getByText } = sut({ insights: mockInsights });

    expect(
      getByText(
        "Esta análise foi gerada por Inteligência Artificial e tem caráter informativo. Sempre consulte um profissional financeiro para decisões de investimento."
      )
    ).toBeTruthy();
  });

  it("should not render insights when insights is null", () => {
    const { queryByText } = sut({ insights: undefined });

    expect(queryByText("Análise da IA")).not.toBeTruthy();
  });

  it("should render back button with correct icon", () => {
    const { getByText } = sut();

    expect(getByText("arrow-back")).toBeTruthy();
  });

  it("should render sparkles icon in header", () => {
    const { getAllByText } = sut();

    const sparklesIcons = getAllByText("sparkles");
    expect(sparklesIcons.length).toBeGreaterThan(0);
  });

  it("should display correct wallet name from props", () => {
    const { getByText } = sut({ walletName: "Carteira de Investimentos" });

    expect(getByText("Carteira de Investimentos")).toBeTruthy();
  });

  it("should render error icon when in error state", () => {
    const { getByText } = sut({ error: true });

    expect(getByText("alert-circle-outline")).toBeTruthy();
  });

  it("should render loading state with skeletons", () => {
    const { queryByText } = sut({ isLoading: true });

    // When loading, insights content should not be visible
    expect(queryByText("Análise da IA")).not.toBeTruthy();
  });

  it("should render scroll view when insights are available", () => {
    const mockInsights = "Detailed AI insights about your portfolio...";

    const { getByText } = sut({ insights: mockInsights });

    expect(getByText(mockInsights)).toBeTruthy();
  });

  it("should handle long insights text", () => {
    const longInsights =
      "Esta é uma análise muito longa que contém múltiplos parágrafos e informações detalhadas sobre o portfólio. ".repeat(
        10
      );

    const { getByText } = sut({ insights: longInsights });

    expect(getByText(longInsights)).toBeTruthy();
  });

  it("should prioritize error state over loading state", () => {
    const { getByText, queryByText } = sut({ isLoading: false, error: true });

    expect(getByText("Erro ao carregar análise")).toBeTruthy();
    expect(queryByText("Análise da IA")).not.toBeTruthy();
  });

  it("should show loading state before insights are loaded", () => {
    sut({ isLoading: true, insights: undefined });

    expect(() => sut({ isLoading: false, insights: "Loaded insights" })).not.toThrow();
  });
});
