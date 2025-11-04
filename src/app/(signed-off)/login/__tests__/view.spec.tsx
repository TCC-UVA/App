import { yupResolver } from "@hookform/resolvers/yup";
import {
  act,
  fireEvent,
  render,
  renderHook,
} from "@testing-library/react-native";
import { useForm } from "react-hook-form";
import { WrapperUi } from "../../../../mock/provider";
import { LoginFormData, loginSchema } from "../model";
import { LoginView } from "../view";
import { useLoginViewModel } from "../viewModel";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  Link: ({ children }: any) => children,
}));

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return {
    Ionicons: View,
  };
});

const mockedHandleSubmit = jest.fn().mockImplementation((fn) => fn);
const mockedHandleGoToRegister = jest.fn();
const mockedOnSubmit = jest.fn();
const { result } = renderHook(() =>
  useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  })
);

const sut = (customProps?: Partial<ReturnType<typeof useLoginViewModel>>) => {
  const methods = {
    control: result.current.control,
    handleSubmit: mockedHandleSubmit,
    handleGoToRegister: mockedHandleGoToRegister,
    isLoading: false,
    onSubmit: mockedOnSubmit,
    handleFocusPasswordInput: jest.fn(),
    isError: false,
    ...customProps,
  } as ReturnType<typeof useLoginViewModel>;
  return render(
    <WrapperUi>
      <LoginView {...methods} />
    </WrapperUi>
  );
};

describe("Login - View", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("Should render form", () => {
    const { getByPlaceholderText, getByText } = sut();

    const emailInput = getByPlaceholderText("Digite seu e-mail");
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const loginButton = getByText("Entrar");
    const registerButton = getByText("Não tem uma conta? Cadastre-se");

    expect(emailInput).toBeOnTheScreen();
    expect(passwordInput).toBeOnTheScreen();
    expect(loginButton).toBeOnTheScreen();
    expect(registerButton).toBeOnTheScreen();
  });

  it("Should call handleSubmit when login button is pressed", () => {
    const { getByText } = sut();

    const loginButton = getByText("Entrar");

    expect(loginButton).toBeOnTheScreen();

    fireEvent.press(loginButton);

    expect(mockedHandleSubmit).toHaveBeenCalled();
    expect(mockedHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should call handleGoToRegister when "Não tem uma conta? Cadastre-se" button is pressed', () => {
    const { getByText } = sut();

    const registerButton = getByText("Não tem uma conta? Cadastre-se");

    expect(registerButton).toBeOnTheScreen();

    act(() => {
      fireEvent.press(registerButton);

      expect(mockedHandleGoToRegister).toHaveBeenCalled();
      expect(mockedHandleGoToRegister).toHaveBeenCalledTimes(1);
    });
  });

  it("should show loading state when isLoading is true", () => {
    const { queryByText, queryByTestId } = sut({ isLoading: true });
    const loadingIndicator = queryByTestId("login-button-loading");

    expect(loadingIndicator).toBeOnTheScreen();

    expect(queryByText("Entrar")).not.toBeOnTheScreen();
  });

  it("should show validate input error message", async () => {
    const { findByText } = sut();

    await act(async () => {
      result.current.setValue("email", "asdasd");
      await result.current.trigger();
    });

    expect(await findByText("Email inválido")).toBeOnTheScreen();
  });

  it("should show required input error message", async () => {
    const { findByText } = sut();

    await act(async () => {
      result.current.setValue("email", "");
      result.current.setValue("password", "");
      await result.current.trigger();
    });

    expect(await findByText("Email é obrigatório")).toBeOnTheScreen();
    expect(
      await findByText("Senha deve ter no mínimo 6 caracteres")
    ).toBeOnTheScreen();
  });

  it("should has a secureTextEntry on password input", () => {
    const { getByPlaceholderText } = sut();

    const passwordInput = getByPlaceholderText("Digite sua senha");

    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('should call onChange when type on "E-mail" input', () => {
    const { getByPlaceholderText } = sut();

    const emailInput = getByPlaceholderText("Digite seu e-mail");

    fireEvent.changeText(emailInput, "teste@teste.com");
    expect(result.current.getValues("email")).toBe("teste@teste.com");
  });

  it('should call onChange when type on "Senha" input', () => {
    const { getByPlaceholderText } = sut();

    const passwordInput = getByPlaceholderText("Digite sua senha");

    fireEvent.changeText(passwordInput, "123456");
    expect(result.current.getValues("password")).toBe("123456");
  });

  it("should call onSubmit with correct values when form is submitted and valid", async () => {
    const { getByPlaceholderText, getByText } = sut({
      handleSubmit: result.current.handleSubmit,
    });

    const emailInput = getByPlaceholderText("Digite seu e-mail");
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const loginButton = getByText("Entrar");

    fireEvent.changeText(emailInput, "teste@teste.com");
    fireEvent.changeText(passwordInput, "123456");

    await act(async () => {
      fireEvent.press(loginButton);
    });

    expect(mockedOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockedOnSubmit.mock.calls[0][0]).toEqual({
      email: "teste@teste.com",
      password: "123456",
    });
  });

  it("should NOT call onSubmit when form is invalid", async () => {
    const { getByPlaceholderText, getByText } = sut({
      handleSubmit: result.current.handleSubmit,
    });

    const emailInput = getByPlaceholderText("Digite seu e-mail");
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const loginButton = getByText("Entrar");

    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent.changeText(passwordInput, "123");

    await act(async () => {
      fireEvent.press(loginButton);
    });

    expect(mockedOnSubmit).not.toHaveBeenCalled();
  });
});
