import { AuthService } from "@/src/services/auth";
import { useLoginMutation } from "@/src/services/mutations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "./model";
export const useLoginViewModel = (service: AuthService) => {
  const router = useRouter();
  const { handleSubmit, control } = useForm<LoginFormData>({
    mode: "onSubmit",
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate: onLogin, isPending: isLoading } = useLoginMutation(service);

  const onSubmit = (data: LoginFormData) => {
    onLogin(data);
  };

  const handleGoToRegister = () => {
    router.navigate("/(signed-off)/register");
  };

  return { control, onSubmit, isLoading, handleSubmit, handleGoToRegister };
};
