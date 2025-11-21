import { useToast } from "@/src/components/toast";
import { AuthService } from "@/src/services/auth";
import { useLoginMutation } from "@/src/services/mutations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "./model";
export const useLoginViewModel = (service: AuthService) => {
  const router = useRouter();
  const { success } = useToast();
  const { handleSubmit, control, setFocus } = useForm<LoginFormData>({
    mode: "onSubmit",
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    mutate: onLogin,
    isPending: isLoading,
    isError,
  } = useLoginMutation(service);

  const onSubmit = (data: LoginFormData) => {
    onLogin(data, {
      onSuccess: () => {
        success("Login bem-sucedido!", "Bem-vindo de volta!");
        router.replace("/(signed-in)/(tabs)/home");
      },
    });
  };

  const handleGoToRegister = () => {
    router.navigate("/(signed-off)/register");
  };

  const handleFocusPasswordInput = () => {
    setFocus("password");
  };

  return {
    control,
    onSubmit,
    isLoading,
    handleSubmit,
    handleGoToRegister,
    handleFocusPasswordInput,
    isError,
  };
};
