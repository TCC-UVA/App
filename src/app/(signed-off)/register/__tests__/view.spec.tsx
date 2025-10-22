import { yupResolver } from "@hookform/resolvers/yup";
import {
  act,
  fireEvent,
  render,
  renderHook,
} from "@testing-library/react-native";
import { useForm } from "react-hook-form";
import { WrapperUi } from "../../../../mock/provider";
import { RegisterFormData, registerSchema } from "../model";
import { RegisterView } from "../view";
import { useRegisterViewModel } from "../viewModel";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

const mockedHandleSubmit = jest.fn().mockImplementation((fn) => fn);
const mockedHandleGoToLogin = jest.fn();
const mockedOnSubmit = jest.fn();
const { result } = renderHook(() =>
  useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: "onSubmit",
  })
);

const sut = (
  customProps?: Partial<ReturnType<typeof useRegisterViewModel>>
) => {
  const methods = {
    control: result.current.control,
    handleSubmit: mockedHandleSubmit,
    handleGoToLogin: mockedHandleGoToLogin,
    isLoading: false,
    onSubmit: mockedOnSubmit,
    ...customProps,
  } as ReturnType<typeof useRegisterViewModel>;
  return render(
    <WrapperUi>
      <RegisterView {...methods} />
    </WrapperUi>
  );
};

