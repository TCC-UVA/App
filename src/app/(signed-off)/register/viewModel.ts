import { AuthService } from "@/src/services/auth";
import { useRegisterMutation } from "@/src/services/mutations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { RegisterFormData, registerSchema } from "./model";

export const useRegisterViewModel = (service: AuthService) => {
  const router = useRouter();
  const { handleSubmit, control } = useForm<RegisterFormData>({
    mode: "onSubmit",
    resolver: yupResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", name: "" },
  });
  const { mutate: onRegister, isPending: isLoading } =
    useRegisterMutation(service);

  const onSubmit = (data: RegisterFormData) => {
    onRegister(data);
  };

  const handleGoToLogin = () => {
    router.navigate("/(signed-off)/login");
  };

  return { control, handleSubmit, onSubmit, isLoading, handleGoToLogin };
};
