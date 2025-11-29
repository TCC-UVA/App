import { WrapperUi } from "@/src/mock/provider";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  act,
  fireEvent,
  render,
  renderHook,
} from "@testing-library/react-native";
import { useForm } from "react-hook-form";
import { CreateWalletFormData, createWalletSchema } from "../model";
import { CreateWalletView } from "../view";
import { useCreateWalletViewModel } from "../viewModel";

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

const mockedHandleSubmit = jest.fn().mockImplementation((fn) => fn);
const mockedHandleGoBack = jest.fn();
const mockedOnSubmit = jest.fn();

const { result } = renderHook(() =>
  useForm<CreateWalletFormData>({
    resolver: yupResolver(createWalletSchema),
    mode: "onSubmit",
    defaultValues: { name: "" },
  })
);

const sut = (
  customProps?: Partial<ReturnType<typeof useCreateWalletViewModel>>
) => {
  const methods = {
    control: result.current.control,
    handleSubmit: mockedHandleSubmit,
    handleGoBack: mockedHandleGoBack,
    onSubmit: mockedOnSubmit,
    ...customProps,
  } as ReturnType<typeof useCreateWalletViewModel>;

  return render(
    <WrapperUi>
      <CreateWalletView {...methods} />
    </WrapperUi>
  );
};

describe("CreateWallet - View", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should render screen title", () => {
    const { getByText } = sut();

    expect(getByText("Nova Carteira")).toBeTruthy();
  });

  it("should render screen description", () => {
    const { getByText } = sut();

    expect(
      getByText("Crie uma carteira para organizar seus investimentos")
    ).toBeTruthy();
  });

  it("should render icon", () => {
    const { getAllByText } = sut();

    const icons = getAllByText("briefcase-outline");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("should render input label", () => {
    const { getByText } = sut();

    expect(getByText("Nome da Carteira")).toBeTruthy();
  });

  it("should render input with placeholder", () => {
    const { getByPlaceholderText } = sut();

    expect(
      getByPlaceholderText("Ex: Minhas Ações, Dividendos, etc.")
    ).toBeTruthy();
  });

  it("should render Continuar button", () => {
    const { getByText } = sut();

    expect(getByText("Continuar")).toBeTruthy();
  });

  it("should render Cancelar button", () => {
    const { getByText } = sut();

    expect(getByText("Cancelar")).toBeTruthy();
  });

  it("should call handleGoBack when Cancelar button is pressed", () => {
    const { getByText } = sut();

    const cancelButton = getByText("Cancelar");
    fireEvent.press(cancelButton);

    expect(mockedHandleGoBack).toHaveBeenCalledTimes(1);
  });

  it("should call handleSubmit when Continuar button is pressed", () => {
    const { getByText } = sut();

    const continueButton = getByText("Continuar");
    fireEvent.press(continueButton);

    expect(mockedHandleSubmit).toHaveBeenCalled();
    expect(mockedHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should update input value when typing", () => {
    const { getByPlaceholderText } = sut();

    const input = getByPlaceholderText("Ex: Minhas Ações, Dividendos, etc.");
    fireEvent.changeText(input, "Minha Carteira");

    expect(result.current.getValues("name")).toBe("Minha Carteira");
  });

  it("should show validation error when name is empty", async () => {
    const { findByText } = sut();

    await act(async () => {
      result.current.setValue("name", "");
      await result.current.trigger();
    });

    expect(
      await findByText("O nome da carteira é obrigatório")
    ).toBeOnTheScreen();
  });

  it("should call onSubmit with correct data when form is valid", async () => {
    const { getByPlaceholderText, getByText } = sut({
      handleSubmit: result.current.handleSubmit,
    });

    const input = getByPlaceholderText("Ex: Minhas Ações, Dividendos, etc.");
    const continueButton = getByText("Continuar");

    fireEvent.changeText(input, "Carteira de Dividendos");

    await act(async () => {
      fireEvent.press(continueButton);
    });

    expect(mockedOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockedOnSubmit.mock.calls[0][0]).toEqual({
      name: "Carteira de Dividendos",
    });
  });

  it("should NOT call onSubmit when form is invalid", async () => {
    const { getByPlaceholderText, getByText } = sut({
      handleSubmit: result.current.handleSubmit,
    });

    const input = getByPlaceholderText("Ex: Minhas Ações, Dividendos, etc.");
    const continueButton = getByText("Continuar");

    fireEvent.changeText(input, "");

    await act(async () => {
      fireEvent.press(continueButton);
    });

    expect(mockedOnSubmit).not.toHaveBeenCalled();
  });

  it("should have input with briefcase icon", () => {
    const { getAllByText } = sut();

    const icons = getAllByText("briefcase-outline");
    // Should have at least 2: one in the header circle and one in the input
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });

  it("should allow multiple words in wallet name", () => {
    const { getByPlaceholderText } = sut();

    const input = getByPlaceholderText("Ex: Minhas Ações, Dividendos, etc.");
    fireEvent.changeText(input, "Minha Carteira de Ações Favoritas");

    expect(result.current.getValues("name")).toBe(
      "Minha Carteira de Ações Favoritas"
    );
  });

  it("should render both action buttons", () => {
    const { getByText } = sut();

    // Both buttons should exist
    expect(getByText("Continuar")).toBeTruthy();
    expect(getByText("Cancelar")).toBeTruthy();
  });

  it("should clear validation error when valid input is provided", async () => {
    const { getByPlaceholderText, queryByText } = sut();

    const input = getByPlaceholderText("Ex: Minhas Ações, Dividendos, etc.");

    // First trigger error
    await act(async () => {
      result.current.setValue("name", "");
      await result.current.trigger();
    });

    // Then provide valid input
    await act(async () => {
      fireEvent.changeText(input, "Carteira Válida");
      await result.current.trigger();
    });

    expect(queryByText("O nome da carteira é obrigatório")).not.toBeOnTheScreen();
  });
});