describe("Register - View", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("Should render form", () => {
    const { getByPlaceholderText, getByText } = sut();

    const nameInput = getByPlaceholderText("Digite seu nome completo");
    const emailInput = getByPlaceholderText("Digite seu e-mail");
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const confirmPasswordInput = getByPlaceholderText("Confirme sua senha");
    const registerButton = getByText("Criar Conta");
    const loginButton = getByText("Já tem conta? Faça Login");

    expect(nameInput).toBeOnTheScreen();
    expect(emailInput).toBeOnTheScreen();
    expect(passwordInput).toBeOnTheScreen();
    expect(confirmPasswordInput).toBeOnTheScreen();
    expect(registerButton).toBeOnTheScreen();
    expect(loginButton).toBeOnTheScreen();
  });

  it("Should call handleSubmit when register button is pressed", () => {
    const { getByText } = sut();

    const registerButton = getByText("Criar Conta");

    expect(registerButton).toBeOnTheScreen();

    fireEvent.press(registerButton);

    expect(mockedHandleSubmit).toHaveBeenCalled();
    expect(mockedHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should call handleGoToLogin when "Já tem conta? Faça Login" button is pressed', () => {
    const { getByText } = sut();

    const loginButton = getByText("Já tem conta? Faça Login");

    expect(loginButton).toBeOnTheScreen();

    fireEvent.press(loginButton);

    expect(mockedHandleGoToLogin).toHaveBeenCalled();
    expect(mockedHandleGoToLogin).toHaveBeenCalledTimes(1);
  });

  it("should show loading state when isLoading is true", () => {
    const { queryByText, queryByTestId } = sut({ isLoading: true });
    const loadingIndicator = queryByTestId("register-button-loading");

    expect(loadingIndicator).toBeOnTheScreen();

    expect(queryByText("Criar Conta")).not.toBeOnTheScreen();
  });

  it("should show validate input error message", async () => {
    const { findByText } = sut();

    await act(async () => {
      result.current.setValue("email", "asdasd");
      await result.current.trigger();
    });

    expect(await findByText("Email inválido")).toBeOnTheScreen();
  });

  it("should show required input error messages", async () => {
    const { findByText } = sut();

    await act(async () => {
      result.current.setValue("name", "");
      result.current.setValue("email", "");
      result.current.setValue("password", "");
      result.current.setValue("confirmPassword", "");
      await result.current.trigger();
    });

    expect(await findByText("Nome é obrigatório")).toBeOnTheScreen();
    expect(await findByText("Email é obrigatório")).toBeOnTheScreen();
    expect(
      await findByText("Senha deve ter no mínimo 6 caracteres")
    ).toBeOnTheScreen();
    expect(
      await findByText("Confirmação de senha é obrigatória")
    ).toBeOnTheScreen();
  });

  it("should show error when passwords don't match", async () => {
    const { findByText } = sut();

    await act(async () => {
      result.current.setValue("password", "123456");
      result.current.setValue("confirmPassword", "654321");
      await result.current.trigger();
    });

    expect(await findByText("As senhas devem corresponder")).toBeOnTheScreen();
  });

  it("should has a secureTextEntry on password inputs", () => {
    const { getByPlaceholderText } = sut();

    const passwordInput = getByPlaceholderText("Digite sua senha");
    const confirmPasswordInput = getByPlaceholderText("Confirme sua senha");

    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
  });

  it('should call onChange when type on "Nome" input', () => {
    const { getByPlaceholderText } = sut();

    const nameInput = getByPlaceholderText("Digite seu nome completo");

    fireEvent.changeText(nameInput, "João Silva");
    expect(result.current.getValues("name")).toBe("João Silva");
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

  it('should call onChange when type on "Confirmar Senha" input', () => {
    const { getByPlaceholderText } = sut();

    const confirmPasswordInput = getByPlaceholderText("Confirme sua senha");

    fireEvent.changeText(confirmPasswordInput, "123456");
    expect(result.current.getValues("confirmPassword")).toBe("123456");
  });

  it("should call onSubmit with correct values when form is submitted and valid", async () => {
    const { getByPlaceholderText, getByText } = sut({
      handleSubmit: result.current.handleSubmit,
    });

    const nameInput = getByPlaceholderText("Digite seu nome completo");
    const emailInput = getByPlaceholderText("Digite seu e-mail");
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const confirmPasswordInput = getByPlaceholderText("Confirme sua senha");
    const registerButton = getByText("Criar Conta");

    fireEvent.changeText(nameInput, "João Silva");
    fireEvent.changeText(emailInput, "teste@teste.com");
    fireEvent.changeText(passwordInput, "123456");
    fireEvent.changeText(confirmPasswordInput, "123456");

    await act(async () => {
      fireEvent.press(registerButton);
    });

    expect(mockedOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockedOnSubmit.mock.calls[0][0]).toEqual({
      name: "João Silva",
      email: "teste@teste.com",
      password: "123456",
      confirmPassword: "123456",
    });
  });

  it("should NOT call onSubmit when form is invalid", async () => {
    const { getByPlaceholderText, getByText } = sut({
      handleSubmit: result.current.handleSubmit,
    });

    const nameInput = getByPlaceholderText("Digite seu nome completo");
    const emailInput = getByPlaceholderText("Digite seu e-mail");
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const confirmPasswordInput = getByPlaceholderText("Confirme sua senha");
    const registerButton = getByText("Criar Conta");

    fireEvent.changeText(nameInput, "");
    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent.changeText(passwordInput, "123");
    fireEvent.changeText(confirmPasswordInput, "456");

    await act(async () => {
      fireEvent.press(registerButton);
    });

    expect(mockedOnSubmit).not.toHaveBeenCalled();
  });

  it("should NOT call onSubmit when passwords don't match", async () => {
    const { getByPlaceholderText, getByText } = sut({
      handleSubmit: result.current.handleSubmit,
    });

    const nameInput = getByPlaceholderText("Digite seu nome completo");
    const emailInput = getByPlaceholderText("Digite seu e-mail");
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const confirmPasswordInput = getByPlaceholderText("Confirme sua senha");
    const registerButton = getByText("Criar Conta");

    fireEvent.changeText(nameInput, "João Silva");
    fireEvent.changeText(emailInput, "teste@teste.com");
    fireEvent.changeText(passwordInput, "123456");
    fireEvent.changeText(confirmPasswordInput, "654321");

    await act(async () => {
      fireEvent.press(registerButton);
    });

    expect(mockedOnSubmit).not.toHaveBeenCalled();
  });
});
