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
require("react-native-reanimated").setUpTests();

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
  const { View } = require("react-native");
  return {
    Ionicons: View,
  };
});

const mockedHandleSubmit = jest.fn().mockImplementation((fn) => fn);
const mockedHandleGoToLogin = jest.fn();
const mockedHandleNextStep = jest.fn();
const mockedHandlePreviousStep = jest.fn();
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
    handleNextStep: mockedHandleNextStep,
    handlePreviousStep: mockedHandlePreviousStep,
    isLoading: false,
    onSubmit: mockedOnSubmit,
    currentStep: 1,
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

  it("Should render first step", () => {
    const { getByPlaceholderText, getByText } = sut({
      currentStep: 1,
    });

    const nameInput = getByPlaceholderText("Digite seu nome completo");
    const emailInput = getByPlaceholderText("Digite seu e-mail");
    const birthDateInput = getByPlaceholderText("DD/MM/AAAA");
    const registerButton = getByText("Próximo");
    const loginButton = getByText("Já tem conta? Faça Login");

    expect(nameInput).toBeOnTheScreen();
    expect(emailInput).toBeOnTheScreen();
    expect(birthDateInput).toBeOnTheScreen();
    expect(registerButton).toBeOnTheScreen();
    expect(loginButton).toBeOnTheScreen();
  });
  it("Should render second step", () => {
    const { getByPlaceholderText, getByText, getByTestId } = sut({
      currentStep: 2,
    });

    const password = getByPlaceholderText("Digite sua senha");
    const confirmPasswordInput = getByPlaceholderText("Confirme sua senha");
    const registerButton = getByTestId("register-create-account-button");

    const goBackButton = getByTestId("register-go-back-button");

    expect(password).toBeOnTheScreen();
    expect(confirmPasswordInput).toBeOnTheScreen();
    expect(registerButton).toBeOnTheScreen();
    expect(goBackButton).toBeOnTheScreen();
  });

  it("should display step 1/2 when currentStep is 1", () => {
    const { getByText } = sut({
      currentStep: 1,
    });

    const stepIndicator = getByText("Passo 1/2");
    expect(stepIndicator).toBeOnTheScreen();
  });

  it("should display step 2/2 when currentStep is 2", () => {
    const { getByText } = sut({
      currentStep: 2,
    });

    const stepIndicator = getByText("Passo 2/2");
    expect(stepIndicator).toBeOnTheScreen();
  });

  it("should render progress bar step indicator", async () => {
    const { getByTestId } = sut({
      currentStep: 1,
    });
    const stepIndicator = getByTestId("register-step-indicator");
    const progressBar = getByTestId("register-progress-bar");

    expect(stepIndicator).toBeOnTheScreen();
    expect(progressBar).toBeOnTheScreen();
  });

  it("Should call handleSubmit when register button is pressed", async () => {
    const { getByTestId } = sut({
      currentStep: 2,
    });

    await act(async () => {
      result.current.setValue("name", "John Doe");
      result.current.setValue("birthDate", "01/01/2000");
      result.current.setValue("email", "test@example.com");
      result.current.setValue("password", "123456");
      result.current.setValue("confirmPassword", "123456");

      await result.current.trigger();
    });

    const registerButton = getByTestId("register-create-account-button");

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
    const { queryByTestId } = sut({
      isLoading: true,
      currentStep: 2,
    });
    const loadingIndicator = queryByTestId("register-button-loading");

    expect(loadingIndicator).toBeOnTheScreen();
  });

  it("should show validate input error message", async () => {
    const { findByText } = sut();

    await act(async () => {
      result.current.setValue("email", "asdasd");
      await result.current.trigger();
    });

    expect(await findByText("Email inválido")).toBeOnTheScreen();
  });

  it("should show required input error messages in step 2", async () => {
    const { findByText } = sut({
      currentStep: 2,
    });

    await act(async () => {
      result.current.setValue("password", "");
      result.current.setValue("confirmPassword", "");

      await result.current.trigger();
    });

    expect(
      await findByText("Senha deve ter no mínimo 6 caracteres")
    ).toBeOnTheScreen();
    expect(
      await findByText("Confirmação de senha é obrigatória")
    ).toBeOnTheScreen();
  });
  it("should show required input error messages in step 2", async () => {
    const { findByText } = sut();

    await act(async () => {
      result.current.setValue("name", "");
      result.current.setValue("email", "");
      result.current.setValue("password", "");
      result.current.setValue("birthDate", "");

      await result.current.trigger();
    });

    expect(await findByText("Nome é obrigatório")).toBeOnTheScreen();
    expect(await findByText("Email é obrigatório")).toBeOnTheScreen();
    expect(
      await findByText("Data de nascimento é obrigatória")
    ).toBeOnTheScreen();
  });

  it("should show error when passwords don't match", async () => {
    const { findByText } = sut({
      currentStep: 2,
    });

    await act(async () => {
      result.current.setValue("password", "123456");
      result.current.setValue("confirmPassword", "654321");
      await result.current.trigger();
    });

    expect(await findByText("As senhas devem corresponder")).toBeOnTheScreen();
  });

  it("should has a secureTextEntry on password inputs", () => {
    const { getByPlaceholderText } = sut({
      currentStep: 2,
    });

    const passwordInput = getByPlaceholderText("Digite sua senha");
    const confirmPasswordInput = getByPlaceholderText("Confirme sua senha");

    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
  });

  it('should call onChange when type on "Nome" input', () => {
    const { getByPlaceholderText } = sut();

    const nameInput = getByPlaceholderText("Digite seu nome completo");

    act(() => {
      fireEvent.changeText(nameInput, "João Silva");
    });

    expect(result.current.getValues("name")).toBe("João Silva");
  });

  it('should call onChange when type on "E-mail" input', () => {
    const { getByPlaceholderText } = sut();

    const emailInput = getByPlaceholderText("Digite seu e-mail");

    fireEvent.changeText(emailInput, "teste@teste.com");
    expect(result.current.getValues("email")).toBe("teste@teste.com");
  });
  it('should call onChange when type on "Data de nascimento" input', () => {
    const { getByPlaceholderText } = sut();

    const birthDateInput = getByPlaceholderText("DD/MM/AAAA");

    act(() => {
      fireEvent.changeText(birthDateInput, "01/01/1990");
    });

    expect(result.current.getValues("birthDate")).toBe("01/01/1990");
  });

  it('should call onChange when type on "Senha" input', () => {
    const { getByPlaceholderText } = sut({
      currentStep: 2,
    });

    const passwordInput = getByPlaceholderText("Digite sua senha");

    act(() => {
      fireEvent.changeText(passwordInput, "123456");
    });

    expect(result.current.getValues("password")).toBe("123456");
  });

  it('should call onChange when type on "Confirmar Senha" input', () => {
    const { getByPlaceholderText } = sut({
      currentStep: 2,
    });

    const confirmPasswordInput = getByPlaceholderText("Confirme sua senha");

    act(() => {
      fireEvent.changeText(confirmPasswordInput, "123456");
    });

    expect(result.current.getValues("confirmPassword")).toBe("123456");
  });

  it("should call onSubmit with correct values when form is submitted and valid", async () => {
    const { getByPlaceholderText, rerender, getByTestId } = sut({
      handleSubmit: result.current.handleSubmit,
      currentStep: 1,
    });

    const nameInput = getByPlaceholderText("Digite seu nome completo");
    const emailInput = getByPlaceholderText("Digite seu e-mail");
    const birthDateInput = getByPlaceholderText("DD/MM/AAAA");

    act(() => {
      fireEvent.changeText(nameInput, "João Silva");
      fireEvent.changeText(emailInput, "teste@teste.com");
      fireEvent.changeText(birthDateInput, "01/01/1990");
    });

    // Rerender to step 2
    act(() => {
      rerender(
        <WrapperUi>
          <RegisterView
            control={result.current.control}
            handleSubmit={result.current.handleSubmit}
            handleGoToLogin={mockedHandleGoToLogin}
            handleNextStep={mockedHandleNextStep}
            handlePreviousStep={mockedHandlePreviousStep}
            isLoading={false}
            onSubmit={mockedOnSubmit}
            currentStep={2}
          />
        </WrapperUi>
      );
    });

    // Fill step 2 fields
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const confirmPasswordInput = getByPlaceholderText("Confirme sua senha");
    const registerButton = getByTestId("register-create-account-button");

    act(() => {
      fireEvent.changeText(passwordInput, "123456");
      fireEvent.changeText(confirmPasswordInput, "123456");
    });

    await act(async () => {
      fireEvent.press(registerButton);
    });

    expect(mockedOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockedOnSubmit.mock.calls[0][0]).toEqual({
      name: "João Silva",
      email: "teste@teste.com",
      birthDate: "01/01/1990",
      password: "123456",
      confirmPassword: "123456",
    });
  });

  it("Should call handleChangeStep when form is invalid and user is on step 1", async () => {
    const { getByPlaceholderText, getByTestId } = sut({
      handleSubmit: result.current.handleSubmit,
    });

    const nameInput = getByPlaceholderText("Digite seu nome completo");
    const emailInput = getByPlaceholderText("Digite seu e-mail");
    const birthDateInput = getByPlaceholderText("DD/MM/AAAA");

    const nextStepButton = getByTestId("register-next-step-button");

    await act(async () => {
      fireEvent.changeText(nameInput, "");
      fireEvent.changeText(emailInput, "invalidemail");
      fireEvent.changeText(birthDateInput, "0000");
      fireEvent.press(nextStepButton);
    });

    expect(mockedOnSubmit).not.toHaveBeenCalled();
  });

  it('should call handlePreviousStep when "Voltar" button is pressed', () => {
    const { getByTestId } = sut({
      currentStep: 2,
    });

    const goBackButton = getByTestId("register-go-back-button");

    expect(goBackButton).toBeOnTheScreen();

    fireEvent.press(goBackButton);

    expect(mockedHandlePreviousStep).toHaveBeenCalled();
    expect(mockedHandlePreviousStep).toHaveBeenCalledTimes(1);
  });
});
