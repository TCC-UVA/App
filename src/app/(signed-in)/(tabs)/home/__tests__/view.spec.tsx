import { WrapperUi } from "@/src/mock/provider";
import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { HomeView } from "../view";
import { useHomeViewModel } from "../viewModel";

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

const mockedHandleApplySearch = jest.fn();
const mockedHandleChangeDraftSearch = jest.fn();
const mockedHandleEditWallet = jest.fn();
const mockedHandleGoToCreateWallet = jest.fn();
const sut = (customProps?: Partial<ReturnType<typeof useHomeViewModel>>) => {
  const methods = {
    draftSearch: "",
    handleApplySearch: mockedHandleApplySearch,
    handleChangeDraftSearch: mockedHandleChangeDraftSearch,
    handleEditWallet: mockedHandleEditWallet,
    handleGoToCreateWallet: mockedHandleGoToCreateWallet,
    isLoading: false,
    wallets: [],
    ...customProps,
  } as ReturnType<typeof useHomeViewModel>;
  return render(
    <WrapperUi>
      <HomeView {...methods} />
    </WrapperUi>
  );
};

describe("Home - View", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("Should render empty state when there is no wallets", async () => {
    const { getByText } = sut();

    expect(getByText("Nenhuma carteira encontrada")).toBeTruthy();
  });

  it("Should render loading state when isLoading is true", async () => {
    const { getAllByTestId } = sut({ isLoading: true });

    expect(getAllByTestId("wallet-card-skeleton")).toHaveLength(5);
  });

  it('Should redirect to create wallet screen when "Nova carteira" button is pressed', async () => {
    const { getByText } = sut();

    const createWalletButton = getByText("Nova carteira");
    act(() => {
      fireEvent.press(createWalletButton);
    });
    expect(mockedHandleGoToCreateWallet).toHaveBeenCalled();
  });

  it("Should change draft search when typing in search input", async () => {
    const { getByPlaceholderText, getByTestId } = sut();

    const searchInput = getByPlaceholderText("Buscar carteira...");
    const searchConfirmButton = getByTestId("search-confirm-button");
    act(() => {
      fireEvent.changeText(searchInput, "My Wallet");
    });
    act(() => {
      fireEvent.press(searchConfirmButton);
    });

    expect(mockedHandleChangeDraftSearch).toHaveBeenCalledWith("My Wallet");
    expect(mockedHandleApplySearch).toHaveBeenCalled();
  });

  it("Should render wallets when they are provided", async () => {
    const { getByText } = sut({
      wallets: [
        {
          name: "Wallet 1",
          Assets: [{ name: "Asset 1", allocation: 100 }],
          PortfolioId: 1,
        },
        {
          name: "Wallet 2",
          Assets: [{ name: "Asset 2", allocation: 100 }],
          PortfolioId: 2,
        },
      ],
    });

    expect(getByText("Wallet 1")).toBeTruthy();
    expect(getByText("Wallet 2")).toBeTruthy();
  });

  it("Should render assets quantity inside wallet cards", async () => {
    const { getByText } = sut({
      wallets: [
        {
          name: "Wallet 1",
          Assets: [
            { name: "Asset 1", allocation: 60 },
            { name: "Asset 2", allocation: 40 },
          ],
          PortfolioId: 1,
        },
      ],
    });
    expect(getByText("2 ações")).toBeTruthy();
  });

  it("Should call handleEditWallet when a wallet card is pressed", async () => {
    const wallet = {
      name: "Wallet 1",
      Assets: [{ name: "Asset 1", allocation: 100 }],
      PortfolioId: 1,
    };
    const { getByText } = sut({
      wallets: [wallet],
    });

    const walletCard = getByText("Wallet 1");
    act(() => {
      fireEvent.press(walletCard);
    });

    expect(mockedHandleEditWallet).toHaveBeenCalledWith(wallet);
  });

  it("Should render empty state when search yields no results", async () => {
    const { getByText } = sut({
      wallets: [],
      draftSearch: "Nonexistent Wallet",
    });

    expect(getByText("Nenhuma carteira encontrada")).toBeTruthy();
  });

  it("Should render correct wallet count", async () => {
    const { getByText } = sut({
      wallets: [
        {
          name: "Wallet 1",
          Assets: [{ name: "Asset 1", allocation: 100 }],
          PortfolioId: 1,
        },
        {
          name: "Wallet 2",
          Assets: [{ name: "Asset 2", allocation: 100 }],
          PortfolioId: 2,
        },
        {
          name: "Wallet 3",
          Assets: [{ name: "Asset 3", allocation: 100 }],
          PortfolioId: 3,
        },
      ],
    });

    expect(getByText("3 carteiras")).toBeTruthy();
  });

  it("Should render '1 carteira' when there is only one wallet", async () => {
    const { getByText } = sut({
      wallets: [
        {
          name: "Wallet 1",
          Assets: [{ name: "Asset 1", allocation: 100 }],
          PortfolioId: 1,
        },
      ],
    });

    expect(getByText("1 carteira")).toBeTruthy();
  });

  it("Should render '0 carteiras' when there are no wallets", async () => {
    const { getByText } = sut({
      wallets: [],
    });

    expect(getByText("0 carteiras")).toBeTruthy();
  });
});
